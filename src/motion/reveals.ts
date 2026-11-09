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
