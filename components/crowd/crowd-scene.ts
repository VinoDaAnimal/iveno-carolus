import * as THREE from "three";
import type { Medal } from "@/lib/data";

type Field = { medal: Medal; rank: number; field: number };
type Colors = { stage: string; block: string; gold: string; silver: string; bronze: string };

const PER_ROW = 16;
const LANE_GAP = 5;

/** Every entrant as a block, one lane per competition, first place in the front row. */
export function createCrowdScene(canvas: HTMLCanvasElement, fields: Field[], colors: Colors, reduce: boolean) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(colors.stage), 45, 150);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
  scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(colors.block), 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(20, 40, 25);
  scene.add(sun);

  const medalColor = { gold: new THREE.Color(colors.gold), silver: new THREE.Color(colors.silver), bronze: new THREE.Color(colors.bronze) };
  const box = new THREE.BoxGeometry(0.78, 0.4, 0.78).translate(0, 0.2, 0);
  const total = fields.reduce((s, f) => s + f.field, 0);
  const crowd = new THREE.InstancedMesh(box, new THREE.MeshStandardMaterial({ color: new THREE.Color(colors.block), roughness: 0.85 }), total - fields.length);
  const halfW = (fields.length * (PER_ROW + LANE_GAP) - LANE_GAP) / 2;
  const m4 = new THREE.Matrix4();
  const mine: THREE.Mesh[] = [];
  let n = 0;
  fields.forEach((f, lane) => {
    const x0 = lane * (PER_ROW + LANE_GAP) - halfW + 0.5;
    for (let r = 1; r <= f.field; r++) {
      const x = x0 + ((r - 1) % PER_ROW);
      const z = -Math.floor((r - 1) / PER_ROW);
      if (r === f.rank) {
        const c = medalColor[f.medal];
        const mesh = new THREE.Mesh(box, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.3 }));
        mesh.position.set(x, 0, z);
        mesh.scale.y = reduce ? 6 : 0.01;
        scene.add(mesh);
        mine.push(mesh);
      } else {
        crowd.setMatrixAt(n++, m4.makeTranslation(x, 0, z));
      }
    }
  });
  scene.add(crowd);

  const overview = { pos: new THREE.Vector3(18, 34, 46), look: new THREE.Vector3(6, 0, -12) };
  const shots = [overview, ...mine.map((m) => ({
    pos: new THREE.Vector3(m.position.x + 7, 9, m.position.z + 15),
    look: new THREE.Vector3(m.position.x, 2, m.position.z),
  }))];
  const camPos = overview.pos.clone();
  const camLook = overview.look.clone();
  let shot = 0;
  let visible = false;
  let frame = 0;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 58 : 40;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  const timer = new THREE.Timer();
  function tick() {
    frame = 0;
    if (!visible) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05);
    const k = reduce ? 1 : 1 - Math.pow(0.015, dt);
    camPos.lerp(shots[shot].pos, k);
    camLook.lerp(shots[shot].look, k);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    // The blocks rise once, when the crowd is first seen.
    mine.forEach((m, i) => { m.scale.y += (6 - m.scale.y) * (reduce ? 1 : Math.min(1, dt * (1.6 + i * 0.25))); });
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  return {
    setShot(i: number) { shot = Math.max(0, Math.min(shots.length - 1, i)); },
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      box.dispose();
      crowd.material.dispose();
      mine.forEach((m) => (m.material as THREE.Material).dispose());
      renderer.dispose();
    },
  };
}
