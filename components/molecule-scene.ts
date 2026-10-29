import * as THREE from "three";
import { heroAtoms, heroBonds } from "@/lib/hero-molecule-geometry";
import type { MoleculePose } from "@/lib/hero-molecule-motion";

export function createMoleculeScene(canvas: HTMLCanvasElement) {
  const options: WebGLContextAttributes = { alpha: true, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true, preserveDrawingBuffer: false };
  const context = canvas.getContext("webgl2", options);
  if (!context) return null;
  const renderer = new THREE.WebGLRenderer({ canvas, context, ...options });
  renderer.setClearColor(0x101110, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, .1, 60);
  camera.position.set(0, 0, 18);
  const model = new THREE.Group();
  scene.add(model);
  const atomGeometry = new THREE.IcosahedronGeometry(1, 3);
  const positions = atomGeometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);
  // Quiet, deterministic graphite facets. No external textures or environment maps.
  for (let i = 0; i < positions.count; i++) {
    const p = new THREE.Vector3().fromBufferAttribute(positions, i);
    const grain = Math.sin(Math.round(p.x * 19) * 12.9898 + Math.round(p.y * 19) * 78.233 + Math.round(p.z * 19) * 31.31) * 43758.5453;
    const shade = .78 + (grain - Math.floor(grain)) * .22;
    colors.set([shade, shade, shade], i * 3);
  }
  atomGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const atomMaterial = new THREE.MeshStandardMaterial({ color: 0x494b49, roughness: .94, metalness: 0, flatShading: true, vertexColors: true });
  const bondGeometry = new THREE.CylinderGeometry(1, 1, 1, 12, 1, false);
  const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x686b65, roughness: .75, metalness: .05 });
  const atoms = new THREE.InstancedMesh(atomGeometry, atomMaterial, heroAtoms.length);
  const bonds = new THREE.InstancedMesh(bondGeometry, bondMaterial, heroBonds.length);
  const dummy = new THREE.Object3D();
  heroAtoms.forEach((atom, index) => {
    dummy.position.set(atom.x, atom.y, atom.z); dummy.scale.setScalar(atom.radius); dummy.quaternion.identity(); dummy.updateMatrix(); atoms.setMatrixAt(index, dummy.matrix);
  });
  const up = new THREE.Vector3(0, 1, 0);
  heroBonds.forEach((bond, index) => {
    const a = heroAtoms[bond.a], b = heroAtoms[bond.b];
    const start = new THREE.Vector3(a.x, a.y, a.z), end = new THREE.Vector3(b.x, b.y, b.z);
    const direction = end.clone().sub(start), length = direction.length();
    dummy.position.copy(start).add(end).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(up, direction.normalize()); dummy.scale.set(bond.radius, length, bond.radius); dummy.updateMatrix(); bonds.setMatrixAt(index, dummy.matrix);
  });
  atoms.instanceMatrix.needsUpdate = true; bonds.instanceMatrix.needsUpdate = true;
  atoms.computeBoundingSphere(); bonds.computeBoundingSphere(); model.add(bonds, atoms);
  scene.add(new THREE.AmbientLight(0xffffff, .4));
  const key = new THREE.DirectionalLight(0xffffff, 4.5); key.position.set(-5, 7, 9); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 1.0); fill.position.set(6, -1, 5); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 2.0); rim.position.set(5, 3, -5); scene.add(rim);
  let disposed = false;
  return {
    resize(width: number, height: number) {
      if (disposed || width < 1 || height < 1) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.25, Math.sqrt(800000 / (width * height)));
      renderer.setPixelRatio(pixelRatio); renderer.setSize(width, height, false);
      const aspect = width / height, viewHeight = Math.max(5.85, 6.15 / aspect);
      camera.left = -viewHeight * aspect / 2; camera.right = viewHeight * aspect / 2; camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2; camera.updateProjectionMatrix();
    },
    render(pose: MoleculePose) {
      if (disposed) return;
      model.rotation.set(pose.rx, pose.ry, pose.rz); model.position.set(pose.x, pose.y, 0); renderer.render(scene, camera);
    },
    dispose() {
      if (disposed) return; disposed = true;
      atoms.dispose(); bonds.dispose(); atomGeometry.dispose(); bondGeometry.dispose(); atomMaterial.dispose(); bondMaterial.dispose(); renderer.dispose();
    },
  };
}
