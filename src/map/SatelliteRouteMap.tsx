/* The routes on real satellite imagery of northern Oman. Lines follow the
   actual roads (data/routeLines.ts). The camera flies to whichever tour is
   active, or frames one tour on its own page. */
import { useEffect, useRef } from 'react';
import { tourSlugs, type TourSlug } from '../config';
import { routeLines } from '../data/routeLines';
import { tourGeo } from '../data/tours';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { BASE } from '../routes';
import { H, W, project } from './geo';

const MAX_ZOOM = 3.4;
/** Stops whose label sits on the left, so neighbours don't collide. */
const labelLeft: Record<TourSlug, number[]> = {
  'muscat-city': [0, 2],
  'nizwa-mountains': [0, 3],
  'wahiba-desert': [2],
  'wadi-shab-coast': [1],
};
const linePath = (slug: TourSlug) =>
  routeLines[slug]
    .map(project)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join('');

const pct = (slugPoint: [number, number]) => ({ left: `${(slugPoint[0] / W) * 100}%`, top: `${(slugPoint[1] / H) * 100}%` });

export function SatelliteRouteMap({ active, focus, className = '' }: { active?: TourSlug | null; focus?: TourSlug; className?: string }) {
  const { m } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const target = focus ?? active ?? null;
  const slugs = focus ? [focus] : tourSlugs;

  useEffect(() => {
    const box = stage.current!;
    const c = cam.current!;
    const place = (animate: boolean) => {
      const cw = box.clientWidth;
      const ch = box.clientHeight;
      const mw = c.offsetWidth;
      const mh = c.offsetHeight;
      let scale = 1;
      let x = 0;
      let y = 0;
      if (target) {
        // A tour page frames the whole drive from Muscat; the home page zooms to the stops.
        const pts = (focus ? routeLines[target] : tourGeo[target].stops).map(project).map(([px, py]) => [(px / W) * mw, (py / H) * mh]);
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const bw = Math.max(...xs) - Math.min(...xs) || 1;
        const bh = Math.max(...ys) - Math.min(...ys) || 1;
        // Home page: keep the route in the open area above the cards and beside the heading.
        const area = focus ? { w: cw * 0.8, h: ch * 0.72, x: cw * 0.5, y: ch * 0.5 } : { w: cw * 0.5, h: ch * 0.4, x: cw * 0.66, y: ch * 0.3 };
        scale = gsap.utils.clamp(focus ? 1 : 1.5, MAX_ZOOM, Math.min(area.w / bw, area.h / bh));
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        const limX = Math.max(0, (mw * scale - cw) / 2);
        const limY = Math.max(0, (mh * scale - ch) / 2);
        x = gsap.utils.clamp(-limX, limX, area.x - cw / 2 - (cx - mw / 2) * scale);
        y = gsap.utils.clamp(-limY, limY, area.y - ch / 2 - (cy - mh / 2) * scale);
      }
      const sync = () => c.style.setProperty('--cam', String(gsap.getProperty(c, 'scale')));
      gsap.to(c, { x, y, scale, xPercent: -50, yPercent: -50, duration: animate && !prefersReducedMotion() ? 1.5 : 0, ease: 'power3.inOut', overwrite: true, onUpdate: sync, onComplete: sync });
    };
    place(!focus);
    const onResize = () => place(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [target, focus]);

  const muscat = project(tourGeo['muscat-city'].start);
  return (
    <div ref={stage} className={`sat-map ${className}`} role="img" aria-label={m.tours.mapFallback}>
      <div ref={cam} className="sat-cam">
        <img
          src={`${BASE}media/map/oman-satellite-1600.webp`}
          srcSet={`${BASE}media/map/oman-satellite-1600.webp 1600w, ${BASE}media/map/oman-satellite-3200.webp 3200w`}
          sizes={focus ? '(max-width: 900px) 100vw, 45vw' : '(max-width: 900px) 100vw, 170vw'}
          width={3200}
          height={2365}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {slugs.map((slug) => {
            const on = !target || target === slug;
            return (
              <g key={slug} className={on ? 'is-on' : ''}>
                <path d={linePath(slug)} className="sat-line-base" />
                <path d={linePath(slug)} className="sat-line" pathLength={1} />
              </g>
            );
          })}
        </svg>
        {slugs.map((slug) => {
          const g = tourGeo[slug];
          const open = target === slug;
          if (!open) {
            if (target) return null;
            return (
              <span key={slug} className="sat-pin sat-pin-end" style={pct(project(g.stops[g.stops.length - 1]))}>
                {g.index}
              </span>
            );
          }
          return g.stops.map((s, i) => (
            <span key={`${slug}-${i}`} className={`sat-pin ${labelLeft[slug].includes(i) ? 'sat-pin-flip' : ''}`} style={pct(project(s))}>
              <b>{i + 1}</b>
              <em>{m.tours.items[slug].stops[i].name}</em>
            </span>
          ));
        })}
        {!focus && (
          <span className="sat-pin sat-pin-city" style={pct(muscat)}>
            <i />
            <em>Muscat</em>
          </span>
        )}
      </div>
      <p className="sat-credit">
        <a href="https://cloudless.eox.at" target="_blank" rel="noopener">Sentinel-2 cloudless by EOX</a> (modified Copernicus Sentinel data 2016),{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. Roads ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
      </p>
    </div>
  );
}
