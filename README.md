# Issam Baloushi, The Languages Ninja: private tours of Oman

Starter site for Issam's private tours of Oman. The goal is simple: travelers
reach Issam on **WhatsApp** or through the **tour request form**. Interpreting
and translation appear only as a small "Also available" strip.

The structure, layout and interactions are modelled on a study of merheb.xyz
(see [DESIGN-NOTES.md](DESIGN-NOTES.md)). No merheb content, images, logos,
text or video is used. Every image and video is a **labelled gray placeholder**,
and nothing is AI-generated.

- React 18 + Vite + TypeScript, Tailwind CSS
- GSAP + ScrollTrigger and Lenis for motion; three.js + React Three Fiber for the 3D routes map
- Pre-rendered static HTML for every page and locale (65 pages), no CMS, no server
- 13 locales with URL prefixes (`/en/`, `/ar/` ...), Arabic in full RTL

## Run it

Requires Node 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

The dev server runs on http://localhost:5173/en/ and renders client-side only.

To build the real static site (all 65 pre-rendered pages, sitemap, robots, llms.txt) and preview it:

```bash
npm run build
```

```bash
npm run preview
```

Then open http://localhost:4173/en/

Other scripts:

| Command | What it does |
|---|---|
| `npm run typecheck` | TypeScript check |
| `npm run check:copy` | Fails if any em dash appears in copy or markup (also runs before every build) |
| `npm run locales:sync` | Adds new keys from `en.json` to the 12 other locales without overwriting translations |

## Configuration

Everything that is not copy lives in **[src/config.ts](src/config.ts)**:
WhatsApp number, email, socials, Google Business Profile link, headline
numbers, locale list, tour order and SEO switches.

Secrets and per-environment values go in `.env.local` (copy `.env.example`):

| Variable | Purpose |
|---|---|
| `VITE_GA_ID` | GA4 measurement ID. Empty disables analytics entirely. |
| `VITE_FORM_ENDPOINT` | Optional POST endpoint for the request form (for example Formspree). Empty sends the request to WhatsApp instead. |
| `VITE_SITE_URL` | Public origin for canonical, hreflang, sitemap and JSON-LD. |

## How it works

**Pages.** Home, plus four tour pages, in each of 13 locales:
`/{locale}/` and `/{locale}/tours/{muscat-city|nizwa-mountains|wahiba-desert|wadi-shab-coast}/`.
`/` sends visitors to their browser language when it is translated, otherwise to `/en/`.

**Pre-rendering (SSG).** `npm run build` makes a client build, a server build of
`src/entry-server.tsx`, then `scripts/prerender.mjs` renders every route to
static HTML with its own `<head>`. The client hydrates that HTML. Output goes to
`dist/site`, which can be uploaded to any static host (Netlify, Vercel,
Cloudflare Pages, S3).

**Translations.** `src/locales/en.json` is the source of truth and is fully
written (dummy copy). The other 12 files are English placeholders marked
`"_status": "todo"`. To translate a locale, translate its strings and set
`"_status": "done"`.

**Untranslated locales and SEO.** Publishing 12 English copies would create
duplicate content, so locales still marked `todo` are served with `noindex`
and left out of hreflang and the sitemap. A locale joins hreflang and the
sitemap automatically once its `_status` is `done`. For a staging preview, set
`seo.indexTodoLocales: true` in `src/config.ts`.

**SEO and GEO built in.**
- Unique title and description per page and locale, canonical URLs, Open Graph
- hreflang between translated locales plus `x-default`
- JSON-LD: `Person`, `LocalBusiness` + `TravelAgency` (Muscat), `TouristTrip` per tour with a geo-tagged itinerary, `FAQPage`, `BreadcrumbList`, `ItemList`, `WebSite`
- `sitemap.xml` with hreflang alternates, `robots.txt` (AI crawlers allowed), `llms.txt`
- Real numbers, FAQ answers and tour content in the static HTML (nothing hidden behind JavaScript)

**Analytics.** GA4 loads after the first interaction or when the browser is
idle, so it never slows the first paint. Conversion events:
- `whatsapp_click` with a `location` parameter (hero, sidebar, float, plan, tour page...)
- `tour_request_submit` with `tour`, `language` and `method`

