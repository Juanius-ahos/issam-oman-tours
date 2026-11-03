/* Traveler reviews as a fanned hand of cards (desktop) that rises into place
   on scroll and tilts toward the pointer; a swipe deck on mobile. */
import { useEffect, useRef, type PointerEvent } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { isMobile, prefersReducedMotion } from '../lib/viewport';

const fan = [
  { rot: -9, lift: '26px', z: 1 },
  { rot: -4.5, lift: '8px', z: 2 },
  { rot: 0, lift: '0px', z: 3 },
  { rot: 4.5, lift: '8px', z: 2 },
  { rot: 9, lift: '26px', z: 1 },
];

export function Reviews() {
  const { m } = useI18n();
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
        <h2 className="section-title">{m.reviews.title}</h2>
        <p className="label-xs w-fit rounded-md bg-amber/25 px-2 py-1 text-ink/80">{m.reviews.placeholderNote}</p>
      </header>
      <ul ref={hand} className="hand">
        {m.reviews.items.map((r, i) => (
          <li
            key={i}
            className="hand-card transition-transform duration-200 ease-out"
            style={{ ['--rot' as string]: `${fan[i].rot}deg`, ['--lift' as string]: fan[i].lift, ['--z' as string]: fan[i].z, ['--overlap' as string]: i ? '-38px' : '0' }}
            onPointerMove={tilt}
            onPointerLeave={reset}
          >
            <figure className="quote glass-ink">
              <blockquote className="text-[14.5px] leading-relaxed tracking-[-0.01em]">“{r.quote}”</blockquote>
              <figcaption>
                <strong className="block text-[14px] font-extrabold">{r.name}</strong>
                <span className="label-xs text-white/75">{r.meta}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
