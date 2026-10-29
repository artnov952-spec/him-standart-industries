import test from "node:test";
import assert from "node:assert/strict";
import { tsImport } from "tsx/esm/api";

const { clamp, moleculeTarget, easeMoleculePose } = await tsImport("../lib/hero-molecule-motion.ts", import.meta.url);
const { heroAtoms, heroBonds } = await tsImport("../lib/hero-molecule-geometry.ts", import.meta.url);
const keys = ["rx", "ry", "rz", "x", "y"];
const near = (actual, expected, epsilon = 1e-10) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} != ${expected}`);

test("clamping contains extreme and non-finite browser input", () => {
  for (const value of [-1e308, -2, 0, 2, 1e308, NaN, Infinity, -Infinity, undefined]) {
    const result = clamp(value, -1, 1);
    assert.ok(Number.isFinite(result));
    assert.ok(result >= -1 && result <= 1);
  }
  assert.equal(clamp(-100, -1, 1), -1);
  assert.equal(clamp(100, -1, 1), 1);
  assert.equal(clamp(.5, -1, 1), .5);
});

test("desktop pose remains finite inside the approved small-motion envelope", () => {
  const limits = { rx: [-.165, .115], ry: [-.09, .41], rz: [-.068, -.007], x: [-.045, .045], y: [-.265, .025] };
  for (const x of [-1e6, -1, 0, 1, 1e6, NaN, Infinity]) {
    for (const y of [-1e6, 0, 1e6, NaN]) {
      for (const scroll of [-1e6, 0, .5, 1, 1e6, NaN]) {
        const pose = moleculeTarget({ x, y, scroll });
        for (const key of keys) {
          assert.ok(Number.isFinite(pose[key]), key);
          assert.ok(pose[key] >= limits[key][0] - 1e-12 && pose[key] <= limits[key][1] + 1e-12, key);
        }
      }
    }
  }
});

test("coarse-pointer mode ignores tracking and clamps page progress", () => {
  for (const scroll of [0, .25, 1]) {
    const expected = moleculeTarget({ x: 0, y: 0, scroll }, true);
    for (const input of [{ x: -100, y: 100, scroll }, { x: Infinity, y: NaN, scroll }]) assert.deepEqual(moleculeTarget(input, true), expected);
  }
  assert.deepEqual(moleculeTarget({ x: 1, y: 1, scroll: -100 }, true), moleculeTarget({ x: 0, y: 0, scroll: 0 }, true));
  assert.deepEqual(moleculeTarget({ x: 1, y: 1, scroll: 100 }, true), moleculeTarget({ x: 0, y: 0, scroll: 1 }, true));
});

test("easing is finite, monotonic and does not overshoot even with bad frame times", () => {
  const current = moleculeTarget({ x: -1, y: 1, scroll: 0 });
  const target = moleculeTarget({ x: 1, y: -1, scroll: 1 });
  for (const elapsed of [-1, 0, NaN, Infinity, 1 / 144, 1 / 60, 1 / 20, 10]) {
    const { pose } = easeMoleculePose(current, target, elapsed);
    for (const key of keys) {
      assert.ok(Number.isFinite(pose[key]));
      assert.ok(pose[key] >= Math.min(current[key], target[key]) - 1e-12);
      assert.ok(pose[key] <= Math.max(current[key], target[key]) + 1e-12);
      assert.ok(Math.abs(target[key] - pose[key]) <= Math.abs(target[key] - current[key]) + 1e-12);
    }
  }
  assert.deepEqual(easeMoleculePose(current, target, 0).pose, current);
});

test("equal elapsed time gives equal poses at 30, 60, 120 and 144 Hz", () => {
  const current = moleculeTarget({ x: -1, y: 1, scroll: 0 });
  const target = moleculeTarget({ x: 1, y: -1, scroll: 1 });
  const samples = [30, 60, 120, 144].map(fps => {
    let pose = current;
    for (let frame = 0; frame < fps / 2; frame++) pose = easeMoleculePose(pose, target, 1 / fps).pose;
    return pose;
  });
  for (const pose of samples) for (const key of keys) near(pose[key], samples[0][key]);
});

test("on-demand easing reaches exact rest within two seconds and stays settled", () => {
  const start = moleculeTarget({ x: -1, y: 1, scroll: 0 });
  const target = moleculeTarget({ x: 1, y: -1, scroll: 1 });
  for (const fps of [30, 60, 120, 144]) {
    let pose = { ...start }, settled = false, frames = 0;
    while (!settled && frames < fps * 2) {
      ({ pose, settled } = easeMoleculePose(pose, target, 1 / fps));
      frames++;
    }
    assert.ok(settled, `${fps} Hz did not stop`);
    assert.deepEqual(pose, target);
    assert.ok(frames > 1 && frames / fps < 2);
    assert.deepEqual(easeMoleculePose(pose, target, 1 / fps), { pose: target, settled: true });
  }
});

test("geometry has finite atoms and unique, valid, visible bonds", () => {
  assert.ok(heroAtoms.length > 12 && heroAtoms.length <= 32, "lightweight geometry budget");
  for (const atom of heroAtoms) {
    for (const value of [atom.x, atom.y, atom.z, atom.radius]) assert.ok(Number.isFinite(value));
    assert.ok(atom.radius > 0 && atom.radius < 1);
  }
  const pairs = new Set();
  for (const bond of heroBonds) {
    assert.ok(Number.isInteger(bond.a) && Number.isInteger(bond.b));
    assert.ok(bond.a >= 0 && bond.a < heroAtoms.length && bond.b >= 0 && bond.b < heroAtoms.length);
    assert.notEqual(bond.a, bond.b);
    const pair = [bond.a, bond.b].sort((a, b) => a - b).join(":");
    assert.ok(!pairs.has(pair), `duplicate ${pair}`);
    pairs.add(pair);
    const a = heroAtoms[bond.a], b = heroAtoms[bond.b];
    assert.ok(Number.isFinite(bond.radius) && bond.radius > 0 && bond.radius < Math.min(a.radius, b.radius));
    const length = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    assert.ok(length > a.radius + b.radius, `buried bond ${pair}`);
    assert.ok(length < 2.5, `unexpectedly long bond ${pair}`);
  }
});

test("all atoms form one connected 3D object centered inside the camera envelope", () => {
  const adjacent = heroAtoms.map(() => []);
  for (const { a, b } of heroBonds) { adjacent[a].push(b); adjacent[b].push(a); }
  const visited = new Set(), pending = [0];
  while (pending.length) {
    const atom = pending.pop();
    if (visited.has(atom)) continue;
    visited.add(atom); pending.push(...adjacent[atom]);
  }
  assert.equal(visited.size, heroAtoms.length, "disconnected atom");
  for (const axis of ["x", "y", "z"]) {
    const min = Math.min(...heroAtoms.map(atom => atom[axis] - atom.radius));
    const max = Math.max(...heroAtoms.map(atom => atom[axis] + atom.radius));
    near((min + max) / 2, 0, 1e-6);
    assert.ok(max - min < 6, `camera framing ${axis}`);
  }
  assert.ok(Math.max(...heroAtoms.map(atom => atom.z)) - Math.min(...heroAtoms.map(atom => atom.z)) > 1, "geometry must not be a flat image plane");
});

test("non-finite pose components recover to finite values and stop the RAF work", () => {
  const base = moleculeTarget({ x: 0, y: 0, scroll: 0 });
  const target = moleculeTarget({ x: 1, y: -1, scroll: 1 });
  const converges = (initial, destination, expected) => {
    let pose = initial, settled = false;
    for (let frame = 0; frame < 120 && !settled; frame++) {
      ({ pose, settled } = easeMoleculePose(pose, destination, 1 / 60));
      assert.ok(keys.every(key => Number.isFinite(pose[key])), "poison must never escape into rendered pose");
    }
    assert.ok(settled, "invalid input must not keep on-demand RAF alive");
    assert.deepEqual(pose, expected);
    assert.equal(easeMoleculePose(pose, destination, 1 / 60).settled, true);
  };
  for (const key of keys) {
    for (const invalid of [NaN, Infinity, -Infinity, undefined]) {
      converges({ ...base, [key]: invalid }, target, target);
      converges(base, { ...target, [key]: invalid }, { ...target, [key]: 0 });
    }
  }
  const invalidPose = Object.fromEntries(keys.map(key => [key, NaN]));
  converges(invalidPose, invalidPose, Object.fromEntries(keys.map(key => [key, 0])));
});

test("unavailable WebGL2 returns a clean fallback before allocating a renderer", async () => {
  const { createMoleculeScene } = await tsImport("../components/molecule-scene.ts", import.meta.url);
  let contextRequests = 0;
  const fakeCanvas = {
    getContext(kind) {
      contextRequests++;
      assert.equal(kind, "webgl2");
      return null;
    },
  };
  // Isolated capability refusal, not a physical-device or browser fallback test.
  assert.equal(createMoleculeScene(fakeCanvas), null);
  assert.equal(contextRequests, 1);
});
