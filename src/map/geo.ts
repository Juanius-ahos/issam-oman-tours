/* Shared geography for the SVG map and the 3D terrain.

   The coastline is a hand-traced approximation of northern Oman (about 25
   real coastal points). The 3D relief is stylised from known features (the
   Hajar ridge, Jebel Shams and Jebel Akhdar, the Wahiba dune field).
   TODO: replace with a real SRTM / Copernicus DEM heightmap and a Natural
   Earth coastline before launch (both public domain). */
import { mapBounds, type LngLat } from '../data/tours';

export const BOUNDS = mapBounds;
export const W = 1000;
export const H = Math.round(((BOUNDS.north - BOUNDS.south) / (BOUNDS.east - BOUNDS.west)) * W * 1.06);

/** Equirectangular projection into a W x H box (latitude 23, close enough). */
export function project([lng, lat]: LngLat): [number, number] {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
  return [x, y];
}

/** Coast from the north-west (Batinah) round Ras al Hadd to the south. */
export const coast: LngLat[] = [
  [56.6, 24.42], [56.75, 24.35], [56.88, 24.17], [57.09, 23.98], [57.44, 23.85],
  [57.7, 23.77], [57.89, 23.71], [58.19, 23.67], [58.33, 23.62], [58.48, 23.63],
  [58.57, 23.63], [58.6, 23.6], [58.65, 23.55], [58.72, 23.5], [58.8, 23.4],
  [58.92, 23.27], [59.0, 23.15], [59.07, 23.04], [59.17, 22.95], [59.25, 22.82],
  [59.36, 22.7], [59.53, 22.58], [59.66, 22.55], [59.8, 22.53], [59.83, 22.42],
  [59.75, 22.25], [59.64, 22.05], [59.56, 21.9],
];

/** Land polygon: coast, then the box corners on the inland side. */
export const land: LngLat[] = [...coast, [BOUNDS.west, BOUNDS.south], [BOUNDS.west, 24.42]];

export function pointInLand([lng, lat]: LngLat) {
  let inside = false;
  for (let i = 0, j = land.length - 1; i < land.length; j = i++) {
    const [xi, yi] = land[i];
    const [xj, yj] = land[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Hajar ridge axis, used for both the SVG shading and the 3D height. */
export const hajar: LngLat[] = [
  [56.6, 24.2], [57.0, 23.75], [57.26, 23.24], [57.66, 23.07], [58.1, 23.1], [58.6, 23.05], [59.0, 22.75], [59.4, 22.45],
];

export const wahiba = { west: 58.45, east: 59.05, south: 21.9, north: 22.55 };

function distToSegment(p: LngLat, a: LngLat, b: LngLat) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Stylised elevation in km at a point (0 at the coast, about 3 at Jebel Shams). */
export function elevation(p: LngLat): number {
  if (!pointInLand(p)) return -0.15;
  let ridge = Infinity;
  for (let i = 1; i < hajar.length; i++) ridge = Math.min(ridge, distToSegment(p, hajar[i - 1], hajar[i]));
  const rough = noise(p[0] * 9, p[1] * 9) * 0.55 + noise(p[0] * 23, p[1] * 23) * 0.25;
  let h = Math.exp(-((ridge / 0.22) ** 2)) * (1.5 + rough * 1.6);
  // Jebel Shams and Jebel Akhdar peaks.
  h += Math.exp(-(((p[0] - 57.26) ** 2 + (p[1] - 23.24) ** 2) / 0.012)) * 1.2;
  h += Math.exp(-(((p[0] - 57.66) ** 2 + (p[1] - 23.07) ** 2) / 0.02)) * 0.8;
  // Wahiba dunes: long north-south ridges.
  if (p[0] > wahiba.west && p[0] < wahiba.east && p[1] > wahiba.south && p[1] < wahiba.north) {
    const edge = Math.min(p[0] - wahiba.west, wahiba.east - p[0], p[1] - wahiba.south, wahiba.north - p[1]);
    const fade = Math.min(1, edge / 0.22) ** 2;
    const dune = Math.sin(p[0] * 90 + noise(p[0] * 6, p[1] * 6) * 3) * 0.5 + 0.5;
    h += dune * 0.045 * fade + 0.05 * fade;
  }
  return h + 0.02 + rough * 0.05;
}

/** 0..1 weight of the Wahiba sands at a point, softened at the edges. */
export function sandWeight([lng, lat]: LngLat) {
  if (lng <= wahiba.west || lng >= wahiba.east || lat <= wahiba.south || lat >= wahiba.north) return 0;
  const edge = Math.min(lng - wahiba.west, wahiba.east - lng, lat - wahiba.south, wahiba.north - lat);
  return Math.min(1, edge / 0.22) ** 2;
}

export function svgPath(points: LngLat[], close = false) {
  return points.map((pt, i) => `${i ? 'L' : 'M'}${project(pt).map((n) => n.toFixed(1)).join(' ')}`).join(' ') + (close ? ' Z' : '');
}
