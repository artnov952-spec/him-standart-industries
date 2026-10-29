export type MoleculeInput = { x: number; y: number; scroll: number };
export type MoleculePose = { rx: number; ry: number; rz: number; x: number; y: number };
const finite = (value: number) => Number.isFinite(value) ? value : 0;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, finite(value)));
export function moleculeTarget(input: MoleculeInput, coarse = false): MoleculePose {
  const x = coarse ? 0 : clamp(input.x, -1, 1), y = coarse ? 0 : clamp(input.y, -1, 1), scroll = clamp(input.scroll, 0, 1);
  return { rx: -.06 - y * .105 + scroll * .07, ry: .08 + x * .17 + scroll * .16, rz: -.025 + x * .018 - scroll * .025, x: x * .045, y: -scroll * .24 + y * .025 };
}
export function easeMoleculePose(current: MoleculePose, target: MoleculePose, elapsedSeconds: number): { pose: MoleculePose; settled: boolean } {
  const alpha = 1 - Math.exp(-clamp(elapsedSeconds, 0, .05) / .16);
  const pose = { ...current }; let largest = 0;
  for (const key of ["rx", "ry", "rz", "x", "y"] as const) {
    const start = finite(current[key]), end = finite(target[key]);
    pose[key] = start + (end - start) * alpha;
    largest = Math.max(largest, Math.abs(end - pose[key]));
  }
  if (largest < .00015) {
    for (const key of ["rx", "ry", "rz", "x", "y"] as const) pose[key] = finite(target[key]);
    return { pose, settled: true };
  }
  return { pose, settled: false };
}
