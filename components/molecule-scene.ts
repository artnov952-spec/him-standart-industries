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
  // Smooth interpolated normals remove the large triangular faces. All copies
  // share indexed geometry; the extra detail does not add per-atom draw calls.
  const atomGeometry = new THREE.SphereGeometry(1, 64, 40);
  const atomMaterial = new THREE.MeshStandardMaterial({ color: 0x454845, roughness: .48, metalness: .18, flatShading: false });
  const bondGeometry = new THREE.CylinderGeometry(1, 1, 1, 32, 1, false);
  const bondMaterial = new THREE.MeshStandardMaterial({ color: 0x727671, roughness: .36, metalness: .55 });
  // A small flush ring at either end gives the connectors a machined edge,
  // while keeping the approved atom positions and bond radii unchanged.
  const collarGeometry = new THREE.TorusGeometry(1, .10, 6, 32);
  const atoms = new THREE.InstancedMesh(atomGeometry, atomMaterial, heroAtoms.length);
  const bonds = new THREE.InstancedMesh(bondGeometry, bondMaterial, heroBonds.length);
  const collars = new THREE.InstancedMesh(collarGeometry, bondMaterial, heroBonds.length * 2);
  const dummy = new THREE.Object3D();
  heroAtoms.forEach((atom, index) => {
    dummy.position.set(atom.x, atom.y, atom.z); dummy.scale.setScalar(atom.radius); dummy.quaternion.identity(); dummy.updateMatrix(); atoms.setMatrixAt(index, dummy.matrix);
  });
  const up = new THREE.Vector3(0, 1, 0);
  const forward = new THREE.Vector3(0, 0, 1);
  heroBonds.forEach((bond, index) => {
    const a = heroAtoms[bond.a], b = heroAtoms[bond.b];
    const start = new THREE.Vector3(a.x, a.y, a.z), end = new THREE.Vector3(b.x, b.y, b.z);
    const direction = end.clone().sub(start), length = direction.length();
    dummy.position.copy(start).add(end).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(up, direction.normalize()); dummy.scale.set(bond.radius, length, bond.radius); dummy.updateMatrix(); bonds.setMatrixAt(index, dummy.matrix);
    dummy.quaternion.setFromUnitVectors(forward, direction);
    dummy.scale.setScalar(bond.radius * .98);
    dummy.position.copy(start).addScaledVector(direction, a.radius + .015); dummy.updateMatrix(); collars.setMatrixAt(index * 2, dummy.matrix);
    dummy.position.copy(end).addScaledVector(direction, -b.radius - .015); dummy.updateMatrix(); collars.setMatrixAt(index * 2 + 1, dummy.matrix);
  });
  atoms.instanceMatrix.needsUpdate = true; bonds.instanceMatrix.needsUpdate = true; collars.instanceMatrix.needsUpdate = true;
  atoms.computeBoundingSphere(); bonds.computeBoundingSphere(); collars.computeBoundingSphere(); model.add(bonds, collars, atoms);
  scene.add(new THREE.HemisphereLight(0xecede9, 0x20221f, .75));
  const key = new THREE.DirectionalLight(0xffffff, 3.6); key.position.set(-5, 7, 9); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, .65); fill.position.set(6, -1, 5); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.75); rim.position.set(5, 3, -5); scene.add(rim);
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
      // Presentation diagnostics describe an actual rendered frame, not an
      // assumed budget. They change only when the renderer's counts change.
      const calls = String(renderer.info.render.calls), triangles = String(renderer.info.render.triangles);
      if (canvas.dataset.drawCalls !== calls) canvas.dataset.drawCalls = calls;
      if (canvas.dataset.triangles !== triangles) canvas.dataset.triangles = triangles;
    },
    dispose() {
      if (disposed) return; disposed = true;
      atoms.dispose(); bonds.dispose(); collars.dispose(); atomGeometry.dispose(); bondGeometry.dispose(); collarGeometry.dispose(); atomMaterial.dispose(); bondMaterial.dispose(); renderer.dispose();
      delete canvas.dataset.drawCalls; delete canvas.dataset.triangles;
    },
  };
}