Mark both as key events in GA4 > Admin > Events.

**Performance.** Lighthouse mobile on the preview build: Performance 96 to 97,
Accessibility 96 to 100, Best Practices 100, SEO 100 (home and tour pages,
English). For comparison, merheb.xyz scored 55 on Performance with an 18.8 s
LCP. The 3D map (three.js, about 217 KB gzipped) only loads on capable
desktops when its section comes near. Phones, reduced-motion users and
Lighthouse get a static SVG map. Videos use `preload="none"` and only play on
screen.

**Motion.** Desktop home: the hero collapses into the sidebar as you scroll
(`src/motion/ghost.ts`), the story line draws itself, the counters roll, the
press marquee reacts to scroll speed, and the tours section pins while the 3D
camera flies route to route. Everything respects `prefers-reduced-motion`.
Mobile gets the same content without pinning.

## Folder structure

```
.
├── DESIGN-NOTES.md          Study of merheb.xyz: sections, grid, type, color, motion, plan
├── index.html               HTML template (head and app placeholders filled at build)
├── public/                  Static files copied as is (favicon, OG card)
├── scripts/
│   ├── prerender.mjs        SSG: 65 pages + sitemap, robots, llms.txt, 404, root redirect
│   ├── sync-locales.mjs     Keeps the 12 locale files in step with en.json
│   └── check-copy.mjs       No-em-dash rule
└── src/
    ├── config.ts            ALL config: WhatsApp, socials, GA, locales, stats
    ├── entry-client.tsx     Hydration, smooth scroll, analytics
    ├── entry-server.tsx     Render function used by the prerender script
    ├── App.tsx              Home page section order and tour page switch
    ├── routes.ts            URL scheme and route list
    ├── i18n.ts              Locale loading and context
    ├── locales/             13 JSON files (en filled, others TODO)
    ├── data/tours.ts        Route coordinates and video slots per tour
    ├── components/          Layout (sidebar, menu, footer), Modal, TourRequest form, icons, placeholders
    ├── sections/            Hero, Counters, Press, Story, Tours, Follow, Reviews, Faq, Plan, Also
    ├── pages/TourPage.tsx   Tour page template
    ├── map/                 Geography, SVG map, 3D map
    ├── motion/              GSAP + Lenis setup, hero collapse engine
    ├── lib/                 SEO head builder, analytics, viewport rules
    └── styles/              Tokens, components, Arabic font
```

## TODO before launch

**Media**
- [ ] Cutout portrait of Issam for the hero (transparent WebP, about 1400 px tall)
- [ ] Hero and card video loops for the four tours (WebM + MP4, 8 to 15 s, with WebP posters), added in `src/data/tours.ts`
- [ ] Avatar photo for the story cards and the chat
- [ ] Press logos (Arriyadiyah, Al Shabiba FM, SBC) as SVG or WebP, with permission
- [ ] Final social share image to replace `public/og/og-card.png` (1200 x 630)
- [ ] Real elevation data (SRTM or Copernicus DEM) and coastline (Natural Earth) for the map; the current terrain is stylised (`src/map/geo.ts`)

**Content**
- [ ] Issam's real story for the four timeline cards
- [ ] Real tour details: stops, durations, what is included, prices policy
- [ ] Real guest reviews with permission (the current ones are labelled samples). Only then consider adding `Review` / `AggregateRating` schema.
- [ ] Real FAQ answers (prices, pickup, duration, languages, group size, booking)
- [ ] Real headline numbers in `config.business.stats`
- [ ] Translations for the 12 TODO locales (`src/locales/*.json`), then set `"_status": "done"`

**Setup**
- [ ] Domain: set `VITE_SITE_URL` and point DNS at the static host
- [ ] WhatsApp number, email and social handles in `src/config.ts`
- [ ] GA4 property: set `VITE_GA_ID`, mark `whatsapp_click` and `tour_request_submit` as key events
- [ ] Google Business Profile: create it, then add its URL to `config.googleBusinessProfile`
- [ ] Optional: form backend in `VITE_FORM_ENDPOINT` (otherwise requests go to WhatsApp)
- [ ] Submit `sitemap.xml` in Google Search Console and Bing Webmaster Tools
- [ ] Cookie or consent banner if required for the visitor markets once GA is live
