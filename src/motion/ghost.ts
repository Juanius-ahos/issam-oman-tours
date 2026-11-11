/* ══════════════════════════════════════════════════════════════════════
   GHOST COLLAPSE (desktop only). DESIGN-NOTES 6 and 11.

   The hero's big elements are not copies: they ARE the sidebar's nodes.
   Each sidebar node marked [data-ghost="id"] has a twin in the hero marked
   [data-ghost-target="id"] that only reserves the hero-sized box. We measure
   both, then tween the real node FROM the hero box back TO its sidebar slot,
   scrubbed against a pinned hero, so the hero physically pours into the nav.

   Two strategies:
     text  absolute + tween font-size, so the wordmark stays crisp at 30x.
     box   uniform scale from top-left, for cards and buttons (scale under 2x).

   Measure everything first, mutate after: a write mid-pass invalidates every
   rect read after it.
   ══════════════════════════════════════════════════════════════════════ */
import { gsap, ScrollTrigger } from './gsap';
import { isMobile, prefersReducedMotion } from '../lib/viewport';

const COLLAPSE_PX = 1150;

type Measured = {
  real: HTMLElement;
  type: 'text' | 'box';
  r: DOMRect;
  g: DOMRect;
  parent: DOMRect;
  realFont: number;
  ghostFont: number;
  realColor: string;
  ghostColor: string;
};

export function ghostEnabled() {
  return !isMobile() && !prefersReducedMotion();
}

