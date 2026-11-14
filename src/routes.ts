import { locales, tourSlugs, defaultLocale, type Locale, type TourSlug } from './config';
import { guideSlugs, hasGuide, type GuideSlug } from './content/guides';

/** Deploy base path, always ending in "/". "/" on a real domain, "/issam-oman-tours/"
 *  on GitHub Pages. Set at build time (vite.config.ts reads VITE_BASE). Every
 *  path below already includes it. */
export const BASE: string = import.meta.env.BASE_URL || '/';

export type Route =
  | { locale: Locale; page: 'home' }
  | { locale: Locale; page: 'tours' }
  | { locale: Locale; page: 'guide'; slug: GuideSlug }
  | { locale: Locale; page: 'tour'; slug: TourSlug };

/** Every page that gets pre-rendered: each locale x (home + tours hub + every tour). */
export function allRoutes(): Route[] {
  return locales.flatMap(({ code }) => [
    { locale: code, page: 'home' as const },
    { locale: code, page: 'tours' as const },
    ...tourSlugs.map((slug) => ({ locale: code, page: 'tour' as const, slug })),
    // Guides exist only in the languages they have been written in.
    ...guideSlugs.filter((slug) => hasGuide(slug, code)).map((slug) => ({ locale: code, page: 'guide' as const, slug })),
  ]);
}

export function homePath(locale: Locale) {
  return `${BASE}${locale}/`;
}

export function toursPath(locale: Locale) {
  return `${BASE}${locale}/tours/`;
}

export function guidePath(locale: Locale, slug: GuideSlug) {
  return `${BASE}${locale}/guide/${slug}/`;
}

export function tourPath(locale: Locale, slug: TourSlug) {
  return `${BASE}${locale}/tours/${slug}/`;
}

export function pathFor(route: Route): string {
  if (route.page === 'home') return homePath(route.locale);
  if (route.page === 'tours') return toursPath(route.locale);
  if (route.page === 'guide') return guidePath(route.locale, route.slug);
  return tourPath(route.locale, route.slug);
}

/** Same page in another locale, for the language switcher and hreflang. */
export function swapLocale(route: Route, locale: Locale): Route {
  // A guide not yet written in that language: go to that language's home instead.
  if (route.page === 'guide' && !hasGuide(route.slug, locale)) return { locale, page: 'home' };
  return { ...route, locale };
}

export function parsePath(pathname: string): Route {
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const [first, second, third] = rest.split('/').filter(Boolean);
  const locale = (locales.find((l) => l.code === first)?.code ?? defaultLocale) as Locale;
  if (second === 'tours' && tourSlugs.includes(third as TourSlug)) {
    return { locale, page: 'tour', slug: third as TourSlug };
  }
  if (second === 'tours' && !third) return { locale, page: 'tours' };
  if (second === 'guide' && guideSlugs.includes(third as GuideSlug)) return { locale, page: 'guide', slug: third as GuideSlug };
  return { locale, page: 'home' };
}
