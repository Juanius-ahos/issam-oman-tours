/* Press marquee. Loops forever, speeds up with scroll velocity, reverses
   when scrolling up, and skews a little at speed (DESIGN-NOTES 5.3). */
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap, Smooth } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';

// TODO: real logos (SVG or WebP) once Issam has permission to show them.
const press = ['Arriyadiyah', 'Al Shabiba FM', 'SBC'];

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
          {[...row, ...row].map((name, i) => (
            <span key={i} className="press-item" aria-hidden={i >= press.length ? 'true' : undefined}>
              <span className="ph grid h-[clamp(26px,2.4vw,36px)] w-[clamp(26px,2.4vw,36px)] place-items-center rounded-[22%] text-[8px] font-bold" aria-hidden="true">
                {m.press.logoLabel}
              </span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
