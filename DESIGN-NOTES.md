# DESIGN-NOTES: merheb.xyz study for "The Languages Ninja"

Step 1 output. This records the structure, layout, type, color roles and motion of
merheb.xyz so the Issam Baloushi site can reuse the **structure, layout and
interactions only**. No merheb images, logos, text, brand name or videos are
carried over. Every piece of content in the build is a placeholder for Issam.

## 0. How this was studied

| What | Where |
|---|---|
| Desktop captures, 1440 x 900 (scroll sequence, FAQ open, contact popup, full page) | `research/merheb/desktop-*.png` |
| Mobile captures, 390 x 844 @2x | `research/merheb/mobile-*.png` |
| Scroll recordings (full pass, top to bottom) | `research/merheb/video-desktop/*.webm`, `research/merheb/video-mobile/*.webm` |
| Source read for exact values | the site's own `style.css` and 13 JS modules (kept out of the repo, read only for measurements) |

Captured with Playwright 1.49 driving Microsoft Edge. `research/` is reference
material of someone else's site, so it is **git-ignored** and will not go into
the GitHub repo.

**What merheb is built with:** a static HTML page (no framework), one large
CSS file, **GSAP 3.13** with **ScrollTrigger** and **Flip**, **Lenis 1.1**
smooth scroll, and about a dozen small vanilla JS modules, one per section
(`ghost.js`, `timeline.js`, `about.js`, `motion.js`, `faq.js`, `partner.js`,
`nav-roll.js`, `navspy.js`, `menu.js`, `work.js`, `work-archive.js`). The font
is Archivo (400 to 900, plus a condensed 62.5 width at 900) from Google Fonts.
The contact form posts to Formspree.

---

## 1. Sections in order (merheb)

| # | Section | What it is | Desktop height at 1440 |
|---|---|---|---|
| 0 | Preloader | Opaque cream cover with one huge word, fades out once fonts and the portrait have loaded | 100vh, fixed |
| 0b | Background silhouette | The portrait, fixed behind the whole page, blacked out, blurred 2.5px, 8% opacity, masked to fade at the bottom. Gives every section the faint figure behind it | fixed |
| 1 | **Hero** (`#top`) | Giant wordmark (31vw, uppercase, 900), cutout portrait standing in front of it, a row of nav links, two stat cards, a "traits" list card, two CTAs. **Pinned and scrubbed:** as you scroll, every hero element flies into its slot in the left sidebar (the "ghost collapse"). | ~2000px (pin spacer) |
| 2 | **About timeline** (`#about`) | 4 cards alternating right/left, each with a huge year (`'21`, `'23`...), title, blurb, avatar + handle, "Read more". A curved SVG line connects dots at the cards' outer corners and draws itself as you scroll. "Read more" grows the card into a dark full-story overlay. | ~1600px |
| 3 | **Trusted by** (brands) | Eyebrow + one row of brand names with small grayscale logo marks, as a marquee. Top and bottom hairline borders. | ~216px |
| 4 | **Stats band** | 3 big numbers in a 3-column grid, each with a small uppercase label. Numbers roll in like an odometer. | ~250px |
| 5 | **Work** (`#work`) | Eyebrow, 2-line title, lead line, then **4 numbered video cards** (01 to 04). On desktop the section **pins** and the cards travel left as you scroll down (horizontal gallery). Each card opens an archive overlay. | ~2000px (pin spacer) |
| 6 | **Platforms** (`#platforms`) | Full-width list rows: icon tile, platform name (big), handle, note (uppercase, right), arrow. Hairline between rows. | ~840px |
| 7 | **Testimonials** (`#testimonials`) | Title, then 5 quote cards **fanned like a hand of playing cards** (overlapping, rotated, bottom-anchored). Hover lifts one card out of the hand. | ~1060px |
| 8 | **FAQ** (`#faq`) | Title, then a 2-column accordion. "+" badge rotates to "x" on open, gold accent bar on the open item. | ~615px |
| 9 | **Contact** (`#contact`) | Eyebrow, giant 2-line title (to 110px), small uppercase note, then a **chat thread**: avatar, "typing" dots bubble, then the message bubble, then two reply buttons ("Let's Talk" opens the popup form, second button books a call). | ~530px |
| 10 | Footer | One line: copyright left, "Back to top" right. | 73px |
| Overlays | Partner dialog, Work archive, About full story, Mobile menu sheet | All share one modal contract (section 5.9). | |

