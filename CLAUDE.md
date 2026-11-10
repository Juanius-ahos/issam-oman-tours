# CLAUDE.md: project memory for the Issam Baloushi site

Read this first. It holds everything decided, built and learned so far, so work
can continue from any machine or session. Code-level detail lives in
[README.md](README.md) (how to run, folder map, launch TODO) and
[DESIGN-NOTES.md](DESIGN-NOTES.md) (the merheb.xyz study and the design plan).

## The project in one paragraph

AHOS (the user's agency) builds this site for client **Issam Baloushi, "The
Languages Ninja"**, a private tour guide in Muscat, Oman, who guides in Arabic
plus 12 languages. The site sells private tours. **Main goal:** travelers
contact Issam on WhatsApp or through the tour request form. Interpreting and
translation are only a small "Also available" strip. Structure, layout and
interactions are modelled on merheb.xyz, but none of merheb's images, logos,
text, brand name or videos are used.

## Links

| What | Where |
|---|---|
| Domain (confirmed, not live yet) | https://omanwithissam.com |
| Repo (public) | https://github.com/Juanius-ahos/issam-oman-tours |
| Live preview (GitHub Pages, `gh-pages` branch) | https://juanius-ahos.github.io/issam-oman-tours/en/ |
| Design reference studied | https://merheb.xyz |
| Sister project (AHOS agency site upgrade) | PR https://github.com/Juanius-ahos/ahos/pull/1, preview https://juanius-ahos.github.io/ahos-preview/ |

## House rules (from the user, non-negotiable)

1. **No em dashes** anywhere in copy or markup. `npm run check:copy` enforces it, and it runs before every build.
2. **No AI-generated images or video, and no drawn or illustrated scenery** (the user rejected hand-coded landscapes). Use real photos. Until Issam's arrive, licensed photos from Wikimedia Commons are listed in `src/data/photos.ts`; their licenses require the credits in the footer, so keep those in step.
3. **All config in one file:** `src/config.ts` (WhatsApp, email, socials, GA ID, stats, locales). Copy lives in `src/locales/*.json`.
4. **Copy nothing from merheb.** Only structure, layout and interactions.
5. **Pronouns:** the user refers to Issam as "he". Copy mostly uses his name; he/his is fine.
6. The user is the AHOS owner, writes tersely, and wants agency-quality results with short reports, not long explanations. They approve big steps (Step 1 notes needed an OK before building).

## Decisions taken (defaults the user approved)

- **Section order (home):** Hero, Counters, Press marquee, Story timeline, The Tours, Where to follow, Reviews, FAQ, Plan your tour, Also available. This is the user's order; merheb puts the timeline before the counters and marquee.
- **Motion:** GSAP + ScrollTrigger + Lenis, **not** Framer Motion (scroll-scrubbed and pinned effects, one library).
- **Palette:** sand `#F3EADF`, ink `#1B1A18`, turban purple `#9859C5` (buttons, routes, white text, sampled from Issam's portrait), light purple `#CDA8EE` (text and icons on dark panels), deep purple `#7B499F` (small text on sand, 5.3:1), amber `#E2A33B` (decoration only). Tokens in `src/styles/tokens.css`.
- **Wordmark:** "ISSAM" in condensed Archivo 900, with "The Languages Ninja" as the tagline.
- **Hero effect:** a simplified port of merheb's ghost collapse. The wordmark, socials, 2 stat cards and the WhatsApp CTA fly from the hero into the sidebar.
- **Map:** real satellite imagery (Sentinel-2 cloudless 2016 by EOX, CC BY 4.0, the only year licensed for commercial use) with routes following real roads (OpenStreetMap via OSRM, stored in `src/data/routeLines.ts`). The camera flies route to route. The earlier three.js relief model was rejected as fake and removed.
- **Locales (2026-11-10):** all 12 are translated and indexable: en, ar, es, it, de, fr, zh, pt, ca, ru, hi, bal (Balochi, RTL, Arabic-script font; needs Issam's review). `npm run check:locales` runs in the build and fails on missing keys or strings left in English. Earlier rule for any future locale: They are served `noindex` and left out of hreflang and the sitemap until translated (avoids duplicate content). Set `"_status": "done"` per locale when translated; `seo.indexTodoLocales` in config forces them on for staging.
- **Form:** posts to `VITE_FORM_ENDPOINT` if set; otherwise (and on failure) it opens WhatsApp with the request written out, so no lead is lost.
- **Reviews** are labelled "Sample reviews", so there is no `Review` / `AggregateRating` schema until real ones exist.

## Status (2026-11-04)

Done: Steps 1 to 3 of the original brief, plus a live preview.
- 65 pre-rendered pages (13 locales x home + 4 tours), Arabic RTL, language switcher.
- SEO / GEO: titles, descriptions, canonical, hreflang, OG, JSON-LD (Person, LocalBusiness + TravelAgency, TouristTrip x 4, FAQPage, BreadcrumbList, ItemList, WebSite), sitemap.xml, robots.txt, llms.txt.
- GA4 (`VITE_GA_ID`), loaded after the first interaction, with events `whatsapp_click` (param `location`) and `tour_request_submit`.
- **Lighthouse mobile** (preview build): home Performance 97 / Accessibility 96 / Best Practices 100 / SEO 100; tour page 96 / 100 / 100 / 100. Baseline merheb.xyz: Performance 55, LCP 18.8 s. The Arabic page shows SEO 66 only because TODO locales are `noindex` on purpose.

Hero portrait added 2026-11-09 (`public/media/issam-portrait*.webp`), also used as the faint fixed figure behind later sections on desktop.

**Issam's questionnaire answers (2026-11-10)** are saved in full in [docs/issam-answers-2026-11.md](docs/issam-answers-2026-11.md): contact, socials, numbers, story, tour facts, prices, policies and 6 real reviews (Spanish and Italian, permission given). They are now in `src/config.ts` and `src/locales/en.json`; the 12 TODO locales were re-copied from English. That file ends with a **Still to confirm** list (the 12th language, Korean and Japanese pages he did not list, exact tour stops, a Wahiba overnight option, deposit, license, Tripadvisor link). **Translation priority (his):** German, then Russian, Spanish, English, Italian, French. **New tours he wants:** Muscat by night, Nizwa by night, Al Hamra old village, multi-day round trips.

Not done (the launch checklist is in README "TODO before launch"): remaining real photos and videos, translations, pointing omanwithissam.com at a host, GA ID, Google Business Profile, the 4 new tours, the items in Still to confirm.

## Commands

```bash
npm install
npm run dev            # http://localhost:5173/en/ (client-only render)
npm run build          # copy check + client + SSR + prerender into dist/site
npm run preview        # http://localhost:4173/en/ (serves dist/site)
npm run typecheck
npm run locales:sync   # push new en.json keys into the 12 other locales
npm run deploy:pages   # build for /issam-oman-tours/ and force-push dist/site to gh-pages
```

`build:pages` / `deploy:pages` set `VITE_BASE=/issam-oman-tours/` and
`VITE_SITE_URL=https://juanius-ahos.github.io`. On a real domain, set
`VITE_SITE_URL` in `.env.local` and use `npm run build`; base stays `/`.

## Architecture quick map

- `src/routes.ts`: URL scheme. **Every path includes `BASE`** (`import.meta.env.BASE_URL`); the prerender script strips it when writing files.
- `src/entry-server.tsx` + `scripts/prerender.mjs`: SSG. Head tags come from `src/lib/seo.ts`.
- `src/entry-client.tsx`: loads the page locale's JSON chunk, hydrates, starts Lenis and GA.
- `src/motion/ghost.ts`: the hero collapse engine (desktop only). `index.html` has an inline script that adds `pre-ghost` to hide the sidebar until the engine has placed its nodes.
- `src/sections/*`: one file per home section. `src/pages/TourPage.tsx`: tour template.
- `src/map/SatelliteRouteMap.tsx` (map, camera, routes, pins, required credit), `src/map/geo.ts` (projection; the image is exported for exactly `mapBounds`).
- `src/data/tours.ts`: real route coordinates and empty video slots per tour.
- `vite.config.ts` `manualChunks`: `react` and `motion` (gsap + lenis).

## Gotchas learned the hard way

- **ScrollTrigger pin order:** create a pin *after* every other trigger that uses the same element. Triggers created after a pin get their start pushed past the pin spacer (the hero tweens started at 1150 px instead of 0).
- **One ScrollTrigger config object per tween.** Sharing one `scrollTrigger: {...}` object across several tweens froze them at progress 0. `ghost.ts` uses a `st()` factory.
- **Measure before mutating** in the ghost engine; never use a negative-margin full-bleed hack on a pinned element (the pin shifted the hero by half the sidebar width). The home hero sits outside the padded `.desk:ps-[var(--nav-w)]` wrapper instead.
- **Tailwind utilities beat `@layer components`.** A component rule like `display: none` loses to a `flex` utility on the same element; use `!important` there (see `.side-stats`).
- **Odometer:** keep the real number in an `sr-only` span and the rolling digits `aria-hidden` (aria-label on a plain span fails Lighthouse).
- **Hero portrait stacking:** the flying wordmark is a sidebar node (z 70), above the whole hero, and a pinned hero is its own stacking context. `ghost.ts` therefore splits the portrait at the wordmark's bottom edge: a clone on `body` (z 71) above the seam, the hero image below it, so the figure stays in front of the letters and the CTA and stat cards stay on top.
- `?debug` on any URL exposes `window.gsap` and `window.ScrollTrigger` for inspecting triggers in the console.

## Environment notes (the user's Windows machine)

- **GitHub:** the `gh` CLI token is invalid, but **plain `git push` works** through Git Credential Manager. Do not rely on `gh` for repo settings; ask the user to click in GitHub Settings, or use the Claude in Chrome extension when it is connected.
- **Playwright:** the bundled Chromium fails to spawn; use `chromium.launch({ channel: 'msedge' })`.
- **Lighthouse:** `CHROME_PATH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" npx lighthouse@12.2.1 <url> --form-factor=mobile --chrome-flags="--headless=new"`.
- The Claude desktop in-app browser could not open `*.github.io`; check the live preview with `curl` or a normal browser.
- **Not in git on purpose:** `research/` (screenshots and scroll videos of merheb.xyz, someone else's site, kept local only), `node_modules/`, `dist/`, `.env*`. Recreate captures with Playwright if needed; the findings are already written up in DESIGN-NOTES.md.

## Good next steps

1. Get real assets from Issam (cutout portrait, 4 tour video loops, avatar, press logos) and drop them into `public/media/` + `src/data/tours.ts`.
2. Replace the dummy copy in `src/locales/en.json` (story, tour details, FAQ answers, real reviews).
3. Translate the 12 locales (start with Arabic, the home market), then set `_status: "done"`.
4. Point **omanwithissam.com** (the confirmed domain, already the default `siteUrl`) at a static host, set `VITE_GA_ID`, create the Google Business Profile.
