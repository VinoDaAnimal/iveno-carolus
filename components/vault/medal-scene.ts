import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { MedalResult } from "@/lib/data";

type Colors = { gold: string; silver: string; bronze: string };

function engrave(lines: [text: string, size: number, y: number, weight: number][], font: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(256, 200, 40, 256, 256, 256);
  grad.addColorStop(0, "white");
  grad.addColorStop(1, "rgb(185,185,185)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "rgb(138,138,138)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(256, 256, 226, 0, Math.PI * 2);
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const [text, size, y, weight] of lines) {
    g.font = `${weight} ${size}px ${font}`;
    g.fillStyle = "white";
    g.fillText(text, 258, y + 3);
    g.fillStyle = "rgb(74,74,74)";
    g.fillText(text, 256, y);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.center.set(0.5, 0.5);
  t.rotation = Math.PI / 2; // cylinder cap UVs run sideways
  return t;
}

function wrap(text: string, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) { out.push(line.trim()); line = w; } else line += " " + w;
  }
  return [...out, line.trim()].slice(0, 4);
}

/** Eight engraved coins: rank and field on the front, the competition on the back. */
export function createMedalScene(
  canvas: HTMLCanvasElement,
  medals: MedalResult[],
  colors: Colors,
  font: string,
  reduce: boolean,
  onPick: (i: number) => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const sweep = new THREE.PointLight(0xffffff, 40, 12);
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-3, 4, 6);
  scene.add(sweep, key, new THREE.HemisphereLight(0xffffff, 0x223322, 1.2));

  const disc = new THREE.CylinderGeometry(1, 1, 0.14, 96).rotateX(Math.PI / 2);
  const textures: THREE.Texture[] = [];
  const coins = medals.map((f, i) => {
    const base = { color: new THREE.Color(colors[f.medal]), metalness: 0.85, roughness: f.medal === "gold" ? 0.25 : 0.35, envMapIntensity: 1.6 };
    const back = wrap(f.name, 16);
    const front = engrave([[String(f.rank), 190, 230, 700], [`of ${f.field}`, 64, 360, 500]], font);
    const rear = engrave(back.map((l, k) => [l, 44, 256 + (k - (back.length - 1) / 2) * 56, 600]), font);
    textures.push(front, rear);
    const mesh = new THREE.Mesh(disc, [
      new THREE.MeshStandardMaterial(base),
      new THREE.MeshStandardMaterial({ ...base, map: front }),
      new THREE.MeshStandardMaterial({ ...base, map: rear }),
    ]);
    mesh.userData = { i, medal: f.medal, flip: 0, drop: reduce ? 0 : 6 + i * 0.6, home: new THREE.Vector3() };
    scene.add(mesh);
    return mesh;
  });

  let selected = -1;
  let visible = false;
  let frame = 0;

  const layout = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const cols = w / h > 1.3 ? 4 : 2, rows = Math.ceil(coins.length / cols), gap = 2.5;
    coins.forEach((m, i) => m.userData.home.set((i % cols - (cols - 1) / 2) * gap, -(Math.floor(i / cols) - (rows - 1) / 2) * gap, 0));
    const span = Math.max((cols * gap) / camera.aspect, rows * gap) * 0.62;
    camera.position.set(0, 0, span / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(layout);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !frame) frame = requestAnimationFrame(tick);
  });
  io.observe(canvas);

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const onClick = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(coins)[0];
    if (hit) onPick(hit.object.userData.i);
  };
  canvas.addEventListener("click", onClick);

  const timer = new THREE.Timer();
  function tick() {
    frame = 0;
    if (!visible) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05), t = timer.getElapsed();
    const k = reduce ? 1 : 1 - Math.pow(0.02, dt);
    sweep.position.set(Math.sin(t * 0.5) * 6, Math.cos(t * 0.3) * 2, 3);
    for (const m of coins) {
      const u = m.userData;
      u.drop += (0 - u.drop) * k * 0.6;
      // Rarity reads as motion: golds sway, silvers stir, bronzes rest.
      const sway = reduce ? 0 : u.medal === "gold" ? Math.sin(t * 0.8 + u.i) * 0.35 : u.medal === "silver" ? Math.sin(t * 0.6 + u.i) * 0.15 : 0;
      u.flip += ((u.i === selected ? Math.PI : 0) - u.flip) * k;
      m.rotation.y = u.flip + sway;
      m.position.set(u.home.x, u.home.y + u.drop, u.i === selected ? 0.8 : 0);
    }
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  return {
    select(i: number) { selected = i; },
    dispose() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("click", onClick);
      textures.forEach((t) => t.dispose());
      coins.forEach((m) => (m.material as THREE.Material[]).forEach((x) => x.dispose()));
      disc.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
