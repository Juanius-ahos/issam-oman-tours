/* One ornament layer for the whole page, so the light sections share a single
   star-and-cross lattice and one rosette instead of each having its own piece.
   It sits behind everything (fixed, z -1); dark sections simply cover it.
   On scroll the lattice drifts slowly and the rosette turns, so it moves with
   the cinematic scroll rather than starting and stopping at section edges. */
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { Rosette, StarPattern } from './Ornament';

export function PageGeo() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      const st = () => ({ trigger: document.documentElement, start: 0, end: 'max', scrub: 1.2 });
      gsap.fromTo('.page-geo-lattice', { yPercent: 0 }, { yPercent: -18, ease: 'none', scrollTrigger: st() });
      gsap.fromTo('.page-geo-rosette', { rotate: 0, yPercent: -10 }, { rotate: 220, yPercent: 10, ease: 'none', scrollTrigger: st() });
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className="page-geo" aria-hidden="true">
      <div className="page-geo-lattice">
        <StarPattern tone="sand" />
      </div>
      <Rosette tone="sand" className="page-geo-rosette" />
    </div>
  );
}
