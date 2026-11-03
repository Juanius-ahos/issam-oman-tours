import { locales, tourSlugs, defaultLocale, type Locale, type TourSlug } from './config';

export type Route =
  | { locale: Locale; page: 'home' }
  | { locale: Locale; page: 'tour'; slug: TourSlug };

/** Every page that gets pre-rendered: 13 locales x (home + 4 tours). */
export function allRoutes(): Route[] {
  return locales.flatMap(({ code }) => [
    { locale: code, page: 'home' as const },
    ...tourSlugs.map((slug) => ({ locale: code, page: 'tour' as const, slug })),
  ]);
}

export function pathFor(route: Route): string {
  return route.page === 'home' ? `/${route.locale}/` : `/${route.locale}/tours/${route.slug}/`;
}

export function homePath(locale: Locale) {
  return `/${locale}/`;
}

export function tourPath(locale: Locale, slug: TourSlug) {
  return `/${locale}/tours/${slug}/`;
}

/** Same page in another locale, for the language switcher and hreflang. */
export function swapLocale(route: Route, locale: Locale): Route {
  return { ...route, locale };
}

export function parsePath(pathname: string): Route {
  const [first, second, third] = pathname.split('/').filter(Boolean);
  const locale = (locales.find((l) => l.code === first)?.code ?? defaultLocale) as Locale;
  if (second === 'tours' && tourSlugs.includes(third as TourSlug)) {
    return { locale, page: 'tour', slug: third as TourSlug };
  }
  return { locale, page: 'home' };
}
