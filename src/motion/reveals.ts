/* Section titles rise word by word as they come into view. Split in JS so the
   server HTML stays plain text and a failed script hides nothing. */
import { gsap } from './gsap';
import { prefersReducedMotion } from '../lib/viewport';

export function initTitleReveals() {
  if (prefersReducedMotion()) return () => {};
  const restored: [HTMLElement, string][] = [];
  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('.section-title').forEach((title) => {
      const text = title.textContent ?? '';
      restored.push([title, text]);
      title.textContent = '';
      text.split(/\s+/).filter(Boolean).forEach((word, i) => {
        if (i) title.append(' ');
        const outer = document.createElement('span');
        outer.className = 'title-word';
        const inner = document.createElement('span');
        inner.textContent = word;
        outer.append(inner);
        title.append(outer);
      });
      gsap.from(title.querySelectorAll('.title-word > span'), {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power4.out',
        scrollTrigger: { trigger: title, start: 'top 90%', once: true },
      });
    });
  });
  return () => {
    ctx.revert();
    restored.forEach(([title, text]) => (title.textContent = text));
  };
}

/** The section lattices (.edge-geo) slide in from their side as the section
    arrives, then drift slowly while it scrolls past, so the pattern moves with
    the page instead of sitting still. */
export function initPatternMotion() {
  if (prefersReducedMotion()) return () => {};
  const rtl = document.documentElement.dir === 'rtl';
  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>('.edge-geo').forEach((geo) => {
      const section = geo.closest('section') ?? geo.parentElement!;
      const fromStart = geo.classList.contains('edge-geo-start');
      const top = geo.classList.contains('edge-geo-top');
      const side = (fromStart ? -1 : 1) * (rtl ? -1 : 1);
      gsap.fromTo(geo, { opacity: 0, x: top ? 0 : side * 70, y: top ? -40 : 0 }, {
        opacity: 1, x: 0, y: 0, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 35%', scrub: 1 },
      });
      gsap.fromTo(geo, { yPercent: 6 }, {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      });
    });
  });
  return () => ctx.revert();
}