export function createGhost(hero: HTMLElement): () => void {
  const html = document.documentElement;
  if (!ghostEnabled()) {
    html.classList.add('no-ghost', 'is-collapsed');
    return () => html.classList.remove('no-ghost', 'is-collapsed');
  }
  html.classList.remove('no-ghost');

  let front: HTMLImageElement | null = null;
  const ctx = gsap.context(() => {
    const reals = [...document.querySelectorAll<HTMLElement>('[data-ghost]')];
    const rtl = document.dir === 'rtl';

    // Phase 1: read only.
    const measured: Measured[] = [];
    for (const real of reals) {
      const id = real.dataset.ghost!;
      const ghost = hero.querySelector<HTMLElement>(`[data-ghost-target="${id}"]`);
      if (!ghost) continue;
      const rs = getComputedStyle(real);
      const gs = getComputedStyle(ghost);
      measured.push({
        real,
        type: (real.dataset.ghostType as 'text' | 'box') || 'box',
        r: real.getBoundingClientRect(),
        g: ghost.getBoundingClientRect(),
        parent: real.parentElement!.getBoundingClientRect(),
        realFont: parseFloat(rs.fontSize),
        ghostFont: parseFloat(gs.fontSize),
        realColor: rs.color,
        ghostColor: gs.color,
      });
    }

    const portrait = hero.querySelector<HTMLImageElement>('.hero-portrait');
    const portraitBox = portrait?.getBoundingClientRect();
    const markBottom = hero.querySelector('[data-ghost-target="wordmark"]')?.getBoundingClientRect().bottom ?? 0;

    // Phase 2: write.
    html.classList.add('is-ghosting');

    // The flying wordmark lives in the sidebar, which stacks above the whole hero.
    // To keep the figure in front of the letters, lay a copy of the portrait over
    // the sidebar, clipped to the wordmark's band so the stat cards and CTA stay on top.
    if (portrait && portraitBox) {
      const seam = Math.round(Math.min(portraitBox.height, Math.max(0, markBottom + 6 - portraitBox.top)));
      front = portrait.cloneNode() as HTMLImageElement;
      front.className = '';
      front.alt = '';
      front.setAttribute('aria-hidden', 'true');
      Object.assign(front.style, {
        position: 'fixed', zIndex: '71', pointerEvents: 'none', maxWidth: 'none',
        left: `${portraitBox.left}px`, top: `${portraitBox.top}px`,
        width: `${portraitBox.width}px`, height: `${portraitBox.height}px`,
        clipPath: `inset(0 0 ${portraitBox.height - seam}px 0)`,
      });
      document.body.appendChild(front);
      // Two halves that meet at the seam, so they don't double up while they fade.
      // One shared pixel row hides the hairline the browser antialiases between them.
      portrait.style.clipPath = `inset(${Math.max(0, seam - 1)}px 0 0 0)`;
    }
    // A fresh config per tween: ScrollTrigger keeps state on the object it is given.
    const st = () => ({ trigger: hero, start: 'top top', end: `+=${COLLAPSE_PX}`, scrub: 1 });

    for (const m of measured) {
      const { real, r, g, parent } = m;
      if (m.type === 'text') {
        const p = real.parentElement!;
        // The text leaves the flow while it flies, so the badge keeps its own size
        // (text plus padding) and the text lands inside the padding, not on the corner.
        const ps = getComputedStyle(p);
        const pad = { t: parseFloat(ps.paddingTop), l: parseFloat(ps.paddingLeft), r: parseFloat(ps.paddingRight), b: parseFloat(ps.paddingBottom) };
        p.style.position = 'relative';
        p.style.minWidth = `${r.width + pad.l + pad.r}px`;
        p.style.minHeight = `${r.height + pad.t + pad.b}px`;
        const edge = rtl ? { right: pad.r } : { left: pad.l };
        const dx = rtl ? g.right - (parent.right - pad.r) : g.left - (parent.left + pad.l);
        gsap.fromTo(
          real,
          { position: 'absolute', top: pad.t, ...edge, x: dx, y: g.top - (parent.top + pad.t), fontSize: m.ghostFont, color: m.ghostColor },
          { position: 'absolute', top: pad.t, ...edge, x: 0, y: 0, fontSize: m.realFont, color: m.realColor, ease: 'power1.inOut', scrollTrigger: st() },
        );
      } else {
        const s = g.width / r.width;
        const dx = rtl ? g.right - r.right : g.left - r.left;
        gsap.fromTo(
          real,
          { x: dx, y: g.top - r.top, scale: s, transformOrigin: rtl ? 'top right' : 'top left' },
          { x: 0, y: 0, scale: 1, ease: 'power1.inOut', scrollTrigger: st() },
        );
      }
    }

    // As the hero empties, its sand fills with the star lattice and a rosette.
    gsap.fromTo(hero.querySelector('.hero-geo'), { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: `top+=${COLLAPSE_PX * 0.2} top`, end: `+=${COLLAPSE_PX * 0.6}`, scrub: 1 },
    });
    // Hero-only content leaves; the portrait blurs into the background figure.
    gsap.to(hero.querySelectorAll('[data-hero-fade]'), {
      opacity: 0, y: -40, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: `+=${COLLAPSE_PX * 0.45}`, scrub: 1 },
    });
    if (portrait) {
      gsap.to(front ? [portrait, front] : portrait, {
        filter: 'blur(18px)', opacity: 0, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: `+=${COLLAPSE_PX}`, scrub: 1 },
      });
    }
    // Sidebar panel backgrounds appear just as the labels arrive.
    // The wordmark badge waits until the flying letters have shrunk into it.
    gsap.fromTo('.side .wordmark-bg', { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: `top+=${COLLAPSE_PX * 0.9} top`, end: `top+=${COLLAPSE_PX} top`, scrub: 1 },
    });
    gsap.fromTo('.side-panel-bg:not(.wordmark-bg)', { opacity: 0 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: `top+=${COLLAPSE_PX * 0.38} top`, end: `top+=${COLLAPSE_PX * 0.5} top`, scrub: 1 },
    });
    gsap.fromTo('.side-nav, .side-tagline, .side-press, .side-lang', { autoAlpha: 0 }, {
      autoAlpha: 1, ease: 'none',
      scrollTrigger: { trigger: hero, start: `top+=${COLLAPSE_PX * 0.55} top`, end: `top+=${COLLAPSE_PX * 0.8} top`, scrub: 1 },
    });

    ScrollTrigger.create({
      trigger: hero,
      start: `top+=${COLLAPSE_PX - 30} top`,
      end: 'max',
      onEnter: () => html.classList.add('is-collapsed'),
      onLeaveBack: () => html.classList.remove('is-collapsed'),
    });

    // Pin last. Any hero trigger created after the pin would have its start
    // pushed past the pin's spacer (begin at 1150px instead of 0).
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: `+=${COLLAPSE_PX}`, pin: true, pinSpacing: true });
  });

  return () => {
    ctx.revert();
    front?.remove();
    hero.querySelector<HTMLElement>('.hero-portrait')?.style.removeProperty('clip-path');
    html.classList.remove('is-ghosting', 'is-collapsed');
    document.querySelectorAll<HTMLElement>('[data-ghost]').forEach((el) => {
      el.parentElement?.style.removeProperty('position');
      el.parentElement?.style.removeProperty('min-width');
      el.parentElement?.style.removeProperty('min-height');
    });
  };
}
