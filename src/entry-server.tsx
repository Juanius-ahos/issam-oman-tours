/* Server entry, used only by scripts/prerender.mjs at build time. */
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { localeInfo, type Messages } from './i18n';
import { BASE, allRoutes, pathFor, type Route } from './routes';
import { buildHead, isIndexable } from './lib/seo';
import { config, locales, tourSlugs, type Locale } from './config';
import { guides, guideSlugs, guideLangs, registerGuides, type GuideSet } from './content/guides';

const modules = import.meta.glob<Messages>('./locales/*.json', { import: 'default', eager: true });
// Every guide file, registered up front, and a check that guideLangs matches the files.
const guideFiles = import.meta.glob<GuideSet>('./content/guides/*.ts', { import: 'default', eager: true });
for (const [file, set] of Object.entries(guideFiles)) registerGuides(file.replace(/.*\/(\w+)\.ts$/, '$1') as Locale, set);
for (const slug of guideSlugs) {
  const written = (Object.keys(guides[slug]) as Locale[]).sort().join(',');
  const listed = [...guideLangs[slug]].sort().join(',');
  if (written !== listed) throw new Error(`Guide "${slug}": guideLangs lists [${listed}] but files have [${written}]`);
}

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
export { guides, guideSlugs, guideLocales } from './content/guides';
