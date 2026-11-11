/* Issam's own motto, set large on a dark band of Islamic geometry: star-and-cross
   lattice, a friezed border and two sixteen-point rosettes that turn as you scroll. */
import { Fragment, useEffect, useRef } from 'react';
import { config } from '../config';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { Avatar } from '../components/Bits';
import { Frieze, Rosette, StarDivider, StarPattern } from '../oman/Ornament';

/** The phrase Issam puts in quotation marks ("the languages") gets the accent color. */
const quoted = /(["«„“][^"«»„“”]+["»“”])/;

export function QuoteBand() {
  const { m } = useI18n();
  const root = useRef<HTMLElement>(null);
  const text = m.story.cards[2].quote;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = () => ({ trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 });
      gsap.fromTo('.rosette-a', { rotate: -40 }, { rotate: 50, ease: 'none', scrollTrigger: st() });
      gsap.fromTo('.rosette-b', { rotate: 30 }, { rotate: -40, ease: 'none', scrollTrigger: st() });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="quote-band" aria-label={config.brand.nickname}>
      <Frieze />
      <div className="quote-band-body">
        <StarPattern tone="dark" className="quote-band-geo" />
        <Rosette className="rosette-a" />
        <Rosette className="rosette-b" />
        <figure className="quote-band-figure">
          <StarDivider align="center" width={280} className="mx-auto" />
          <blockquote className="quote-band-text">
            {text.split(quoted).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>))}
          </blockquote>
          <figcaption className="quote-band-by">
            <Avatar className="h-11 w-11" />
            <span>
              <b>{config.brand.person}</b>
              <i>{config.brand.nickname}</i>
            </span>
          </figcaption>
        </figure>
      </div>
      <Frieze />
    </section>
  );
}
