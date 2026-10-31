import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { MedalResult } from "@/lib/data";

type Colors = { gold: string; silver: string; bronze: string };

const FACE_R = 0.84; // inner field, inside the raised rim
const SIZE = 512;

/** Stamped face: light field, dark (recessed) lettering and a laurel ring. Also used as the bump map. */
function face(lines: [text: string, size: number, y: number, weight: number][], font: string) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(220, 190, 30, 256, 256, 260);
  grad.addColorStop(0, "rgb(250,250,250)");
  grad.addColorStop(1, "rgb(196,196,196)");
  g.fillStyle = grad;
  g.fillRect(0, 0, SIZE, SIZE);
  // Laurel: two arcs of leaves meeting at the bottom.
  g.fillStyle = "rgb(120,120,120)";
  for (const side of [-1, 1]) {
    for (let k = 0; k < 13; k++) {
      const a = Math.PI / 2 + side * (0.25 + k * 0.17);
      g.save();
      g.translate(256 + Math.cos(a) * 214, 256 + Math.sin(a) * 214);
      g.rotate(a + side * 0.9);
      g.beginPath();
      g.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const [text, size, y, weight] of lines) {
    g.font = `${weight} ${size}px ${font}`;
    g.fillStyle = "rgb(255,255,255)";
    g.fillText(text, 257, y + 3); // catch-light under the stamp
    g.fillStyle = "rgb(70,70,70)";
    g.fillText(text, 256, y);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Concentric brushing for the rim and faces. */
function brushed() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "rgb(110,110,110)";
  g.fillRect(0, 0, 256, 256);
  for (let r = 2; r < 182; r += 1.5) {
    const v = 90 + Math.floor(Math.random() * 60);
    g.strokeStyle = `rgb(${v},${v},${v})`;
    g.beginPath();
    g.arc(128, 128, r, 0, Math.PI * 2);
    g.stroke();
  }
  return new THREE.CanvasTexture(c);
}

function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) { out.push(line.trim()); line = w; } else line += " " + w;
  }
  return [...out, line.trim()].slice(0, 4);
}

/**
 * Struck medals: rank and field on the front, the competition on the back.
 * One row centred on the selected medal; swipe or use the arrows to move along it.
 */
