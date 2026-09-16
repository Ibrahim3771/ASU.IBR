import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const W = 3.8;
const L = 10.86;
const H = 3.15;
const HALF = W / 2;

const views = [
  { id: "front", title: "الواجهة", text: "شعار درر فوق الباب الزجاجي، وإضاءة ذهبية على الحجر الكريمي.", cam: [0, 1.7, -4.2], look: [0, 1.4, 2] },
  { id: "enter", title: "الدخول", text: "الممر الأوسط: كنب يسارًا وبار يمينًا بطول المحل.", cam: [0.05, 1.55, 0.55], look: [0.1, 1.2, 7] },
  { id: "tables", title: "الطاولات", text: "طاولة رخام لشخصين قرب الواجهة — 4 مقاعد.", cam: [0.7, 1.35, 1.1], look: [-0.9, 0.8, 2.1] },
  { id: "sofa", title: "الكنب", text: "كنب مخملي بطول الجدار مع طاولات لؤلؤ دائرية.", cam: [0.55, 1.4, 4.4], look: [-1.2, 0.9, 5.2] },
  { id: "bar", title: "البار", text: "سطح رخام وخشب جوز و3 كراسي جلد، مع شعار درر.", cam: [-0.35, 1.45, 3.3], look: [1.2, 1.15, 5.2] },
  { id: "bath", title: "الحمّام", text: "دورة مياه فاخرة 1.55 × 2.20 م في نهاية المحل.", cam: [-0.9, 1.45, 8.2], look: [-1.1, 1.1, 9.7] },
];

const holder = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
holder.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#1a1410");
scene.fog = new THREE.Fog("#1a1410", 14, 28);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 80);
camera.position.set(0, 1.7, -4.2);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.target.set(0, 1.3, 4.5);
orbit.maxPolarAngle = Math.PI * 0.48;
orbit.minDistance = 0.8;
orbit.maxDistance = 12;

const walker = new PointerLockControls(camera, renderer.domElement);

const key = {};
let walking = false;

function marbleTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#f0e6d4";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 70; i += 1) {
    g.strokeStyle = `rgba(180,150,110,${0.08 + Math.random() * 0.12})`;
    g.beginPath();
    g.moveTo(Math.random() * 512, Math.random() * 512);
    g.bezierCurveTo(Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 16);
  return t;
}

const mats = {
  wall: new THREE.MeshStandardMaterial({ color: "#efe4d2", roughness: 0.72 }),
  floor: new THREE.MeshStandardMaterial({ map: marbleTexture(), roughness: 0.28, metalness: 0.08 }),
  ceiling: new THREE.MeshStandardMaterial({ color: "#f7f1e6", roughness: 0.9 }),
  walnut: new THREE.MeshStandardMaterial({ color: "#4a3424", roughness: 0.45 }),
  marble: new THREE.MeshStandardMaterial({ color: "#f2e8d6", roughness: 0.22, metalness: 0.12 }),
  brass: new THREE.MeshStandardMaterial({ color: "#c4a15a", metalness: 0.85, roughness: 0.28 }),
  velvet: new THREE.MeshStandardMaterial({ color: "#d9c3a1", roughness: 0.85 }),
  leather: new THREE.MeshStandardMaterial({ color: "#7a4328", roughness: 0.55 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#d7e6f2", transparent: true, opacity: 0.22, roughness: 0.05, transmission: 0.6, thickness: 0.04 }),
  gold: new THREE.MeshStandardMaterial({ color: "#d4b56a", emissive: "#6a4d18", emissiveIntensity: 0.35, metalness: 0.7, roughness: 0.3 }),
  light: new THREE.MeshStandardMaterial({ color: "#fff4d8", emissive: "#ffd79a", emissiveIntensity: 1.6 }),
  dark: new THREE.MeshStandardMaterial({ color: "#2a2118", roughness: 0.7 }),
};

function add(geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  return m;
}

function box(w, h, d, mat, x, y, z) {
  return add(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
}

scene.add(new THREE.HemisphereLight("#fff6e8", "#3a2a1c", 0.7));
const sun = new THREE.DirectionalLight("#ffe6c2", 1.15);
sun.position.set(-4, 8, -3);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);
scene.add(new THREE.AmbientLight("#c9b48a", 0.28));

box(W + 0.24, H, 0.12, mats.wall, 0, H / 2, L);
box(0.12, H, L, mats.wall, -HALF, H / 2, L / 2);
box(0.12, H, L, mats.wall, HALF, H / 2, L / 2);
add(new THREE.PlaneGeometry(W, L), mats.floor, 0, 0, L / 2, -Math.PI / 2);
add(new THREE.PlaneGeometry(W, L), mats.ceiling, 0, H, L / 2, Math.PI / 2);

box(W + 0.5, 0.7, 0.28, mats.wall, 0, H + 0.2, -0.2);
box(0.28, H + 0.6, 0.28, mats.wall, -HALF - 0.08, (H + 0.4) / 2, -0.05);
box(0.28, H + 0.6, 0.28, mats.wall, HALF + 0.08, (H + 0.4) / 2, -0.05);
add(new THREE.PlaneGeometry(1.6, 0.55), mats.gold, 0, H + 0.18, -0.35);
box(1.05, 2.35, 0.06, mats.glass, 0, 1.2, 0.03);
box(1.2, 2.5, 0.05, mats.brass, 0, 1.2, 0.0);
box(1.28, 2.4, 0.04, mats.glass, -1.15, 1.2, 0.03);
box(1.28, 2.4, 0.04, mats.glass, 1.15, 1.2, 0.03);

function tableSquare(x, z) {
  box(0.7, 0.06, 0.7, mats.marble, x, 0.76, z);
  box(0.18, 0.73, 0.18, mats.walnut, x, 0.36, z);
  chair(x - 0.48, z, Math.PI / 2);
  chair(x + 0.48, z, -Math.PI / 2);
}

function chair(x, z, rot) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.42), mats.leather);
  seat.position.y = 0.48;
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.08), mats.leather);
  back.position.set(0, 0.7, -0.17);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.38), mats.brass);
  leg.position.y = 0.22;
  g.add(seat, back, leg);
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  g.traverse((n) => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });
  scene.add(g);
}

