// Pre-renders every page and locale to static HTML (SSG), then writes the
// sitemap, robots.txt, llms.txt, the root redirect and a 404 page.
// Input:  dist/client (vite client build), dist/server (SSR build of src/entry-server.tsx)
// Output: dist/site, ready to upload to any static host.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const clientDir = join(root, 'dist/client');
const outDir = join(root, 'dist/site');

const server = await import(pathToFileURL(join(root, 'dist/server/entry-server.js')).href);
const { render, allRoutes, config, locales, tourSlugs, messages, isIndexable, BASE } = server;
// Every route path starts with BASE ("/" or "/issam-oman-tours/"); files are written without it.

const template = readFileSync(join(clientDir, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(join(clientDir, '.vite/manifest.json'), 'utf8'));

rmSync(outDir, { recursive: true, force: true });
cpSync(clientDir, outDir, { recursive: true, filter: (src) => !src.endsWith(`${join('client', 'index.html')}`) && !src.includes('.vite') });

// Preload the Latin Archivo face so text paints in the right font first time.
const assets = readdirSync(join(clientDir, 'assets'));
const latinFont = assets.find((f) => /^archivo-latin-wdth-normal-.*\.woff2$/.test(f));
const fontPreload = latinFont ? `<link rel="preload" href="${BASE}assets/${latinFont}" as="font" type="font/woff2" crossorigin>` : '';

const localeChunk = (code) => manifest[`src/locales/${code}.json`]?.file;

const write = (path, html) => {
  const file = join(outDir, path.slice(BASE.length), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

let count = 0;
for (const route of allRoutes()) {
  const page = render(route);
  const chunk = localeChunk(route.locale);
  // The hero portrait is the home page's largest paint.
  const portraitPreload = page.path.includes('/tours/')
    ? ''
    : `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="${BASE}media/issam-portrait-640.webp 640w, ${BASE}media/issam-portrait.webp 867w" imagesizes="(max-width: 900px) 82vw, 60vh">`;
  const dunesPreload = page.path.includes('/tours/')
    ? ''
    : `<link rel="preload" as="image" type="image/webp" imagesrcset="${BASE}media/places/wahiba-soft-dunes-960.webp 960w, ${BASE}media/places/wahiba-soft-dunes-1920.webp 1920w" imagesizes="100vw">`;
  const preloads = [fontPreload, portraitPreload, dunesPreload, chunk ? `<link rel="modulepreload" href="${BASE}${chunk}">` : ''].filter(Boolean).join('\n    ');
  const html = template
    .replace('<html lang="en" dir="ltr">', `<html lang="${page.lang}" dir="${page.dir}">`)
    .replace('<!--app-head-->', `${page.head}\n    ${preloads}`)
    .replace('<!--app-html-->', page.html);
  write(page.path, html);
  count++;
}

const site = config.siteUrl;
const indexable = locales.filter((l) => isIndexable(messages[l.code]));
const pathFor = (code, slug) => (slug ? `${BASE}${code}/tours/${slug}/` : `${BASE}${code}/`);

// Root: the full English home page (so the domain itself is a real, indexable page
// with content, headings and favicons, not a redirect stub). Its canonical points to
// /en/, so Google keeps one URL. Visitors whose browser language is another live
// locale are sent there; English and unknown languages stay on this page.
const live = JSON.stringify(indexable.map((l) => l.code).filter((c) => c !== 'en'));
const enHome = readFileSync(join(outDir, 'en', 'index.html'), 'utf8');
const langHop = `<script>(function(){try{var live=${live};var l=(navigator.language||'en').slice(0,2).toLowerCase();if(live.indexOf(l)>-1&&!/[?&]stay/.test(location.search))location.replace('${BASE}'+l+'/');}catch(e){}})();</script>`;
writeFileSync(join(outDir, 'index.html'), enHome.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />
    ${langHop}`));

// 404
writeFileSync(
  join(outDir, '404.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found | ${messages.en.meta.siteName}</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F3EADF;color:#1B1A18;font:16px system-ui,sans-serif;text-align:center}a{color:#7B499F;font-weight:700}</style>
</head><body><main><h1>Page not found</h1><p><a href="${BASE}en/">Back to the tours</a></p></main></body></html>\n`,
);

// Sitemap with hreflang alternates, indexable locales only.
const urls = [];
const today = new Date().toISOString().slice(0, 10);
for (const slug of [null, ...tourSlugs]) {
  for (const l of indexable) {
    const alts = indexable
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${site}${pathFor(a.code, slug)}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${pathFor('en', slug)}"/>`)
      .join('\n');
    const img = `${site}${BASE}og/${slug ? `tour-${slug}` : 'home'}.jpg`;
    urls.push(`  <url>
    <loc>${site}${pathFor(l.code, slug)}</loc>
    <lastmod>${today}</lastmod>
${alts}
    <image:image><image:loc>${img}</image:loc></image:image>
    <changefreq>monthly</changefreq>
    <priority>${slug ? '0.8' : '1.0'}</priority>
  </url>`);
  }
}
writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`,
);

writeFileSync(
  join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# AI search and answer engines are welcome to read and cite this site.\nUser-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${site}${BASE}sitemap.xml\n`,
);

// llms.txt: a plain summary for AI assistants (https://llmstxt.org).
const en = messages.en;
const tourLines = tourSlugs
  .map((s) => `- [${en.tours.items[s].seoTitle}](${site}${pathFor('en', s)}): ${en.tours.items[s].seoDescription}`)
  .join('\n');
const faqLines = en.faq.items.map((f) => `- ${f.q} ${f.a}`).join('\n');
writeFileSync(
  join(outDir, 'llms.txt'),
  `# ${en.meta.siteName}

> ${en.meta.homeDescription}

${config.brand.person} ("${config.brand.nickname}", trading as ${config.brand.business}) is a private tour guide in Oman, guiding since ${config.business.startedGuiding} and with about ${config.business.stats.travelersHosted.toLocaleString('en-US')} travelers hosted. Tours are guided in ${config.guideLanguages.map((l) => l.name).join(', ')}, and one tour can mix two languages. Tours are private, for 1 to 45 travelers, with pickup wherever guests stay. Prices start at ${config.pricing.currency} ${config.pricing.from}. Bookings are made on WhatsApp (https://wa.me/${config.whatsapp.number}), by email (${config.email}) or with the tour request form. Interpreting, translation and help with investing, real estate and legal matters in Oman are also available. Rated ${config.tripadvisorRating.score} out of 5 on Tripadvisor from ${config.tripadvisorRating.count} reviews (${config.tripadvisor}). Website: ${site}${BASE}en/.

## Tours

${tourLines}

## Key pages

- [Home](${site}${BASE}en/): overview, tours, reviews, FAQ and booking.
- [Sitemap](${site}${BASE}sitemap.xml)

## FAQ

${faqLines}
`,
);

console.log(`Pre-rendered ${count} pages (${indexable.length} indexable locale(s): ${indexable.map((l) => l.code).join(', ')}) into dist/site`);
if (!existsSync(join(outDir, 'og/home.jpg'))) console.warn('Warning: public/og/home.jpg is missing');

// GitHub Pages: serve files as they are (no Jekyll processing).
writeFileSync(join(outDir, '.nojekyll'), '');
