/* Experiences and transfers Issam added on 2026-11-26 (his own list): a foodie tour,
   Ramadan with Issam (seasonal), self-drive Oman (he arranges the rental car and the
   route), a desert or camp transfer and an airport transfer. He gave names only, so
   the cards make no promises on times or prices: guests ask on WhatsApp.
   Copy lives in the locale JSON under "extras". */
import { BASE } from '../routes';
import { photoSrc, photoSrcSet } from './photos';

export const extraSlugs = ['foodie', 'ramadan', 'self-drive', 'desert-transfer', 'airport-transfer'] as const;
export type ExtraSlug = (typeof extraSlugs)[number];

const own = (name: string) => ({
  src: `${BASE}media/issam/${name}-1280.webp`,
  srcSet: `${BASE}media/issam/${name}-640.webp 640w, ${BASE}media/issam/${name}-1280.webp 1280w`,
});

/** Card photos: Issam's own where he has one, otherwise a credited Commons photo. */
export const extraPhotos: Record<ExtraSlug, { src: string; srcSet: string; pos?: string }> = {
  foodie: { ...own('guests-karak'), pos: '50% 38%' },
  ramadan: { ...own('issam-night'), pos: '50% 30%' },
  'self-drive': { ...own('desert-landcruiser'), pos: '50% 58%' },
  'desert-transfer': { ...own('desert-camp'), pos: '62% 60%' },
  'airport-transfer': { src: photoSrc('muscat-airport'), srcSet: photoSrcSet('muscat-airport') },
};

/** Cards that only run part of the year get a badge. */
export const seasonalExtras: ExtraSlug[] = ['ramadan'];
