/* Traveler reviews as a fanned hand of cards (desktop) that rises into place
   on scroll and tilts toward the pointer; a swipe deck on mobile. */
import { useEffect, useRef, type PointerEvent } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { isMobile, prefersReducedMotion } from '../lib/viewport';
import { StarDivider } from '../oman/Ornament';

/** Position in the fanned hand for card i of n: tilted and lowered toward the edges. */
function fan(i: number, n: number) {
  const t = n > 1 ? (i / (n - 1)) * 2 - 1 : 0; // -1 at the left edge, 1 at the right
  return { rot: +(t * 9).toFixed(1), lift: `${Math.round(t * t * 26)}px`, z: Math.round((1 - Math.abs(t)) * 3) + 1 };
}

export function Reviews() {
  const { m, locale } = useI18n();
  const hand = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || isMobile()) return;
    const ctx = gsap.context(() => {
      gsap.from('.quote', {
        y: 160,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: hand.current, start: 'top 80%' },
        clearProps: 'transform,opacity',
      });
    }, hand);
    return () => ctx.revert();
  }, []);

  // Subtle 3D tilt toward the pointer (CSS perspective, no WebGL).
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 10}deg)`;
  };
  const reset = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <section id="reviews" className="section overflow-hidden">
      <header className="section-head">
        <p className="eyebrow">{m.reviews.eyebrow}</p>
        <StarDivider />
        <h2 className="section-title">{m.reviews.title}</h2>
        <p className="section-lead">{m.reviews.note}</p>
      </header>
      <ul ref={hand} className="hand">
        {m.reviews.items.map((r, i, all) => {
          const f = fan(i, all.length);
          return (
          <li
            key={i}
            className="hand-card transition-transform duration-200 ease-out"
            style={{ ['--rot' as string]: `${f.rot}deg`, ['--lift' as string]: f.lift, ['--z' as string]: f.z, ['--overlap' as string]: i ? '-46px' : '0' }}
            onPointerMove={tilt}
            onPointerLeave={reset}
          >
            <figure className="quote glass-ink">
              <div>
                <blockquote lang={r.lang} className="text-[14.5px] leading-relaxed tracking-[-0.01em]">“{r.quote}”</blockquote>
                {r.lang !== locale && (
                  <p className="mt-3 text-[12.5px] leading-snug text-white/75">
                    <span className="sr-only">{m.reviews.translation}: </span>
                    {r.translation}
                  </p>
                )}
              </div>
              <figcaption>
                <strong className="block text-[14px] font-extrabold">{r.name}</strong>
                <span className="label-xs text-white/75">{r.meta}</span>
              </figcaption>
            </figure>
          </li>
          );
        })}
      </ul>
    </section>
  );
}
