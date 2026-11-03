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
const { render, allRoutes, config, locales, tourSlugs, messages, isIndexable } = server;

const template = readFileSync(join(clientDir, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(join(clientDir, '.vite/manifest.json'), 'utf8'));

rmSync(outDir, { recursive: true, force: true });
cpSync(clientDir, outDir, { recursive: true, filter: (src) => !src.endsWith(`${join('client', 'index.html')}`) && !src.includes('.vite') });

// Preload the Latin Archivo face so text paints in the right font first time.
const assets = readdirSync(join(clientDir, 'assets'));
const latinFont = assets.find((f) => /^archivo-latin-wdth-normal-.*\.woff2$/.test(f));
const fontPreload = latinFont ? `<link rel="preload" href="/assets/${latinFont}" as="font" type="font/woff2" crossorigin>` : '';

const localeChunk = (code) => manifest[`src/locales/${code}.json`]?.file;

const write = (path, html) => {
  const file = join(outDir, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};

let count = 0;
for (const route of allRoutes()) {
  const page = render(route);
  const chunk = localeChunk(route.locale);
  const preloads = [fontPreload, chunk ? `<link rel="modulepreload" href="/${chunk}">` : ''].filter(Boolean).join('\n    ');
  const html = template
    .replace('<html lang="en" dir="ltr">', `<html lang="${page.lang}" dir="${page.dir}">`)
    .replace('<!--app-head-->', `${page.head}\n    ${preloads}`)
    .replace('<!--app-html-->', page.html);
  write(page.path, html);
  count++;
}

const site = config.siteUrl;
const indexable = locales.filter((l) => isIndexable(messages[l.code]));
const pathFor = (code, slug) => (slug ? `/${code}/tours/${slug}/` : `/${code}/`);

// Root: send visitors to their browser language when that locale is live, else English.
const live = JSON.stringify(indexable.map((l) => l.code));
writeFileSync(
  join(outDir, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${messages.en.meta.homeTitle}</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${site}/en/">
<meta http-equiv="refresh" content="0; url=/en/">
<script>(function(){var live=${live};var l=(navigator.language||'en').slice(0,2);location.replace('/'+(live.indexOf(l)>-1?l:'en')+'/');})();</script>
</head><body><a href="/en/">${messages.en.meta.siteName}</a></body></html>\n`,
);

// 404
writeFileSync(
  join(outDir, '404.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found | ${messages.en.meta.siteName}</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F3EADF;color:#1B1A18;font:16px system-ui,sans-serif;text-align:center}a{color:#0B7A73;font-weight:700}</style>
</head><body><main><h1>Page not found</h1><p><a href="/en/">Back to the tours</a></p></main></body></html>\n`,
);

// Sitemap with hreflang alternates, indexable locales only.
const urls = [];
for (const slug of [null, ...tourSlugs]) {
  for (const l of indexable) {
    const alts = indexable
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${site}${pathFor(a.code, slug)}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site}${pathFor('en', slug)}"/>`)
      .join('\n');
    urls.push(`  <url>\n    <loc>${site}${pathFor(l.code, slug)}</loc>\n${alts}\n    <changefreq>monthly</changefreq>\n    <priority>${slug ? '0.8' : '1.0'}</priority>\n  </url>`);
  }
}
writeFileSync(
  join(outDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);

writeFileSync(
  join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\n# AI search and answer engines are welcome to read and cite this site.\nUser-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`,
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

${config.brand.person} ("${config.brand.nickname}") is a private tour guide based in ${config.business.city}, Oman. Tours are guided in Arabic plus ${config.business.stats.languages} languages: ${locales
    .filter((l) => l.code !== 'ar')
    .map((l) => l.english)
    .join(', ')}. Tours are private, with hotel pickup in Muscat. Bookings are made on WhatsApp (https://wa.me/${config.whatsapp.number}) or with the tour request form. Interpreting and translation are also available.

## Tours

${tourLines}

## Key pages

- [Home](${site}/en/): overview, tours, reviews, FAQ and booking.
- [Sitemap](${site}/sitemap.xml)

## FAQ

${faqLines}
`,
);

console.log(`Pre-rendered ${count} pages (${indexable.length} indexable locale(s): ${indexable.map((l) => l.code).join(', ')}) into dist/site`);
if (!existsSync(join(outDir, 'og/og-card.png'))) console.warn('Warning: public/og/og-card.png is missing');
