// Source: public/assets/hero-matte.webp. Sculptural ball-and-stick reference only.
// No chemical identity, atom species, bond order or medical formula is represented.
// X follows the image, Y points up, Z supplies real staggered depth.
// Sphere-inclusive bounding-box center is (0, 0, 0). Array indices are bond IDs.

export type HeroAtom = { x: number; y: number; z: number; radius: number };
export type HeroBond = { a: number; b: number; radius: number };

export const heroAtoms: readonly HeroAtom[] = [
  { x: -1.300000, y: 1.018750, z: -0.140625, radius: 0.325000 }, // 0: upper-left ring
  { x: -0.393750, y: 1.325000, z: -0.490625, radius: 0.331250 }, // 1: upper ring
  { x: 0.487500, y: 0.618750, z: -0.840625, radius: 0.331250 }, // 2: upper-right ring
  { x: 0.318750, y: -0.450000, z: -0.290625, radius: 0.325000 }, // 3: lower-right ring
  { x: -0.581250, y: -0.775000, z: 0.309375, radius: 0.318750 }, // 4: lower ring
  { x: -1.462500, y: -0.043750, z: 0.259375, radius: 0.337500 }, // 5: left ring
  { x: -1.981250, y: 1.537500, z: -0.540625, radius: 0.275000 }, // 6: upper-left terminal
  { x: -0.356250, y: 2.256250, z: -0.640625, radius: 0.300000 }, // 7: top terminal
  { x: 1.000000, y: 0.800000, z: 0.109375, radius: 0.337500 }, // 8: right branch junction
  { x: 1.962500, y: 0.468750, z: 0.559375, radius: 0.337500 }, // 9: right foreground junction
  { x: 2.562500, y: 1.168750, z: 0.159375, radius: 0.268750 }, // 10: upper-right terminal
  { x: 2.512500, y: -0.056250, z: 0.809375, radius: 0.268750 }, // 11: lower-right foreground terminal
  { x: 1.462500, y: 0.168750, z: -0.740625, radius: 0.256250 }, // 12: right rear terminal
  { x: 1.025000, y: 1.656250, z: 0.009375, radius: 0.293750 }, // 13: right branch upper terminal
  { x: -2.368750, y: -0.518750, z: 0.359375, radius: 0.306250 }, // 14: left foreground branch
  { x: -2.581250, y: -0.281250, z: -0.690625, radius: 0.250000 }, // 15: left rear terminal
  { x: -0.725000, y: -1.718750, z: 0.559375, radius: 0.337500 }, // 16: bottom foreground junction
  { x: -1.156250, y: -1.356250, z: -0.390625, radius: 0.262500 }, // 17: bottom rear terminal
  { x: -1.475000, y: -2.106250, z: 0.109375, radius: 0.275000 }, // 18: bottom-left terminal
  { x: -0.018750, y: -2.268750, z: 0.909375, radius: 0.287500 }, // 19: bottom-right terminal
  { x: 1.000000, y: -1.025000, z: -0.390625, radius: 0.325000 }, // 20: lower-right branch junction
  { x: 1.537500, y: -0.893750, z: -0.940625, radius: 0.256250 }, // 21: lower-right rear terminal
  { x: 0.950000, y: -1.775000, z: -0.240625, radius: 0.268750 }, // 22: lower-right down terminal
];

export const heroBonds: readonly HeroBond[] = [
  { a: 0, b: 1, radius: 0.055 },
  { a: 1, b: 2, radius: 0.055 },
  { a: 2, b: 3, radius: 0.055 },
  { a: 3, b: 4, radius: 0.055 },
  { a: 4, b: 5, radius: 0.055 },
  { a: 5, b: 0, radius: 0.055 },
  { a: 0, b: 6, radius: 0.050 },
  { a: 1, b: 7, radius: 0.050 },
  { a: 2, b: 8, radius: 0.050 },
  { a: 8, b: 9, radius: 0.058 },
  { a: 9, b: 10, radius: 0.058 },
  { a: 9, b: 11, radius: 0.058 },
  { a: 9, b: 12, radius: 0.050 },
  { a: 8, b: 13, radius: 0.050 },
  { a: 5, b: 14, radius: 0.050 },
  { a: 14, b: 15, radius: 0.050 },
  { a: 4, b: 16, radius: 0.050 },
  { a: 16, b: 17, radius: 0.050 },
  { a: 16, b: 18, radius: 0.050 },
  { a: 16, b: 19, radius: 0.050 },
  { a: 3, b: 20, radius: 0.050 },
  { a: 20, b: 21, radius: 0.050 },
  { a: 20, b: 22, radius: 0.050 },
];
