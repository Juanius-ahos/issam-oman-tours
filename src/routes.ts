import { locales, tourSlugs, defaultLocale, type Locale, type TourSlug } from './config';

/** Deploy base path, always ending in "/". "/" on a real domain, "/issam-oman-tours/"
 *  on GitHub Pages. Set at build time (vite.config.ts reads VITE_BASE). Every
 *  path below already includes it. */
export const BASE: string = import.meta.env.BASE_URL || '/';

export type Route =
  | { locale: Locale; page: 'home' }
  | { locale: Locale; page: 'tours' }
  | { locale: Locale; page: 'tour'; slug: TourSlug };

/** Every page that gets pre-rendered: each locale x (home + tours hub + every tour). */
export function allRoutes(): Route[] {
  return locales.flatMap(({ code }) => [
    { locale: code, page: 'home' as const },
    { locale: code, page: 'tours' as const },
    ...tourSlugs.map((slug) => ({ locale: code, page: 'tour' as const, slug })),
  ]);
}

export function homePath(locale: Locale) {
  return `${BASE}${locale}/`;
}

export function toursPath(locale: Locale) {
  return `${BASE}${locale}/tours/`;
}

export function tourPath(locale: Locale, slug: TourSlug) {
  return `${BASE}${locale}/tours/${slug}/`;
}

export function pathFor(route: Route): string {
  if (route.page === 'home') return homePath(route.locale);
  if (route.page === 'tours') return toursPath(route.locale);
  return tourPath(route.locale, route.slug);
}

/** Same page in another locale, for the language switcher and hreflang. */
export function swapLocale(route: Route, locale: Locale): Route {
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
  return { locale, page: 'home' };
}