export function createMedalScene(
  canvas: HTMLCanvasElement,
  medals: MedalResult[],
  colors: Colors,
  font: string,
  reduce: boolean,
  onPick: (i: number) => void,
  onReady: () => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const sweep = new THREE.PointLight(0xffffff, 40, 14);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-3, 4, 6);
  scene.add(sweep, key, new THREE.HemisphereLight(0xffffff, 0x223322, 1.0));

  // Body: rim, bevel and edge turned on a lathe, faces sunk inside the rim.
  const profile = [
    [0, 0.07], [FACE_R, 0.07], [0.87, 0.115], [0.97, 0.115], [1, 0.085],
    [1, -0.085], [0.97, -0.115], [0.87, -0.115], [FACE_R, -0.07], [0, -0.07],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.LatheGeometry(profile, 128).rotateX(Math.PI / 2);
  const front = new THREE.CircleGeometry(FACE_R, 96).translate(0, 0, 0.071);
  const back = new THREE.CircleGeometry(FACE_R, 96).rotateY(Math.PI).translate(0, 0, -0.071);
  const loop = new THREE.TorusGeometry(0.13, 0.035, 16, 48).translate(0, 1.12, 0);
  const brush = brushed();

  const textures: THREE.Texture[] = [brush];
  const coins = medals.map((f, i) => {
    const metal = { color: new THREE.Color(colors[f.medal]).lerp(new THREE.Color(0xffffff), 0.18), metalness: 1, roughness: f.medal === "gold" ? 0.26 : 0.32, roughnessMap: brush, envMapIntensity: 1.5 };
    const name = wrap(f.name, 16);
    const fFace = face([[String(f.rank), 170, 236, 700], [`of ${f.field}`, 58, 350, 600], [f.medal.toUpperCase(), 30, 120, 700]], font);
    const bFace = face([...name.map((l, k): [string, number, number, number] => [l, 40, 250 + (k - (name.length - 1) / 2) * 50, 600])], font);
    textures.push(fFace, bFace);
    const coin = new THREE.Group();
    coin.add(
      new THREE.Mesh(body, new THREE.MeshStandardMaterial(metal)),
      new THREE.Mesh(loop, new THREE.MeshStandardMaterial(metal)),
      new THREE.Mesh(front, new THREE.MeshStandardMaterial({ ...metal, map: fFace, bumpMap: fFace, bumpScale: 3 })),
      new THREE.Mesh(back, new THREE.MeshStandardMaterial({ ...metal, map: bFace, bumpMap: bFace, bumpScale: 3 })),
    );
    coin.children.forEach((c) => (c.userData.i = i));
    coin.userData = { i, medal: f.medal, flip: 0, home: new THREE.Vector3() };
    scene.add(coin);
    return coin;
  });

  let selected = 0;
  let visible = false;
  let frame = 0;
  let shown = -1; // time the stage first became visible, for the drop-in
  let ready = false;
  const camX = { cur: 0, target: 0 };
  const GAP_ROW = 2.35;

  const layout = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // One row centred on the selected medal: it fills ~80% of the height and its neighbours peek in.
    coins.forEach((m, i) => m.userData.home.set(i * GAP_ROW, 0, 0));
    camera.position.z = 1.55 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camX.target = selected * GAP_ROW;
    if (reduce) camX.cur = camX.target;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(layout);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  // Tap a medal to select it; on the single row, swipe to move to the next one.
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downX = 0, downY = 0;
  const onDown = (e: PointerEvent) => { downX = e.clientX; downY = e.clientY; };
  const onUp = (e: PointerEvent) => {
    const dx = e.clientX - downX, dy = e.clientY - downY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { onPick(selected - Math.sign(dx)); return; }
    if (Math.hypot(dx, dy) > 10) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(coins, true)[0];
    if (hit) onPick(hit.object.userData.i);
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);

  const timer = new THREE.Timer();
  function tick() {
    frame = 0;
    if (!visible) return;
    timer.update();
    // Generous cap: slow phones get bigger steps instead of a stalled scene.
    const dt = Math.min(timer.getDelta(), 0.25), t = timer.getElapsed();
    const k = reduce ? 1 : 1 - Math.pow(0.02, dt);
    if (shown < 0) shown = t;
    // Drop-in on elapsed time, not frames: finished 1.1s after the stage is first seen.
    camX.cur += (camX.target - camX.cur) * k;
    camera.position.x = camX.cur;
    camera.lookAt(camX.cur, 0, 0);
    sweep.position.set(camX.cur + Math.sin(t * 0.5) * 6, Math.cos(t * 0.3) * 2, 3);
    for (const m of coins) {
      const u = m.userData;
      const p = reduce ? 1 : Math.min(1, (t - shown - u.i * 0.06) / 0.8);
      const drop = p <= 0 ? 6 : 6 * Math.pow(1 - p, 3);
      // Rarity reads as motion: golds sway, silvers stir, bronzes rest.
      const sway = reduce ? 0 : u.medal === "gold" ? Math.sin(t * 0.8 + u.i) * 0.32 : u.medal === "silver" ? Math.sin(t * 0.6 + u.i) * 0.14 : 0;
      u.flip += ((u.i === selected ? Math.PI : 0) - u.flip) * k;
      m.rotation.y = u.flip + sway;
      m.position.set(u.home.x, u.home.y + drop, u.i === selected ? 0.6 : 0);
    }
    renderer.render(scene, camera);
    // Hand over from the CSS placeholder once the coins have landed.
    if (!ready && t - shown > 0.9) { ready = true; onReady(); }
    frame = requestAnimationFrame(tick);
  }

  return {
    select(i: number) {
      selected = i;
      camX.target = i * GAP_ROW;
    },
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      textures.forEach((t) => t.dispose());
      coins.forEach((c) => c.children.forEach((m) => ((m as THREE.Mesh).material as THREE.Material).dispose()));
      [body, front, back, loop].forEach((g) => g.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
