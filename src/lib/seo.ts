/* Builds everything that goes in <head> for one pre-rendered page:
   title, description, canonical, hreflang, Open Graph, robots and JSON-LD.
   Runs at build time only (scripts/prerender.mjs via entry-server). */
import { config, locales, tourSlugs, type Locale } from '../config';
import type { Messages } from '../i18n';
import { BASE, pathFor, swapLocale, homePath, tourPath, type Route } from '../routes';
import { tourGeo } from '../data/tours';

type AllMessages = Record<Locale, Messages>;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Paths already carry the deploy base (routes.ts), so siteUrl is the bare origin.
const abs = (path: string) => config.siteUrl + path;

/** A locale is indexable once translated, or always if the config says so. */
export function isIndexable(m: Messages) {
  return m._status !== 'todo' || config.seo.indexTodoLocales;
}

export function pageMeta(route: Route, m: Messages) {
  if (route.page === 'home') {
    return { title: m.meta.homeTitle, description: m.meta.homeDescription };
  }
  const t = m.tours.items[route.slug];
  return { title: `${t.seoTitle} | ${m.meta.tourTitleSuffix}`, description: t.seoDescription };
}

export function buildHead(route: Route, all: AllMessages): string {
  const m = all[route.locale];
  const { title, description } = pageMeta(route, m);
  const url = abs(pathFor(route));
  const indexable = isIndexable(m);
  const ogLocale = route.locale === 'zh' ? 'zh_CN' : route.locale;

  const tags: string[] = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="${indexable ? 'index,follow,max-image-preview:large' : 'noindex,follow'}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(config.brand.business)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    `<meta property="og:image" content="${abs(BASE + 'og/og-card.png')}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(m.meta.ogAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];

  // hreflang only between indexable versions; pointing at noindex pages is an error.
  if (indexable) {
    const alternates = locales.filter((l) => isIndexable(all[l.code]));
    for (const l of alternates) {
      tags.push(`<link rel="alternate" hreflang="${l.hreflang}" href="${abs(pathFor(swapLocale(route, l.code)))}">`);
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${abs(pathFor(swapLocale(route, 'en')))}">`);
  }

  for (const block of jsonLd(route, m)) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

function person(m: Messages) {
  return {
    '@type': 'Person',
    '@id': abs(BASE + '#issam'),
    name: config.brand.person,
    alternateName: config.brand.nickname,
    jobTitle: 'Private tour guide and interpreter',
    description: m.meta.homeDescription,
    knowsLanguage: config.guideLanguages.map((l) => l.code),
    homeLocation: { '@type': 'Place', name: `${config.business.city}, Oman` },
    url: abs(BASE + ''),
    sameAs: [...Object.values(config.socials).map((s) => s.url), config.tripadvisor].filter(Boolean),
  };
}

function business(m: Messages) {
  return {
    '@type': ['LocalBusiness', 'TravelAgency'],
    '@id': abs(BASE + '#business'),
    name: config.brand.business,
    alternateName: m.meta.siteName,
    description: m.meta.homeDescription,
    url: abs(BASE + ''),
    image: abs(BASE + 'og/og-card.png'),
    logo: abs(BASE + 'icon-512.png'),
    telephone: `+${config.whatsapp.number}`,
    email: config.email,
    priceRange: config.business.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: config.business.city,
      addressRegion: config.business.region,
      addressCountry: config.business.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: config.business.geo.lat, longitude: config.business.geo.lng },
    areaServed: { '@type': 'Country', name: 'Oman' },
    founder: { '@id': abs(BASE + '#issam') },
    knowsLanguage: config.guideLanguages.map((l) => l.code),
    sameAs: [...Object.values(config.socials).map((s) => s.url), config.tripadvisor, config.googleBusinessProfile].filter(Boolean),
  };
}

function trip(route: Route & { page: 'tour' }, m: Messages) {
  const t = m.tours.items[route.slug];
  const geo = tourGeo[route.slug];
  return {
    '@type': 'TouristTrip',
    '@id': abs(pathFor(route)) + '#trip',
    name: t.seoTitle,
    description: t.seoDescription,
    url: abs(pathFor(route)),
    inLanguage: route.locale,
    touristType: ['Private travelers', 'Families', 'Couples'],
    provider: { '@id': abs(BASE + '#business') },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: t.stops.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: s.name,
          description: s.note,
          geo: { '@type': 'GeoCoordinates', latitude: geo.stops[i][1], longitude: geo.stops[i][0] },
        },
      })),
    },
  };
}

function jsonLd(route: Route, m: Messages): object[] {
  if (route.page === 'home') {
    return [
      {
        '@context': 'https://schema.org',
        '@graph': [
          person(m),
          business(m),
          {
            '@type': 'WebSite',
            '@id': abs(BASE + '#website'),
            url: abs(BASE + ''),
            name: config.brand.business,
            alternateName: m.meta.siteName,
            inLanguage: route.locale,
          },
          {
            '@type': 'ItemList',
            name: m.tours.title,
            itemListElement: tourSlugs.map((slug, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: abs(tourPath(route.locale, slug)),
              name: m.tours.items[slug].name,
            })),
          },
          {
            '@type': 'FAQPage',
            mainEntity: m.faq.items.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
      },
    ];
  }
  return [
    {
      '@context': 'https://schema.org',
      '@graph': [
        trip(route, m),
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: m.nav.home, item: abs(homePath(route.locale)) },
            { '@type': 'ListItem', position: 2, name: m.tours.items[route.slug].name, item: abs(pathFor(route)) },
          ],
        },
      ],
    },
  ];
}
