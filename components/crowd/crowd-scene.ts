import * as THREE from "three";
import type { Medal } from "@/lib/data";

type Field = { medal: Medal; rank: number; field: number };
type Colors = { stage: string; block: string; gold: string; silver: string; bronze: string };
/** Canvas-pixel rectangle the shot must fit inside (the part the result card leaves free). */
export type Safe = { left: number; top: number; right: number; bottom: number };

const GAP = 6;
const RISE = 6; // his block is this many times taller than the crowd
const BLOCK_H = 0.4;

type Shot = { pos: THREE.Vector3; look: THREE.Vector3; sx: number; sy: number };

/**
 * Every entrant as a block. Each competition is a square-ish field, ranks running left to right
 * then back, so first place is the front-left block. Each shot frames one whole field.
 */
export function createCrowdScene(
  canvas: HTMLCanvasElement,
  fields: Field[],
  colors: Colors,
  reduce: boolean,
  labels: { first: HTMLElement; me: HTMLElement },
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
  const scene = new THREE.Scene();
  // Near/far follow the camera distance each frame, so far shots don't vanish into fog.
  scene.fog = new THREE.Fog(new THREE.Color(colors.stage), 120, 320);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 6000);
  scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(colors.block), 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(-20, 40, 30);
  scene.add(sun);

  const medalColor = { gold: new THREE.Color(colors.gold), silver: new THREE.Color(colors.silver), bronze: new THREE.Color(colors.bronze) };
  const box = new THREE.BoxGeometry(0.78, BLOCK_H, 0.78).translate(0, BLOCK_H / 2, 0);
  const total = fields.reduce((s, f) => s + f.field, 0);
  const crowd = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.block), roughness: 0.85 }), total - fields.length);
  const m4 = new THREE.Matrix4();

  const lanes: { bounds: THREE.Box3; first: THREE.Vector3; me: THREE.Mesh }[] = [];
  // Fields sit in a square-ish grid of equal cells (best finish front-left), so the overview reads on a phone too.
  const PER = Math.ceil(Math.sqrt(fields.length));
  const CELL = Math.max(...fields.map((f) => Math.ceil(Math.sqrt(f.field)))) + GAP;
  let n = 0;
  fields.forEach((f, i) => {
    const x0 = (i % PER) * CELL;
    const z0 = -Math.floor(i / PER) * CELL;
    const cols = Math.ceil(Math.sqrt(f.field));
    const rows = Math.ceil(f.field / cols);
    let me!: THREE.Mesh;
    for (let r = 1; r <= f.field; r++) {
      const x = x0 + ((r - 1) % cols) + 0.5;
      const z = z0 - Math.floor((r - 1) / cols) - 0.5;
      if (r === f.rank) {
        const c = medalColor[f.medal];
        me = new THREE.Mesh(box, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.3 }));
        me.position.set(x, 0, z);
        me.scale.y = reduce ? RISE : 0.01;
        scene.add(me);
      } else {
        crowd.setMatrixAt(n++, m4.makeTranslation(x, 0, z));
      }
    }
    lanes.push({
      bounds: new THREE.Box3(new THREE.Vector3(x0, 0, z0 - rows), new THREE.Vector3(x0 + cols, BLOCK_H * RISE, z0)),
      first: new THREE.Vector3(x0 + 0.5, BLOCK_H, z0 - 0.5),
      me,
    });
  });
  scene.add(crowd);
  // Centre the whole crowd on the origin.
  const shift = new THREE.Vector3(-(PER * CELL - GAP) / 2, 0, CELL / 2);
  scene.children.forEach((o) => { if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) o.position.add(shift); });
  lanes.forEach((l) => { l.bounds.translate(shift); l.first.add(shift); });
  const all = lanes.reduce((b, l) => b.union(l.bounds), new THREE.Box3());

  const FIELD_VIEW = new THREE.Vector3(-0.32, 1.15, 1).normalize(); // from the front-left, above
  const CROWD_VIEW = new THREE.Vector3(0.25, 1.1, 1).normalize();

  let w = 1, h = 1;
  let shot = 0;
  let safe: Safe = { left: 0, top: 0, right: 1, bottom: 1 };
  let target: Shot | null = null;
  const cur: Shot = { pos: new THREE.Vector3(), look: new THREE.Vector3(), sx: 0.5, sy: 0.5 };
  const probe = new THREE.Vector3();

  // Shift the projection centre to the middle of the free area, then back off until all
  // eight corners of the field land inside it.
  function frame(b: THREE.Box3, dir: THREE.Vector3): Shot {
    const sx = (safe.left + safe.right) / 2, sy = (safe.top + safe.bottom) / 2;
    applyOffset(sx, sy);
    const look = b.getCenter(new THREE.Vector3());
    const xMin = (safe.left / w) * 2 - 1, xMax = (safe.right / w) * 2 - 1;
    const yMin = 1 - (safe.bottom / h) * 2, yMax = 1 - (safe.top / h) * 2;
    const corners = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => new THREE.Vector3(
      i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z));
    let lo = 1, hi = 4000;
    for (let k = 0; k < 28; k++) {
      const d = (lo + hi) / 2;
      camera.position.copy(look).addScaledVector(dir, d);
      camera.lookAt(look);
      camera.updateMatrixWorld();
      const fits = corners.every((c) => {
        probe.copy(c).project(camera);
        // z outside (-1, 1) means behind the camera, where x/y flip and falsely "fit".
        return probe.z > -1 && probe.z < 1 && probe.x >= xMin && probe.x <= xMax && probe.y >= yMin && probe.y <= yMax;
      });
      if (fits) hi = d; else lo = d;
    }
    return { pos: look.clone().addScaledVector(dir, hi * 1.04), look, sx, sy };
  }

  function applyOffset(sx: number, sy: number) {
    const dx = sx - w / 2, dy = sy - h / 2;
    const fw = w + 2 * Math.abs(dx), fh = h + 2 * Math.abs(dy);
    camera.aspect = fw / fh;
    camera.setViewOffset(fw, fh, fw / 2 - sx, fh / 2 - sy, w, h);
  }

  function aim() {
    target = shot === 0 ? frame(all, CROWD_VIEW) : frame(lanes[shot - 1].bounds, FIELD_VIEW);
    if (reduce || cur.pos.lengthSq() === 0) {
      cur.pos.copy(target.pos); cur.look.copy(target.look); cur.sx = target.sx; cur.sy = target.sy;
    }
  }

  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    aim();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  let visible = false;
  let frameId = 0;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !frameId) frameId = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  function place(el: HTMLElement, p: THREE.Vector3 | null) {
    if (!p) { el.style.visibility = "hidden"; return; }
    probe.copy(p).project(camera);
    el.style.visibility = "visible";
    el.style.transform = `translate(${((probe.x + 1) / 2) * w}px, ${((1 - probe.y) / 2) * h}px) translate(-50%, -100%)`;
  }

  const timer = new THREE.Timer();
  const top = new THREE.Vector3();
  function tick() {
    frameId = 0;
    if (!visible || !target) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const k = reduce ? 1 : 1 - Math.pow(0.012, dt);
    cur.pos.lerp(target.pos, k);
    cur.look.lerp(target.look, k);
    cur.sx += (target.sx - cur.sx) * k;
    cur.sy += (target.sy - cur.sy) * k;
    applyOffset(cur.sx, cur.sy);
    camera.position.copy(cur.pos);
    camera.lookAt(cur.look);
    camera.updateMatrixWorld();
    const dist = cur.pos.distanceTo(cur.look);
    const fog = scene.fog as THREE.Fog;
    fog.near = dist * 0.9;
    fog.far = dist * 2.2;
    lanes.forEach((l, i) => { l.me.scale.y += (RISE - l.me.scale.y) * (reduce ? 1 : Math.min(1, dt * (1.6 + i * 0.25))); });
    const lane = shot > 0 ? lanes[shot - 1] : null;
    place(labels.first, lane && lane.first);
    place(labels.me, lane && top.copy(lane.me.position).setY(BLOCK_H * lane.me.scale.y));
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(tick);
  }

  return {
    setShot(i: number, area: Safe) {
      shot = Math.max(0, Math.min(lanes.length, i));
      safe = area;
      aim();
    },
    dispose() {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      io.disconnect();
      box.dispose();
      crowd.material.dispose();
      lanes.forEach((l) => (l.me.material as THREE.Material).dispose());
      renderer.dispose();
    },
  };
}
