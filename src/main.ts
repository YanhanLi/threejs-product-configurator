import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/**
 * A minimal product configurator.
 *
 * The "product" here is just a rounded box so the repo has no binary assets to
 * download. Swap it for your own glTF model — see the README's "Fork this"
 * section. Everything else (materials, colors, lighting, screenshot) stays the
 * same.
 */

// ---- options you can edit ---------------------------------------------------

const COLORS = ["#e5e7eb", "#111827", "#4c8cf2", "#ef4444", "#22c55e", "#f59e0b"];

const MATERIALS: Record<string, () => THREE.MeshStandardMaterial> = {
  Matte: () => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.0 }),
  Satin: () => new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }),
  Metal: () => new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 1.0 }),
  Gloss: () =>
    new THREE.MeshPhysicalMaterial({ roughness: 0.15, metalness: 0.0, clearcoat: 1.0 }),
};

// ---- scene ------------------------------------------------------------------

const stage = document.getElementById("stage") as HTMLElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true, // needed so we can read pixels for the PNG export
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#0f1117");

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.4, 1.8, 3.2);

// Image-based lighting from three's built-in room — no HDR file required.
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// A key light for a soft shadow on the ground.
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(3, 5, 2);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 1;
key.shadow.camera.far = 20;
scene.add(key);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.ShadowMaterial({ opacity: 0.25 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.75;
ground.receiveShadow = true;
scene.add(ground);

// The product.
let material = MATERIALS.Satin();
material.color = new THREE.Color(COLORS[0]);
const product = new THREE.Mesh(new RoundedBoxGeometry(1.2, 1.2, 1.2, 6, 0.16), material);
product.castShadow = true;
scene.add(product);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 8;
controls.autoRotate = !reducedMotion;
controls.autoRotateSpeed = 0.8;
controls.target.set(0, 0, 0);

// ---- controls UI ------------------------------------------------------------

let activeColor = COLORS[0];
let activeMaterial = "Satin";

const colorsEl = document.getElementById("colors") as HTMLElement;
COLORS.forEach((hex) => {
  const b = document.createElement("button");
  b.className = "swatch";
  b.style.background = hex;
  b.title = hex;
  b.setAttribute("aria-label", `Color ${hex}`);
  b.setAttribute("aria-pressed", String(hex === activeColor));
  b.addEventListener("click", () => {
    activeColor = hex;
    material.color.set(hex);
    colorsEl.querySelectorAll("button").forEach((el) =>
      el.setAttribute("aria-pressed", String(el === b)),
    );
  });
  colorsEl.appendChild(b);
});

const materialsEl = document.getElementById("materials") as HTMLElement;
Object.keys(MATERIALS).forEach((name) => {
  const b = document.createElement("button");
  b.textContent = name;
  b.setAttribute("aria-pressed", String(name === activeMaterial));
  b.addEventListener("click", () => {
    activeMaterial = name;
    const next = MATERIALS[name]();
    next.color = new THREE.Color(activeColor);
    material.dispose();
    material = next;
    product.material = material;
    materialsEl.querySelectorAll("button").forEach((el) =>
      el.setAttribute("aria-pressed", String(el === b)),
    );
  });
  materialsEl.appendChild(b);
});

// Screenshot: render one frame, then pull a PNG data URL off the canvas.
const shot = document.getElementById("shot") as HTMLButtonElement;
shot.addEventListener("click", () => {
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "product.png";
  a.click();
});

// ---- resize + loop ----------------------------------------------------------

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
