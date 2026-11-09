import type { TourSlug } from '../config';
import { photoSrc } from './photos';

/* Language-neutral tour data: route geometry for the map and JSON-LD.
   Names and descriptions live in the locale JSON under tours.items.<slug>.
   Coordinates are real (WGS84). Stop order matches the "stops" array in the JSON. */

export type LngLat = [lng: number, lat: number];

export type TourGeo = {
  slug: TourSlug;
  index: string;
  /** Stops in visiting order, same order as the JSON "stops". */
  stops: LngLat[];
  /** Muscat start point the route is drawn from. */
  start: LngLat;
  /** Color role for this route on the map. */
  hue: 'accent' | 'amber' | 'ink' | 'deep';
};

const MUSCAT: LngLat = [58.4059, 23.588];

export const tourGeo: Record<TourSlug, TourGeo> = {
  'muscat-city': {
    slug: 'muscat-city',
    index: '01',
    start: MUSCAT,
    stops: [
      [58.3878, 23.5838], // Sultan Qaboos Grand Mosque
      [58.4689, 23.6144], // Royal Opera House
      [58.565, 23.6153], // Mutrah Souq
      [58.5937, 23.6145], // Al Alam Palace
    ],
    hue: 'accent',
  },
  'nizwa-mountains': {
    slug: 'nizwa-mountains',
    index: '02',
    start: MUSCAT,
    stops: [
      [57.5297, 22.9333], // Nizwa Fort
      [57.6731, 22.9244], // Birkat Al Mouz
      [57.6597, 23.0725], // Jebel Akhdar, Saiq plateau
      [57.2975, 22.9644], // Bahla Fort
    ],
    hue: 'deep',
  },
  'wahiba-desert': {
    slug: 'wahiba-desert',
    index: '03',
    start: MUSCAT,
    stops: [
      [59.0889, 22.6136], // Wadi Bani Khalid
      [58.8833, 22.4667], // Al Wasil
      [58.75, 22.2], // Sunset dune, inside the sands
      [58.8, 22.3], // Desert camp
    ],
    hue: 'amber',
  },
  'wadi-shab-coast': {
    slug: 'wadi-shab-coast',
    index: '04',
    start: MUSCAT,
    stops: [
      [59.0698, 23.0363], // Bimmah Sinkhole
      [59.2194, 22.9006], // Fins beach
      [59.2436, 22.8386], // Wadi Shab
      [59.5289, 22.5667], // Sur
    ],
    hue: 'ink',
  },
};

/** Per tour: a real photo now. Add webm and mp4 from Issam's footage and the video takes over. */
export const tourMedia: Record<TourSlug, { webm?: string; mp4?: string; poster?: string }> = {
  'muscat-city': { poster: photoSrc('muscat-grand-mosque') },
  'nizwa-mountains': { poster: photoSrc('nizwa-fort') },
  'wahiba-desert': { poster: photoSrc('wahiba-dune-drive') },
  'wadi-shab-coast': { poster: photoSrc('wadi-shab') },
};

/** Map extent (northern Oman) used by both the SVG fallback and the 3D terrain. */
export const mapBounds = { west: 56.6, east: 59.9, south: 21.9, north: 24.2 };
