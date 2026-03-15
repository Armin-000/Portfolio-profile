import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const viewer = document.getElementById('viewer');
const toggleAnimationBtn = document.getElementById('toggleAnimationBtn');
const animIconPath = document.getElementById('animPath');

const MODEL_URL = '/assets/models/spaceship/Spaceship.glb';

if (!viewer) {
  throw new Error('Element #viewer nije pronađen.');
}

const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  45,
  Math.max(viewer.clientWidth, 1) / Math.max(viewer.clientHeight, 1),
  0.1,
  1000
);

camera.position.set(0, 1.2, 6);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);

renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.touchAction = isTouchDevice ? 'none' : 'none';

viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = true;
controls.enableDamping = true;
controls.dampingFactor = isTouchDevice ? 0.09 : 0.06;
controls.enablePan = false;
controls.enableZoom = false;
controls.rotateSpeed = isTouchDevice ? 0.65 : 0.8;
controls.target.set(0, 0, 0);

// stabilnije ponašanje na touch uređajima
if (isTouchDevice) {
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
}

// ako želiš samo lijevo-desno rotaciju:
// controls.minPolarAngle = Math.PI / 2;
// controls.maxPolarAngle = Math.PI / 2;

const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(6, 7, 10);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xaec8ff, 1.6);
rimLight.position.set(-8, 4, -8);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0x88ccff, 1.2, 25);
fillLight.position.set(0, -1, 3);
scene.add(fillLight);

const gltfLoader = new GLTFLoader();
const clock = new THREE.Clock();

const PAUSE_PATH = 'M6 5h4v14H6zm8 0h4v14h-4z';
const PLAY_PATH = 'M8 5v14l11-7z';

let mixer = null;
let actions = [];
let isPaused = false;
let modelRoot = null;

function setAnimationButtonState() {
  if (!toggleAnimationBtn || !animIconPath) return;

  if (!actions.length) {
    toggleAnimationBtn.disabled = true;
    animIconPath.setAttribute('d', PLAY_PATH);
    toggleAnimationBtn.setAttribute('aria-label', 'No animation');
    return;
  }

  toggleAnimationBtn.disabled = false;

  if (isPaused) {
    animIconPath.setAttribute('d', PLAY_PATH);
    toggleAnimationBtn.setAttribute('aria-label', 'Play animation');
  } else {
    animIconPath.setAttribute('d', PAUSE_PATH);
    toggleAnimationBtn.setAttribute('aria-label', 'Pause animation');
  }
}

function cleanupModel(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    if (child.name && child.name.toLowerCase().includes('shield')) {
      child.visible = false;
      return;
    }

    child.castShadow = false;
    child.receiveShadow = false;
    child.frustumCulled = true;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    materials.forEach((mat) => {
      if (!mat) return;
      if ('envMapIntensity' in mat) mat.envMapIntensity = 1.15;
      mat.needsUpdate = true;
    });
  });
}

function frameModel(root) {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim * 0.72) / Math.tan(fov / 2));
  cameraZ *= isTouchDevice ? 1.6 : 1.45;

  camera.position.set(0, Math.max(maxDim * 0.2, 0.9), cameraZ);
  controls.target.set(0, 0, 0);
  controls.update();
}

function setupAnimations(gltf, root) {
  if (!gltf.animations || !gltf.animations.length) {
    actions = [];
    mixer = null;
    setAnimationButtonState();
    return;
  }

  mixer = new THREE.AnimationMixer(root);

  actions = gltf.animations.map((clip) => {
    const action = mixer.clipAction(clip);
    action.enabled = true;
    action.clampWhenFinished = false;
    action.play();
    return action;
  });

  isPaused = false;
  setAnimationButtonState();
}

function loadSpaceship() {
  gltfLoader.load(
    MODEL_URL,
    (gltf) => {
      modelRoot = gltf.scene;

      cleanupModel(modelRoot);
      scene.add(modelRoot);

      frameModel(modelRoot);
      setupAnimations(gltf, modelRoot);
    },
    undefined,
    (error) => {
      console.error('Greška pri učitavanju modela:', error);
      setAnimationButtonState();
    }
  );
}

if (toggleAnimationBtn) {
  toggleAnimationBtn.addEventListener('click', () => {
    if (!actions.length) return;

    isPaused = !isPaused;

    actions.forEach((action) => {
      action.paused = isPaused;
    });

    setAnimationButtonState();
  });
}

let resizeRaf = null;

function handleResize() {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);

  resizeRaf = requestAnimationFrame(() => {
    const width = Math.max(viewer.clientWidth, 1);
    const height = Math.max(viewer.clientHeight, 1);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    if (modelRoot) {
      frameModel(modelRoot);
    }
  });
}

window.addEventListener('resize', handleResize);

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.033);

  if (mixer && !isPaused) {
    mixer.update(delta);
  }

  controls.update();
  renderer.render(scene, camera);
}

setAnimationButtonState();
loadSpaceship();
animate();