**Persistent chrome (desktop):** a fixed **260px left sidebar** made of stacked
frosted-ink panels: logo pill + socials row, tagline, 2 stat cards, 7 nav pills
with icons (the current section's pill turns gold), a small client-logo
marquee, the email row with copy-to-clipboard, and a gold primary CTA pinned
at the bottom.

**Persistent chrome (mobile, under 900px):** a top bar with the logo pill on
the left and a dark rounded hamburger on the right. The sidebar becomes a
full-screen sheet (same DOM, restyled). The hero becomes a plain stack:
portrait, then content. No ghost collapse, no pins, no horizontal gallery.

### Mapping to Issam's home page

You asked for: Hero, Counters, Press marquee, Story timeline, The Tours,
Where to follow, Reviews, FAQ, Plan your tour, Also available.
Merheb's real order puts the timeline **before** the marquee and the counters.

| Issam section | Merheb source pattern | Notes |
|---|---|---|
| Hero | Hero + sidebar (ghost collapse on desktop) | Wordmark becomes "ISSAM" or "LANGUAGES NINJA" (decision below). H1: "Your private guide to Oman, in your language". WhatsApp CTA, social icons. Cutout portrait = gray placeholder box. |
| Counters | Stats band (odometer) + 2 sidebar stat cards | 4 figures: 12 languages, years guiding, travelers hosted, countries. Band becomes 4 columns (2x2 on mobile). Sidebar keeps 2 (Languages, Travelers). |
| Press and clients marquee | Trusted by marquee | Arriyadiyah, Al Shabiba FM, SBC as gray placeholder marks + names. Only 3 names, so the track repeats them to fill the row. |
| Story timeline (4 cards) | About timeline | Year + title + blurb + "Read more" overlay. Same drawn connector line. |
| The Tours (4 numbered cards) | Work gallery | 01 Muscat city, 02 Nizwa and the mountains, 03 Wahiba desert, 04 Wadi Shab and the coast. Video placeholder in each card. Click goes to the **tour page** instead of an archive overlay. |
| Where to follow | Platforms list | Instagram, TikTok, YouTube, Facebook. |
| Traveler reviews | Testimonials hand | 5 placeholder reviews with name + country. |
| FAQ | FAQ accordion | Prices, pickup, duration, languages, group size (plus 1 or 2 more to balance two columns). |
| Plan your tour | Contact chat thread + Partner dialog | Chat bubble "Where would you like to go?", buttons: "Request a tour" (opens popup) and "WhatsApp me". Popup fields: date, group size, preferred language, name, WhatsApp number, message. |
| Also available | (new) | A slim strip styled like the brands band: hairlines top and bottom, eyebrow, one line about interpreting and translation, small link. Sits between Plan your tour and the footer. |

---

## 2. Layout grid

- **Desktop (min-width 901px, and not a short touch landscape):**
  fixed sidebar `--nav-w: 260px` + content column. Content has a
  `--gutter: 44px` horizontal padding and starts after the sidebar. Hero
  geometry is positioned in **vw off the viewport**, not off the sidebar.
- **Mobile (max-width 900px, or max-height 560px with a coarse pointer):**
  single column, 20px side gutters, top bar instead of sidebar. Merheb
  deliberately treats a phone in landscape (e.g. 932 x 430) as mobile, since
  width alone would hand a short touchscreen the full pinned desktop
  experience. We copy that rule with one `matchMedia` query shared by CSS and
  JS.
- Other breakpoint: 1200px (minor tightening).
- **Section rhythm:** `.section { padding: clamp(80px, 11vh, 140px) var(--gutter) }`.
- Section header: eyebrow, then title, then lead, left-aligned, max ~800px.
- **Work cards:** CSS grid `repeat(auto-fit, minmax(240px, 1fr))`, gap 14px as
  the no-JS / mobile layout. In horizontal mode: flex row, each card
  `width: clamp(300px, 46vw, 760px)`, gap 18px, so 2 cards fill the screen with
  the 3rd peeking at the edge.
- **Timeline cards:** `width: min(620px, 45%)`, alternate `is-left` / `is-right`,
  vertical gap `clamp(32px, 5vh, 72px)`. Stacked full width on mobile.
- **Platforms row:** grid `48px 1fr 1fr 130px 24px` (icon, name, handle, note,
  arrow), gap 20px.
- **Stats band:** `repeat(3, 1fr)` (we use 4), gap `clamp(20px, 3vw, 48px)`.
- **FAQ:** `1fr 1fr`, column gap `clamp(32px, 4.5vw, 72px)`, max-width 1240px; 1
  column on mobile.
- **Testimonials:** flex row, centered, bottom-aligned, cards 250px wide with
  negative margin overlap and per-card `--rot`, `--z`, `--overlap` custom props.

## 3. Type scale

One family, **Archivo**, weights 400/500/700/800/900. Headlines are 900 with
tight negative tracking; labels are 800, uppercase, wide positive tracking.

| Role | Size | Weight | Tracking | Case |
|---|---|---|---|---|
| Hero wordmark | 31vw (capped by viewport height) | 900 | -0.03em | upper |
| Contact title | clamp(42px, 7.4vw, 110px) | 900 | -0.05em | sentence |
| Stat big number | clamp(52px, 7.4vw, 110px) | 900 | -0.055em | |
| Timeline year | clamp(52px, 6vw, 84px) | 900 | -0.02em | |
| Section title | clamp(32px, 4.4vw, 64px) | 900 | -0.04em | sentence, 2 lines |
| Hero stat number | clamp(34px, 3.6vw, 52px) | 900 | -0.045em | |
| Popup title | clamp(28px, 3.4vw, 44px) | 900 | -0.03em | upper |
| Work card name | clamp(26px, 2.6vw, 38px) | 900 | -0.04em | |
| Platform name | clamp(20px, 2.2vw, 32px) | 900 | -0.035em | |
| Brand (marquee) | clamp(19px, 2.1vw, 30px) | 800 | -0.03em | |
| Timeline card title | clamp(20px, 1.9vw, 26px) | 800 | -0.02em | |
| FAQ question | clamp(16px, 1.5vw, 20px) | 800 | -0.02em | |
| Chat bubble | clamp(16px, 1.6vw, 21px) | 700 | -0.02em | |
| Body / lead / FAQ answer | 15px (timeline blurb clamp 14 to 16) | 400 | | |
| Quote text | 14px | 400 | -0.01em | |
| Nav pill | 13px | 800 | 0.04em | upper |
| Button | 13px (hero 18 to 26) | 800 | -0.01em | |
| Eyebrow | 10px | 800 | 0.22em | upper |
| Small labels (stat, note, card "View") | 10 to 11px | 800 | 0.14 to 0.18em | upper |

**For Issam's locales:** Archivo has no Arabic, CJK or Devanagari glyphs. Plan:
Archivo for Latin and Cyrillic (it covers both), **IBM Plex Sans Arabic** (or
Noto Kufi Arabic) for `ar`, and system font stacks for `zh`, `ja`, `ko`, `hi`
so no multi-megabyte CJK webfont hurts Lighthouse. Negative tracking is reset
to 0 for `ar` and CJK, and uppercase transforms are disabled there.

## 4. Color roles

Merheb uses three tokens plus alpha mixes of ink:

| Role | Merheb value | Used for |
|---|---|---|
| Page background | `--cream #F0E6DC` | body, preloader |
| Ink (text, dark surfaces) | `--ink #1E1A17` | text, popup panel, mobile hamburger, footer text |
| Accent | `--gold #FAD214` (hover `#FFE45C`) | primary buttons, active nav pill, big numbers, timeline years, dots, open-FAQ bar, platform row hover fill |
| Frosted ink panel | `rgba(30,26,23,.62)` + `1px rgba(255,255,255,.26)` rim + inset top shine + `blur(14px)` | sidebar panels, stat cards, quote cards, hero traits card |
| Light card | `rgba(255,255,255,.86)` + `1px rgba(30,26,23,.08)` + soft drop shadow + `blur(10px)` | timeline cards |
| Muted text | ink at 0.58 to 0.7 opacity | marquee names, handles, notes, lead lines |
| Hairlines | ink at 0.09 to 0.14 | section borders, list rows, FAQ rows, card borders |
| Tile fill | ink at 0.05 | work card base, icon tiles |

**Proposal for Issam (same roles, new values so it is not merheb's palette):**

| Role | Proposed | Why |
|---|---|---|
| Background | sand `#F3EADF` | Oman desert, close in warmth |
| Ink | `#1B1A18` | |
| Accent | **wadi turquoise `#12A39A`** (hover `#19BDB2`) | Wadi Shab water, reads as travel, and white text on it passes AA at button sizes |
| Secondary accent (sparingly) | frankincense amber `#E2A33B` | big numbers / timeline years, if we want warmth |

All other roles keep merheb's alpha formulas. Contrast is checked per token in
Step 2 (merheb's own notes measure marquee text at 0.58 opacity as ~4:1 on cream).

## 5. Components

### 5.1 Hero cutout
- Portrait is a transparent PNG cutout, `height: 102vh`, centered, `z-index` above
  the wordmark so the figure stands **in front of** the giant letters.
- Wordmark row at `top: 6vh`; everything beneath (link row, stat cards) is
  offset from the wordmark's computed bottom (`--mark-bottom`) in px, so the
  whole hero scales on one axis and never collides on wide, short windows.
- Hero links row: uppercase links with `/` separators. Hero CTA: big pill.
- Two stacked stat cards (frosted ink, icon top-right, gold number, tiny label)
  and a "traits" list card.
- Hero fades in from a blurred state after the preloader lifts.
- **Issam:** gray box labeled "Cutout portrait of Issam, transparent PNG/WebP,
  about 1200px tall". Wordmark, H1 in an `sr-only`-free visible line under it,
  WhatsApp CTA as the hero button, social icons row.

### 5.2 Counters
- Sidebar stat cards: static text.
- Stats band: each figure is `0` in the HTML with `data-count` and
  `data-suffix`. JS splits digits; each digit is an `overflow:hidden` window
  over a vertical 0 to 9 column (2 sets), rolled with a stagger when the band
  enters (`start: 'top 82%'`, `power4.out`). Reduced motion or no JS: the final
  value is written directly.
- **SEO note for us:** pre-rendered HTML should contain the **real number**
  (e.g. `12`), and JS only animates it. Merheb's "0 in HTML" approach would put
  zeros in our static pages.

### 5.3 Logo marquee
- `.marquee { overflow:hidden }` > `.marquee-track { display:flex; width:max-content; gap:44px }`.
- JS clones each child once (clones get `aria-hidden`), then a GSAP tween loops
  the track to `xPercent:-50` forever. `data-speed` in px/s, negative reverses.
- **Scroll velocity coupling:** Lenis' scroll velocity is smoothed per frame and
  fed into the tween's `timeScale`, so the strip speeds up when you scroll,
  reverses when you scroll up, and coasts back. A small `skewX` at speed via
  `gsap.quickTo`.
- The big "Trusted by" band can also run in `data-marquee-mode="scroll"`:
  scrubbed against the section's pass through the viewport (travel = 45% of
  viewport width) instead of autoplaying.
- Items are grayscale and 0.58 opacity at rest, full opacity + color on hover
  (hover only on `(hover:hover) and (pointer:fine)`).

### 5.4 Timeline cards
- Light frosted card, radius 22px, padding `clamp(24px, 2.4vw, 36px)`.
- Contents: big accent year, title, blurb, avatar chip + handle, outline pill
  "Read more".
- **Connector:** an absolutely positioned SVG behind the cards (cards sit one
  z-index above). A dot sits at each card's outer top corner, so the line
  crosses the full width between cards as bowed cubic curves. The path has a
  vertical gradient that fades to nothing at both ends. It **draws itself** by
  scrubbing `stroke-dashoffset` across the section (`start: 'top 60%'`,
  `scrub: 1.8`). Each dot lights when the drawn length reaches it. After the
  last dot a second dashed "tail" path continues. Dot positions and paths are
  rebuilt from live card rects on resize.
- **Read more:** a fixed dark overlay grown **from the card's rect to a
  centered size** (GSAP, `power3.inOut`), with a bigger year, title, full
  story, small stat list and CTA. Page height never changes; Lenis pauses.

### 5.5 Numbered video cards
- Card: radius 18px, padding 22px, ink 0.05 fill and hairline; with media it is
  a dark card with the video full-bleed behind a bottom gradient.
- Top-left index `01` (10px, 800, 0.2em). Bottom: name (900), 1 to 2 line
  description, small accent uppercase "View ..." link.
- **Entrance:** a clip-path edge travels up each card (masked reveal) while the
  footage settles from `scale 1.12` to 1, copy follows in sequence; one shared
  trigger for the group so the stagger reads as one gesture.
- **Horizontal gallery (desktop):** section pins (`start: 'top top'`,
  `pin: true`, `scrub: 1`); scroll distance equals travel distance so the strip
  moves 1:1 with the wheel; `invalidateOnRefresh` so resize recomputes.
- **Video:** `<video preload="none" muted playsinline loop>` with no autoplay;
  JS starts playback on hover (desktop) or when the card is in view (mobile),
  pauses when it leaves. Poster image shown until then.
- Hover: slight lift (disabled while the gallery is moving).
- **Issam:** each card links to `/{locale}/tours/{slug}/`. Gray poster box
  labeled "Video: Muscat city tour, 8 to 12s loop, 1080x1350 WebM/MP4".

### 5.6 Platform links
- Full-width rows, hairline between them.
- **Hover:** row gets the accent fill, padding-left grows 14 to 20px (content
  slides right), icon tile inverts (ink background, accent glyph), handle and
  note fade a little, arrow slides in from offset to `translate(0,0)` and full
  opacity. All 0.3 to 0.35s on `--ease: cubic-bezier(.22,1,.36,1)`.

### 5.7 Testimonials
- Frosted ink quote cards (white text), fixed height 310px, radius 18px,
  padding 24px, 250px wide.
- Laid out as a **fanned hand**: per-card rotation `--rot`, negative overlap,
  `transform-origin: bottom center`, center card highest.
- Entrance: each card rises/rotates into the hand on scroll.
- Hover: card goes to `z-index:20`, straightens and lifts out of the hand
  (0.45s). On mobile the hand becomes a swipeable row or simple stack.
- Caption: name (14px, 800) + small uppercase meta (here: country + tour).

### 5.8 FAQ accordion
- Native `<details>/<summary>` for semantics and no-JS. GSAP drives both
  directions: open sets `[open]` first, then tweens height 0 to auto
  (`power3.out`, 0.4s); close tweens height to 0 first and removes `[open]`
  after, so closing is as smooth as opening.
- "+" in a round badge rotates 45° to "x"; a 3px accent bar appears on the
  item's leading edge when open.
- Items fade up (`y: 22`) on enter.
- **Issam:** every Q/A also feeds the FAQPage JSON-LD.

### 5.9 Contact popup (and shared modal contract)
- Opened from the chat's "Let's Talk" button. Dark ink panel (radius ~22px,
  ~620px wide, 44px padding), title in 900 uppercase, close "x" tile
  top-right, full-width accent submit (12px, 900, 0.18em, uppercase).
- **Fields:** boxed inputs with the label **inside** the box at top (11px, 800,
  uppercase), input text 15px/600 (16px on mobile to stop iOS zoom). Focused
  field gets an accent border.
- Scrim: page behind blurs and darkens.
- **Contract shared by every overlay:** Escape closes, scrim click closes, Tab
  trapped inside, Lenis stopped, body `overflow:hidden`, focus returns to the
  opener. Open: scrim fades, panel scales/rises in (~0.42s `power3.out`).
  Close: ~0.26s `power2.in`.
- Merheb submits to Formspree via `fetch` and falls back to `mailto:`.
- **Issam:** same popup with date, group size, preferred language (select of
  the 13), name, WhatsApp number, message. Submission target is a config
  value: Formspree endpoint if set, otherwise it **composes a WhatsApp
  message** (`https://wa.me/{number}?text=...`) with the form contents, so a
  lead is never lost even before a form backend exists.

### 5.10 Chat thread (Plan your tour)
- Avatar circle, then a "typing" bubble with 3 bouncing dots (`chat-dot`
  keyframes, 1.3s), which pops into the message bubble (grows from its
  bottom-left corner), then the action buttons follow. Plays once on enter.

### 5.11 Sidebar and nav
- **Nav roll hover:** each link has a one-line `overflow:hidden` mask with the
  label and an `aria-hidden` clone stacked below; hover plays one timeline that
  rolls the label up and the clone in (0.45s `power3.out`); leave reverses it.
- **Nav spy:** current section's pill turns accent. Reads Lenis' own scroll
  value (not IntersectionObserver) so the highlight changes when the visitor
  actually sees the section.
- Email row copies to clipboard with a "Copied" hint. **Issam:** WhatsApp row
  (number + "Copy" / tap to chat).
- Floating CTA: on desktop the sidebar's gold button; on mobile a fixed CTA
  appears after the hero. **Issam:** a WhatsApp button, always reachable.

## 6. Animation and interaction inventory

| Effect | Trigger | Technique | Timing |
|---|---|---|---|
| Preloader word, then fade out | load (fonts + portrait ready) | GSAP timeline | ~0.4s fade |
| Hero de-blur entrance | after preloader | GSAP `filter: blur` + opacity | ~0.6s |
| **Ghost collapse** (hero elements fly into sidebar slots) | scroll, hero pinned ~1120px | Measure hero "ghost" box and sidebar slot, tween real node between them (font-size for text, width/height for pills, scale with radius compensation for backgrounds), `scrub: 1` | scrubbed |
| Sidebar pill backgrounds and icons fade in | scroll 38% to 49% of hero | declarative `data-tl-*` scrub | scrubbed |
| Lenis smooth scroll | always (not reduced motion) | `new Lenis({ lerp: .1 })`, driven by `gsap.ticker`, forwards to `ScrollTrigger.update` | |
| Timeline line draws, dots light | scroll through About | SVG `stroke-dashoffset` scrub 1.8 | scrubbed |
| Timeline Read more expand | click | fixed overlay from card rect to centered rect | ~0.5s `power3.inOut` |
| Brand marquee loop + velocity boost + reverse + skew | always / scroll | GSAP repeat tween, `timeScale` from smoothed Lenis velocity, `quickTo('skewX')` | base 40px/s |
| Odometer counters | band enters (top 82%) | digit columns in masks, staggered | ~1.2s `power4.out` |
| Work cards masked reveal | section enters | `clip-path` inset tween + media scale 1.12 to 1 + copy stagger | ~0.6s each, staggered |
| Work horizontal gallery | scroll, section pinned | `x` tween on track, `pin`, `scrub: 1` | scrubbed |
| Video play/pause | hover or in view | `IntersectionObserver` + `preload="none"` | |
| Platform row hover | hover (fine pointer only) | CSS transitions | 0.3 to 0.35s |
| Testimonial hand entrance + hover lift | enter / hover | GSAP on enter, CSS on hover | 0.45s |
| FAQ open/close | click | GSAP height tween synced with `[open]` | 0.4s |
| FAQ items fade up | enter | `data-tl-type="trigger"` (`y:22`) | |
| Chat typing then message then buttons | contact enters | GSAP timeline + CSS dots keyframes | ~2s total |
| Popup open/close | click / Esc / scrim | GSAP fromTo on scrim + panel | 0.42s in, 0.26s out |
| Nav link roll | hover | paired spans, one reversible timeline | 0.45s |
| Nav spy | scroll | Lenis scroll event | |
| Buttons | hover | color shift (gold to lighter gold), roll text | 0.3s |
| Reduced motion | `prefers-reduced-motion: reduce` | every module bails; markup already holds the final state; preloader hidden; no Lenis | |

Global ease: `cubic-bezier(.22,1,.36,1)` (a strong ease-out, ~`power3.out`).

## 7. Techniques and libraries for the React build

**Recommendation: swap Framer Motion for GSAP.** Merheb's signature effects
(pinned hero collapse, pinned horizontal gallery, path drawing, scroll-velocity
marquee) are all **scroll-scrubbed and pinned**, which is ScrollTrigger's
core job and awkward in Framer Motion. Shipping both libraries would cost
Lighthouse points for no gain. GSAP and all its plugins (ScrollTrigger, Flip)
have been free for commercial use since 2025.

| Need | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (tokens from section 4 as CSS variables, logical properties `ps-/pe-/ms-/me-` so RTL flips for free) |
| Scroll animation | `gsap` + `ScrollTrigger` + `Flip`, used through `@gsap/react` (`useGSAP` for cleanup on route change) |
| Smooth scroll | `lenis` (off for reduced motion; native scroll on touch) |
| Routing | `react-router-dom` with `/:locale/` prefix |
| SSG / pre-rendering | `vite-react-ssg` (renders every route to static HTML at build). If it fights with i18n, fallback is a small custom prerender script using `react-dom/server` over the route list. Either way: 13 locales x 5 pages = **65 HTML files** |
| Head tags | per-route `<Head>` (title, description, canonical, hreflang x 13 + `x-default`, OG) rendered into static HTML |
| i18n | JSON per locale (`src/locales/{code}.json`), small typed `t()` helper, `dir="rtl"` + `lang` on `<html>` per page |
| JSON-LD | built from `config.ts` + locale JSON: Person, LocalBusiness (Muscat), TouristTrip per tour, FAQPage |
| Sitemap / robots / llms.txt | generated at build from the same route list |
| Analytics | GA4 `gtag`, loaded after interaction / idle, ID from `VITE_GA_ID`; events `whatsapp_click`, `tour_request_submit` (marked as conversions in GA) |
| Images / video | WebP placeholders, `loading="lazy"`, explicit width/height; videos `preload="none"` + poster |
| Icons | inline SVGs (no icon font) |

**Effect by effect:**

| Effect | Implementation plan |
|---|---|
| Ghost collapse | Desktop only. Port the idea, simplified: hero pinned for ~120vh; for a handful of elements (wordmark to logo pill, 2 stat cards, nav links row, CTA), measure the hero box and the sidebar slot, then scrub a Flip/fromTo between them. Mobile gets a normal stacked hero. |
| Timeline line | SVG path generated from card rects in a `useLayoutEffect`, `strokeDashoffset` scrub; mirrored in RTL. |
| Marquee | Duplicated track, GSAP loop, Lenis velocity into `timeScale`; direction flips in RTL. |
| Counters | Real values in SSR HTML; on the client, wrap digits into roll columns and animate. |
| Horizontal tours gallery | Pin + `x` scrub on desktop (direction flipped in RTL); plain stacked cards on mobile. |
| Testimonials hand | CSS custom props per card + GSAP entrance; horizontal scroll-snap on mobile. |
| FAQ | `<details>` + GSAP height tween. |
| Popups | One `<Modal>` component with the shared contract (Esc, scrim, focus trap, Lenis stop, focus return). |
| Nav roll / nav spy | `<RollText>` component; nav spy from Lenis scroll position against section offsets. |

**RTL specifics for `ar`:** sidebar docks on the **right**, gallery travels the
other way, marquee reverses, timeline cards and connector mirror, arrows and
chevrons flip, letter-spacing reset, Arabic font.

**Tour pages (same visual language):** hero with full-bleed video placeholder
and big title, quick facts row (duration, route, pickup, group size) as frosted
stat cards, a route list styled as a mini timeline with the same drawn line,
"What's included / not included" two-column list, a request CTA opening the
same popup with the tour preselected, a WhatsApp button, and cards to the other
three tours.

## 8. Skills

Already available and used:

- **built-in-browser:** inspected the live site (libraries, section offsets).
- **run:** will launch the dev and preview servers in Step 2.
- Playwright and Lighthouse (tools, not skills) took the captures and the
  performance baseline.

Offered for install from the plugin catalog (each needs the user's click).
Whichever are installed get loaded before Step 2 and used at the stage shown:

| Plugin | Publisher | Used for |
|---|---|---|
| frontend-design | Anthropic | Visual direction and layout while building every section |
| audit-suite (web-animation-design, emil-design-engineering, make-interfaces-feel-better, vercel-react-best-practices, perf / a11y / design audits) | Community | Motion craft, React patterns, final audit pass |
| Design (accessibility-review, ux-copy, design-system, design-critique) | Anthropic | Tokens, copy rules (no em dashes), a11y review |
| SEO-AEO-GEO Ultimate (hreflang, schema, local, sitemap, video, geo) | Community | hreflang, JSON-LD, llms.txt, local SEO for Muscat |
| SearchFit SEO (content-translation, schema, technical) | Knowledge Work | Translation workflow for the 12 TODO locales, schema checks |
| LovableSEO | Community | Checks the pre-rendered React HTML (not the client DOM) for SEO |
| Claude SEO and GEO Site Audit | Community | Graded audit report of the finished build |
| Website Copywriting & Positioning | Community | Placeholder copy that converts to WhatsApp |
| Marketing (brand-review, content-creation) | Anthropic | Tone and brand voice for Issam |
| Fairmind Design (WCAG 2.1 AA, contrast, keyboard) | Community | Contrast of the new palette, keyboard and screen reader checks |
| ultrapowers-dev (react, tailwind, typescript, e2e-testing) | Community | Code patterns and Playwright tests |
| playwright | Microsoft | Driving the built site in a real browser per locale |
| github | GitHub | Repo creation and push in Step 3 (alternative to the `gh` CLI) |
| Remotion (includes 3D and maps) | Community | Optional: rendering route-map animation clips as placeholder videos |

**3D:** the catalog has no Three.js / WebGL / React Three Fiber skill. The 3D
work (section 12) is built directly with React Three Fiber, which needs no
plugin. I did not pull skills from random GitHub repos, since those are
unreviewed code.

## 9. Decisions to confirm before Step 2

1. **Section order.** Use your order (Hero, Counters, Marquee, Timeline...) or
   merheb's (Hero, Timeline, Marquee, Counters...)? I'll default to **yours**.
2. **GSAP + Lenis instead of Framer Motion** (section 7). Default: GSAP.
3. **Palette:** sand / ink / wadi turquoise (+ optional amber), or keep a
   gold-style accent? Default: turquoise.
4. **Hero wordmark:** "ISSAM" (short, giant like merheb) or "LANGUAGES NINJA"
   (two lines)? Default: "ISSAM", with "The Languages Ninja" as the tagline.
5. **Ghost collapse on desktop:** full port (most effort, strongest feel) or a
   simpler pinned hero that fades into the sidebar? Default: simplified port of
   the 4 main elements.

## 10. Heads-up for Step 3

`gh auth status` reports the stored token for **Juanius-ahos** as invalid.
Before I can create and push the repo, run this once in a terminal:

```bash
gh auth login -h github.com
```

---

## 11. Deeper study: details found on the second pass

Second capture set: `research/merheb/states/`. It has hero collapse frames at
scroll 0 / 250 / 500 / 750 / 1000 / 1200 px, the timeline drawing at 10 / 40 /
70 %, the odometer mid-roll and settled, the horizontal gallery at start /
middle / end, the About overlay, platform hover, testimonial hand and hover,
nav roll mid-hover, chat typing and settled, and mobile menu, marquee, stats,
work, platforms, testimonials, FAQ and contact.

**Hero, resting state (scroll 0):** the wordmark spans the full content width
in the **condensed** Archivo cut (62.5 width, 900), and the portrait stands in
front of it from just under the top edge to below the fold. Under the
wordmark sits one row of uppercase links in two groups, left (Home, About,
Work, Platforms) and right (Testimonials, FAQ, Get in touch), with `|`
separators. Two stat cards stack at the left, overlapping the portrait's
shoulder and slightly offset from each other. A "traits" card at the right
lists 5 services, each with a small outlined accent icon. Two CTAs sit
centered at the bottom: accent "Let's Work" and white "About Me".

**Hero, during the collapse (frames 250 to 1000):**
- The **portrait blurs progressively** (blur scrubbed with the scroll) and
  fades into the fixed background silhouette. That is how the hero photo
  becomes the faint figure behind every later section.
- The wordmark shrinks toward the sidebar logo pill, and its color tweens from
  bright accent through a darker shade to ink.
- Each nav link travels on its own path, so for a moment they fan out
  diagonally (HOME, ABOUT, WORK, PLATFORMS stepping down). It reads as the
  words pouring into the sidebar.
- Stat cards slide and resize into the sidebar's 2-up stat panel. Their inner
  corners and inner borders go to 0 so the two land as one divided panel.
- The traits card fades out, "About Me" fades out, and "Let's Work" travels
  down into the sidebar's bottom CTA slot.
- Sidebar pill backgrounds and icons only fade in between 38 % and 49 % of the
  hero scroll, so the pills appear just as the labels arrive.
- Pointer events stay off on the nav rows until an `is-collapsed` class flips
  at 1120 px, so ghosted labels never steal hovers.

**Craft details worth copying:**
1. **Optical alignment:** the outer nav link groups are aligned to the
   wordmark's actual *ink* edges. They're measured by drawing the glyphs to an
   offscreen canvas and scanning pixels, not by the text box. Letters like M
   and B have side bearings, and this removes the visible step.
2. **Sidebar auto-scales** (`scale = min(1, available / scrollHeight)`) to fit
   short windows, and every measurement downstream divides by that scale.
3. **Boot waits for fonts**, explicitly loading the condensed face, because a
   late font swap would shift every measured box. A 5 s safety timer removes
   the preloader if anything throws.
4. **Preloader** holds 0.35 s, then slides **up** (`yPercent: -100`, 0.9 s,
   `power3.inOut`). The hero under it is already final, so the lift is the
   reveal.
5. **Viewport rule in one file:** "mobile" means width 900 or less, **or** a
   short coarse-pointer screen (phones in landscape). CSS and every JS module
   read the same definition.
6. **Lenis velocity into the marquees** is smoothed per frame on the GSAP
   ticker (not per scroll event), so it eases back down after scrolling stops.
7. **Chat entrance timings:** avatar pops at 0 s (`back.out(2)`), typing bubble
   at 0.2 s from its bottom-left corner, typing leaves at 0.95 s, message pops
   at 1.2 s (`back.out(1.7)`), buttons follow at 1.45 s with a 0.08 s stagger.
8. **Work cards:** clip-path `inset(100% 0 0 0)` to `inset(0)` over 0.95 s with
   a 0.09 s stagger. Media settles from scale 1.12 over 1.4 s, and copy
   staggers 0.045 s each.
9. **About overlay:** opens from the card's rect, the year expands from a short
   form to the full year, and a highlighted italic accent pull quote closes
   the story. The close button is a "minus" tile (the inverse of "+").
10. **Work archive** grows from the clicked card using GSAP **Flip**
    (`Flip.fit` then `Flip.from`, 0.62 s `power3.inOut`).
11. **Mobile menu** is the sidebar itself restyled as a full-screen sheet:
    large pills (icon + label) with the active one in accent, socials as big
    square tiles, the email row, and a full-width CTA at the bottom. The
    hamburger becomes an accent "x" tile.
12. **Mobile testimonials** drop the fanned hand and become a plain vertical
    stack of full-width cards.

**Weak spots in merheb that we will beat:**

| Merheb | Issam build |
|---|---|
| One language, no `hreflang` | 13 locales, full RTL, hreflang + `x-default` |
| No structured data at all | Person, LocalBusiness, TouristTrip x 4, FAQPage, BreadcrumbList |
| No visible H1 (it is `sr-only`); the wordmark is the only big text | Real visible H1 with the promise and keyword ("private guide to Oman") |
| Counters are literally "0" in the HTML until JS runs | Real numbers in the static HTML; JS only animates |
| Preloader waits for `window.load` (every image) before revealing anything | No blocking preloader on mobile; on desktop a short intro gated on the hero image and fonts only, capped at about 1.2 s |
| Render-blocking Google Fonts CSS, one 137 KB stylesheet and 17 separate scripts | Self-hosted, subset WOFF2 fonts with preload and `font-display: swap`; purged Tailwind CSS; one bundled, code-split script |
| Work cards open an overlay, with no pages behind them | Each tour card is a real, indexable page per locale |
| Contact is a form or email only | WhatsApp first, the form falls back to WhatsApp, GA4 conversion events |
| Mobile testimonials are a plain stack | Swipeable scroll-snap deck that keeps the fanned feel |
| No 3D or map | Interactive 3D map of Oman with the four tour routes (section 12) |
| No `llms.txt`, generic robots | `llms.txt`, robots and sitemap generated from the same route list |

## 12. 3D layer (the part merheb does not have)

**Library:** `three` + `@react-three/fiber` + `@react-three/drei`, loaded with
a dynamic `import()` only when the section is about to enter the viewport,
and only on devices that pass a capability check (WebGL2, no
`prefers-reduced-motion`, no Save-Data, 4+ logical cores). Everyone else,
including Lighthouse's emulated phone, gets a static SVG version of the same
map, so the 3D cost never lands on the first paint.

**12.1 "The Tours" map (home page):** an **interactive 3D relief map of
northern Oman** built from public-domain elevation data (SRTM or Copernicus
DEM: real terrain, not AI imagery), shaded in the site palette (sand land,
ink contours, turquoise sea). The four tour routes are tubes that **draw
themselves** as you scroll (the 3D version of merheb's timeline line), with
numbered pins 01 to 04 matching the tour cards. Scrolling through the pinned
section flies the camera from Muscat to the Hajar mountains and Nizwa, then
the Wahiba sands, then Wadi Shab, the way merheb pins its horizontal gallery.
Hovering a tour card highlights its route, and clicking a pin opens the tour
page.

**12.2 Tour page hero:** the same terrain cropped to that tour's region, with
the route drawn and the stops labelled. It sits behind the hero video
placeholder and parallaxes slightly with the pointer.

**12.3 Small 3D touches (cheap: CSS or tiny WebGL):**
- Testimonial cards tilt toward the pointer (CSS `perspective` +
  `rotateX/Y`, no WebGL).
- The "12 languages" counter gets a slowly turning dotted globe marking
  traveler countries (drei `Points`, a few KB). Optional.
- The hero cutout gets a soft depth parallax against the wordmark on pointer
  move (2 layers, transforms only).

**Performance guardrails:** the map is a pre-baked, compressed glTF (Draco or
Meshopt) under about 400 KB plus a 2048 px WebP texture. The canvas renders
on demand (`frameloop="demand"`), DPR is capped at 1.5, and it pauses
offscreen. The SVG fallback ships in the pre-rendered HTML so the section is
never empty. Mobile Lighthouse stays 90+ because the emulated phone never
loads three.js.

## 13. Lighthouse baseline (merheb.xyz, mobile)

Lighthouse 12.2, mobile emulation, run on 2026-11-03 through Edge headless.

| Metric | merheb.xyz | Issam target |
|---|---|---|
| Performance | **55** | 90+ |
| Accessibility | 95 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | **17.5 s** | under 1.8 s |
| Largest Contentful Paint | **18.8 s** | under 2.5 s |
| Speed Index | **34.3 s** | under 3.4 s |
| Total Blocking Time | 40 ms | under 200 ms |
| CLS | 0.004 | under 0.1 |
| Page weight | 1,364 KiB | under 900 KiB on the first view |

The very slow paint numbers come from the preloader: the page stays covered
until fonts **and `window.load`** finish, so nothing counts as painted for
about 17 s on a throttled phone. That is the biggest single thing to beat,
and why the Issam build has no blocking preloader on mobile.
