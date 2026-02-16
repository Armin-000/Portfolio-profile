import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const hasGSAP = typeof window.gsap !== "undefined";
const gsap = window.gsap;

const stageEl = document.getElementById("engineStage");

if (stageEl) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    stageEl.clientWidth / stageEl.clientHeight,
    0.1,
    300
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(stageEl.clientWidth, stageEl.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  stageEl.appendChild(renderer.domElement);
  renderer.domElement.classList.add("engine-stage__canvas");
  renderer.domElement.style.touchAction = "none";

  renderer.domElement.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  renderer.domElement.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  renderer.domElement.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });

  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(6, 8, 4);
  scene.add(dirLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.8;

  controls.enableZoom = true;
  controls.zoomSpeed = 0.9;

  controls.enablePan = true;
  controls.screenSpacePanning = true;

  controls.minDistance = 0.25;
  controls.maxDistance = 200;

  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };

  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (!isCoarsePointer) {
    renderer.domElement.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });
    controls.mouseButtons.WHEEL = null;
  } else {
    renderer.domElement.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  }

  renderer.domElement.addEventListener("pointerdown", (e) => {
    try {
      renderer.domElement.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  const root = new THREE.Group();
  scene.add(root);

  let autoRotate = true;
  const AUTO_ROTATE_SPEED = 0.12;

  let modelRef = null;

  const initial = {
    target: new THREE.Vector3(),
    camPos: new THREE.Vector3(),
    rootQuat: new THREE.Quaternion(),
    rootScale: 1,
  };

  function getViewFactor() {
    if (window.innerWidth <= 576) return 1.85;
    if (window.innerWidth <= 992) return 1.25;
    return 1.08;
  }

  function fitToModel() {
    if (!modelRef) return;

    const box = new THREE.Box3().setFromObject(modelRef);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 0.5;

    const fov = THREE.MathUtils.degToRad(camera.fov);
    const dist = (radius / Math.sin(fov / 2)) * getViewFactor();

    controls.minDistance = Math.max(0.15, radius * 0.15);
    controls.maxDistance = Math.max(dist * 3.5, radius * 8);

    controls.target.copy(center);
    camera.position.copy(center).add(new THREE.Vector3(0, radius * 0.25, dist));
    camera.updateProjectionMatrix();
    controls.update();
  }

  const HDR_URL = "/assets/hdr/venice_sunset_1k.hdr";
  new RGBELoader().load(HDR_URL, (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  });

  const loader = new GLTFLoader();
  const MODEL_URL = "/assets/glb/motor_animacija.glb";

  loader.load(MODEL_URL, (gltf) => {
    const model = gltf.scene;
    modelRef = model;
    root.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = 3.2 / maxAxis;
    model.scale.setScalar(scale);

    fitToModel();

    initial.target.copy(controls.target);
    initial.camPos.copy(camera.position);
    initial.rootQuat.copy(root.quaternion);
    initial.rootScale = root.scale.x;
  });

  const autoChk = document.getElementById("autoRotate");
  const resetBtnDesktop = document.getElementById("resetExplode");
  const resetBtnMobile = document.querySelector("[data-reset-engine]");

  if (autoChk) {
    autoChk.addEventListener("change", (e) => {
      autoRotate = e.target.checked;
    });
  }

  function doReset() {
    if (hasGSAP) {
      gsap.to(root.quaternion, {
        x: initial.rootQuat.x,
        y: initial.rootQuat.y,
        z: initial.rootQuat.z,
        w: initial.rootQuat.w,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.to(root.scale, {
        x: initial.rootScale,
        y: initial.rootScale,
        z: initial.rootScale,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.to(controls.target, {
        x: initial.target.x,
        y: initial.target.y,
        z: initial.target.z,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => controls.update(),
      });
      gsap.to(camera.position, {
        x: initial.camPos.x,
        y: initial.camPos.y,
        z: initial.camPos.z,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => {
          camera.updateProjectionMatrix();
          controls.update();
        },
      });
    } else {
      root.quaternion.copy(initial.rootQuat);
      root.scale.setScalar(initial.rootScale);
      controls.target.copy(initial.target);
      camera.position.copy(initial.camPos);
      camera.updateProjectionMatrix();
      controls.update();
    }
  }

  if (resetBtnDesktop) resetBtnDesktop.addEventListener("click", doReset);
  if (resetBtnMobile) resetBtnMobile.addEventListener("click", doReset);

  let hoverTween = null;

  function setHoverScale(on) {
    const target = on ? 1.03 : 1.0;
    if (hasGSAP) {
      if (hoverTween) hoverTween.kill();
      hoverTween = gsap.to(root.scale, {
        x: target,
        y: target,
        z: target,
        duration: 0.45,
        ease: "power2.out",
      });
    } else {
      root.scale.setScalar(target);
    }
  }

  const supportsHover = window.matchMedia("(hover: hover)").matches;
  if (supportsHover) {
    stageEl.addEventListener("mouseenter", () => setHoverScale(true));
    stageEl.addEventListener("mouseleave", () => setHoverScale(false));
  }

  function onResize() {
    const w = stageEl.clientWidth;
    const h = stageEl.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    fitToModel();
  }

  window.addEventListener("resize", onResize);

  let last = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;

    if (autoRotate) root.rotation.y += dt * AUTO_ROTATE_SPEED;

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