tableSquare(-0.92, 1.35);
tableSquare(-0.92, 2.4);

box(0.64, 0.44, 4.5, mats.velvet, -HALF + 0.38, 0.22, 5.25);
box(0.12, 0.52, 4.5, mats.velvet, -HALF + 0.12, 0.58, 5.25);
box(0.64, 0.06, 4.5, mats.walnut, -HALF + 0.38, 0.02, 5.25);

function roundTable(x, z) {
  add(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 24), mats.marble, x, 0.54, z);
  add(new THREE.CylinderGeometry(0.05, 0.08, 0.52, 12), mats.brass, x, 0.26, z);
}

roundTable(-0.72, 3.7);
roundTable(-0.72, 5.0);
roundTable(-0.72, 6.35);

box(0.64, 1.08, 6.3, mats.walnut, 0.74, 0.54, 4.9);
box(0.68, 0.07, 6.34, mats.marble, 0.74, 1.12, 4.9);
box(0.08, 0.04, 6.34, mats.brass, 0.42, 1.08, 4.9);
box(0.78, 2.1, 6.3, mats.walnut, 1.46, 1.05, 4.9);
box(0.72, 0.9, 2.2, mats.light, 1.46, 1.7, 3.7);

function stool(z) {
  add(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), mats.leather, 0.22, 0.82, z);
  add(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), mats.brass, 0.22, 0.4, z);
  add(new THREE.TorusGeometry(0.16, 0.015, 8, 20), mats.brass, 0.22, 0.28, z, Math.PI / 2);
}

stool(2.7);
stool(4.15);
stool(5.6);

box(0.08, 0.9, 6.2, mats.gold, HALF - 0.08, 2.55, 4.9);

box(1.55, 2.6, 0.1, mats.wall, -1.125, 1.3, 8.66);
box(0.1, 2.6, 2.2, mats.wall, -0.35, 1.3, 9.76);
box(0.08, 2.05, 0.7, mats.walnut, -0.35, 1.05, 9.05);
box(0.38, 0.42, 0.52, mats.marble, -1.45, 0.22, 10.15);
box(0.7, 0.08, 0.42, mats.marble, -0.85, 0.9, 10.45);
box(0.66, 0.38, 0.38, mats.walnut, -0.85, 0.68, 10.45);
add(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 24), mats.brass, -0.85, 1.55, 10.52);
add(new THREE.CircleGeometry(0.16, 24), mats.gold, -0.85, 1.55, 10.51);

box(1.35, 2.6, 0.1, mats.walnut, 1.225, 1.3, 8.66);
box(1.3, 2.2, 2.1, mats.dark, 1.22, 1.1, 9.76);

