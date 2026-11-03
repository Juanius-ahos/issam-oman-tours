/* The single definition of "desktop layout". CSS uses the same query
   (tokens.css, tailwind "desk" screen). A phone held sideways is short and
   coarse, so it is mobile even though it is wide (DESIGN-NOTES 11, item 5). */
export const MOBILE_QUERY = '(max-width: 900px), (max-height: 560px) and (pointer: coarse)';

export const isBrowser = typeof window !== 'undefined';

export function isMobile() {
  return isBrowser && window.matchMedia(MOBILE_QUERY).matches;
}

export function prefersReducedMotion() {
  return isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Gate for the 3D map: WebGL2, no reduced motion, no data saver, enough cores. */
export function canRender3D() {
  if (!isBrowser || prefersReducedMotion()) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}
