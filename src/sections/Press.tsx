/* Press marquee. Loops forever, speeds up with scroll velocity, reverses
   when scrolling up, and skews a little at speed (DESIGN-NOTES 5.3). */
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap, Smooth } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { BASE } from '../routes';

// Confirmed by Issam (docs/issam-answers-2026-11.md). Logos are allowed: when the
// files arrive, put them in public/media/press/ and set logo to the file name.
// Until then the strip shows names only (no placeholder boxes). People carry no logo.
// TODO: confirm the exact name of "tv2 Spain" before adding it.
const press: { name: string; logo?: string }[] = [
  { name: 'Arriyadiyah' },
  { name: 'Al Shabiba FM' },
  { name: 'SBC' },
  { name: 'Iker Casillas' },
  { name: 'Plácido Domingo' },
];

export function Press() {
  const { m, dir } = useI18n();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = track.current!;
    const ctx = gsap.context(() => {
      // The track already holds 4 copies; loop over exactly half of it.
      const sign = dir === 'rtl' ? 1 : -1;
      const tween = gsap.fromTo(el, { xPercent: 0 }, { xPercent: 50 * sign, duration: 28, ease: 'none', repeat: -1 });
      const skew = gsap.quickTo(el, 'skewX', { duration: 0.4, ease: 'power3.out' });
      let smooth = 0;
      let raw = 0;
      const off = Smooth.onVelocity((v) => (raw = v));
      const tick = () => {
        smooth += (raw - smooth) * 0.08;
        raw *= 0.9;
        const boost = gsap.utils.clamp(-6, 6, smooth / 6);
        // Scrolling up plays the loop backwards.
        tween.timeScale((1 + Math.abs(boost)) * (boost < -0.3 ? -1 : 1));
        skew(gsap.utils.clamp(-8, 8, -smooth / 4) * -sign);
      };
      gsap.ticker.add(tick);
      return () => {
        off();
        gsap.ticker.remove(tick);
      };
    }, el);
    return () => ctx.revert();
  }, [dir]);

  const row = [...press, ...press];
  return (
    <section className="overflow-hidden border-b border-ink/10 py-[clamp(44px,6vh,76px)]" aria-label={m.press.eyebrow}>
      <p className="eyebrow mb-6 px-[var(--gutter)]">{m.press.eyebrow}</p>
      <div className="marquee">
        <div ref={track} className="marquee-track">
          {[...row, ...row].map((item, i) => (
            <span key={i} className="press-item" aria-hidden={i >= press.length ? 'true' : undefined}>
              {item.logo && (
                <img src={`${BASE}media/press/${item.logo}`} alt="" width={36} height={36} loading="lazy" className="h-[clamp(26px,2.4vw,36px)] w-auto" />
              )}
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
