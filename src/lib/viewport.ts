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

