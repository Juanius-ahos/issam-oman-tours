/* Projection for the satellite map. The image was exported for exactly these
   bounds, so routes and pins land on the right pixels. */
import { mapBounds, type LngLat } from '../data/tours';

export const BOUNDS = mapBounds;
export const W = 1000;
export const H = 739;

export function project([lng, lat]: LngLat): [number, number] {
  const x = ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
  const y = ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;
  return [x, y];
}
