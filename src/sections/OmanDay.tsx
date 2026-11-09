/* One day in Oman, played by scrolling. A sticky frame cuts between four real
   photographs, one per tour, each pushing in slowly while its caption changes.
   Sticky rather than pinned, so it works on phones too. */
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { photoSrc, photoSrcSet, type PhotoSlug } from '../data/photos';

const shots: PhotoSlug[] = ['nizwa-oasis', 'wadi-shab', 'wahiba-sunset', 'muttrah-night'];

export function OmanDay() {
  const { m } = useI18n();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      });
      const count = shots.length;
      q<HTMLElement>('.day-photo').forEach((photo, i) => {
        const at = i / count;
        tl.fromTo(photo, { scale: 1.16 }, { scale: 1, duration: 1 / count + 0.08 }, Math.max(0, at - 0.04));
        if (i > 0) tl.fromTo(photo, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.09, ease: 'power2.inOut' }, at - 0.045);
      });
      q<HTMLElement>('.day-cap').forEach((cap, i, all) => {
        const at = i / all.length;
        if (i > 0) tl.fromTo(cap, { autoAlpha: 0, y: 46, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.05, ease: 'power2.out' }, at + 0.01);
        if (i < all.length - 1) tl.to(cap, { autoAlpha: 0, y: -36, filter: 'blur(6px)', duration: 0.04, ease: 'power1.in' }, at + 0.2);
      });
      tl.fromTo('.day-progress', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="day" aria-label={m.day.label}>
      <div className="day-frame">
        {shots.map((slug, i) => (
          <img
            key={slug}
            className="day-photo"
            src={photoSrc(slug)}
            srcSet={photoSrcSet(slug)}
            sizes="100vw"
            alt={m.day.items[i].title}
            loading="lazy"
            decoding="async"
            style={i === 0 ? undefined : { clipPath: 'inset(100% 0% 0% 0%)' }}
          />
        ))}
        <div className="day-scrim" />
        <div className="day-caps">
          {m.day.items.map((item, i) => (
            <div key={item.time} className="day-cap" style={i === 0 ? undefined : { visibility: 'hidden', opacity: 0 }}>
              <p className="day-time">{item.time}</p>
              <h2 className="day-title">{item.title}</h2>
              <p className="day-text">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="day-rail" aria-hidden="true">
          <span className="day-progress" />
        </div>
      </div>
    </section>
  );
}
