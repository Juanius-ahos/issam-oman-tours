/* Server entry, used only by scripts/prerender.mjs at build time. */
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { localeInfo, type Messages } from './i18n';
import { BASE, allRoutes, pathFor, type Route } from './routes';
import { buildHead, isIndexable } from './lib/seo';
import { config, locales, tourSlugs, type Locale } from './config';

const modules = import.meta.glob<Messages>('./locales/*.json', { import: 'default', eager: true });
export const messages = Object.fromEntries(
  locales.map((l) => [l.code, modules[`./locales/${l.code}.json`]]),
) as Record<Locale, Messages>;

export function render(route: Route) {
  const m = messages[route.locale];
  return {
    html: renderToString(<App route={route} messages={m} />),
    head: buildHead(route, messages),
    lang: route.locale,
    dir: localeInfo(route.locale).dir,
    path: pathFor(route),
    indexable: isIndexable(m),
  };
}

export { BASE, allRoutes, pathFor, config, locales, tourSlugs, isIndexable };