const loader = new THREE.TextureLoader();
loader.load("assets/images/durar-logo.png", (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace;
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(1.15, 1.15),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.4 })
  );
  logo.position.set(-HALF + 0.07, 1.95, 4.7);
  logo.rotation.y = Math.PI / 2;
  scene.add(logo);

  const fascia = logo.clone();
  fascia.scale.set(1.2, 0.55, 1);
  fascia.position.set(0, H + 0.18, -0.36);
  fascia.rotation.y = 0;
  scene.add(fascia);

  const barLogo = logo.clone();
  barLogo.position.set(1.06, 2.15, 6.7);
  barLogo.rotation.y = Math.PI;
  barLogo.scale.set(0.85, 0.85, 1);
  scene.add(barLogo);
});

function pendant(z) {
  add(new THREE.SphereGeometry(0.16, 20, 16), mats.light, 0.05, 2.42, z);
  add(new THREE.CylinderGeometry(0.01, 0.01, 0.7, 6), mats.brass, 0.05, 2.85, z);
  const p = new THREE.PointLight("#ffd7a0", 6, 5.5, 2);
  p.position.set(0.05, 2.35, z);
  p.castShadow = false;
  scene.add(p);
}

pendant(2.15);
pendant(4.7);
pendant(7.2);

const sofaGlow = new THREE.PointLight("#ffd9a8", 4.5, 6, 2);
sofaGlow.position.set(-1.2, 2.2, 5.2);
scene.add(sofaGlow);

add(new THREE.PlaneGeometry(18, 18), new THREE.MeshStandardMaterial({ color: "#2a241c", roughness: 1 }), 0, -0.02, -2, -Math.PI / 2);

const clock = new THREE.Clock();
const velocity = new THREE.Vector3();

function collide(pos) {
  pos.x = THREE.MathUtils.clamp(pos.x, -1.55, 1.55);
  pos.z = THREE.MathUtils.clamp(pos.z, 0.45, 10.4);
  if (pos.x > 0.28 && pos.z > 1.7 && pos.z < 8.4) pos.x = 0.28;
  if (pos.x < -1.12 && pos.z > 3.0 && pos.z < 7.6) pos.x = -1.12;
  if (pos.z > 8.66 && pos.x > -0.2 && pos.x < 0.55) {
    /* corridor */
  } else if (pos.z > 8.7 && pos.x > -0.2) {
    pos.z = Math.min(pos.z, 8.55);
  }
}

function goTo(view) {
  walking = false;
  walker.unlock();
  orbit.enabled = true;
  document.getElementById("orbitBtn").classList.add("active");
  document.getElementById("walkBtn").classList.remove("active");
  camera.position.set(...view.cam);
  orbit.target.set(...view.look);
  document.getElementById("viewTitle").textContent = view.title;
  document.getElementById("viewText").textContent = view.text;
}

const viewBar = document.getElementById("views");
views.forEach((v) => {
  const b = document.createElement("button");
  b.textContent = v.title;
  b.onclick = () => {
    [...viewBar.children].forEach((n) => n.classList.remove("active"));
    b.classList.add("active");
    goTo(v);
  };
  viewBar.appendChild(b);
});
viewBar.children[0].classList.add("active");

document.getElementById("orbitBtn").onclick = () => {
  walking = false;
  walker.unlock();
  orbit.enabled = true;
  document.getElementById("orbitBtn").classList.add("active");
  document.getElementById("walkBtn").classList.remove("active");
};

document.getElementById("walkBtn").onclick = () => {
  camera.position.set(0, 1.55, 0.8);
  walker.lock();
};

walker.addEventListener("lock", () => {
  walking = true;
  orbit.enabled = false;
  document.getElementById("walkBtn").classList.add("active");
  document.getElementById("orbitBtn").classList.remove("active");
});
walker.addEventListener("unlock", () => {
  walking = false;
  orbit.enabled = true;
  document.getElementById("orbitBtn").classList.add("active");
  document.getElementById("walkBtn").classList.remove("active");
});

addEventListener("keydown", (e) => {
  key[e.code] = true;
});
addEventListener("keyup", (e) => {
  key[e.code] = false;
});

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (walking) {
    velocity.set(0, 0, 0);
    const speed = 2.1;
    if (key.KeyW) velocity.z -= speed;
    if (key.KeyS) velocity.z += speed;
    if (key.KeyA) velocity.x -= speed;
    if (key.KeyD) velocity.x += speed;
    walker.moveRight(velocity.x * dt);
    walker.moveForward(-velocity.z * dt);
    const p = walker.getObject().position;
    p.y = 1.55;
    collide(p);
  } else {
    orbit.update();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
