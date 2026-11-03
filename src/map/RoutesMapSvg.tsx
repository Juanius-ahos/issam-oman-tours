/* Static SVG version of the routes map. Ships in the pre-rendered HTML, so the
   section is never empty, and it is all that phones, reduced motion and
   Lighthouse ever load. */
import { tourSlugs, type TourSlug } from '../config';
import { tourGeo } from '../data/tours';
import { useI18n } from '../i18n';
import { H, W, coast, hajar, land, project, svgPath, wahiba } from './geo';

export const routeColor: Record<string, string> = {
  accent: 'rgb(var(--accent))',
  deep: 'rgb(var(--accent-deep))',
  amber: 'rgb(var(--amber))',
  ink: 'rgb(var(--ink))',
};

export function routePath(slug: TourSlug) {
  const g = tourGeo[slug];
  const pts = [g.start, ...g.stops].map(project);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    // Gentle bow so routes read as roads, not rulers.
    const mx = (ax + bx) / 2 + (by - ay) * 0.12;
    const my = (ay + by) / 2 - (bx - ax) * 0.12;
    d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  return d;
}

export function RoutesMapSvg({
  active,
  focus,
  slice = false,
  className = '',
}: {
  active?: TourSlug | null;
  focus?: TourSlug;
  /** Fill the box like object-fit: cover. */
  slice?: boolean;
  className?: string;
}) {
  const { m } = useI18n();
  const slugs = focus ? [focus] : tourSlugs;

  // Crop to the focused tour on tour pages.
  let viewBox = `0 0 ${W} ${H}`;
  if (focus) {
    const pts = [tourGeo[focus].start, ...tourGeo[focus].stops].map(project);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const pad = 70;
    const x0 = Math.min(...xs) - pad;
    const y0 = Math.min(...ys) - pad;
    const w = Math.max(Math.max(...xs) - x0 + pad, 260);
    const h = Math.max(Math.max(...ys) - y0 + pad, 200);
    viewBox = `${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}`;
  }

  const [mx, my] = project([58.5, 23.0]);
  return (
    <svg viewBox={viewBox} preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} className={className} role="img" aria-label={m.tours.mapFallback}>
      <defs>
        <pattern id="sea-lines" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <path d="M0 7h14" stroke="rgb(var(--accent) / .22)" strokeWidth="1" />
        </pattern>
        <linearGradient id="hajar-g" x1="0" x2="1">
          <stop offset="0" stopColor="rgb(var(--ink) / .14)" />
          <stop offset="1" stopColor="rgb(var(--ink) / .08)" />
        </linearGradient>
      </defs>
      <rect x="-500" y="-500" width={W + 1000} height={H + 1000} fill="url(#sea-lines)" />
      <path d={svgPath(land, true)} fill="rgb(var(--sand))" stroke="rgb(var(--ink) / .5)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={svgPath(coast)} fill="none" stroke="rgb(var(--ink) / .12)" strokeWidth="8" strokeLinejoin="round" />
      <path d={svgPath(hajar)} fill="none" stroke="url(#hajar-g)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round" />
      <rect
        x={project([wahiba.west, wahiba.north])[0]}
        y={project([wahiba.west, wahiba.north])[1]}
        width={project([wahiba.east, wahiba.south])[0] - project([wahiba.west, wahiba.north])[0]}
        height={project([wahiba.east, wahiba.south])[1] - project([wahiba.west, wahiba.north])[1]}
        rx="40"
        fill="rgb(var(--amber) / .22)"
      />
      <text x={mx} y={my} className="fill-ink/30 text-[13px] font-extrabold uppercase tracking-[0.3em]">Hajar</text>

      {slugs.map((slug) => {
        const g = tourGeo[slug];
        const isActive = !active || active === slug;
        return (
          <g key={slug} opacity={isActive ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
            <path d={routePath(slug)} fill="none" stroke={routeColor[g.hue]} strokeWidth="4" strokeLinecap="round" strokeDasharray={isActive ? undefined : '2 8'} />
            {g.stops.map((s, i) => {
              const [x, y] = project(s);
              return <circle key={i} cx={x} cy={y} r="5" fill="rgb(var(--sand))" stroke={routeColor[g.hue]} strokeWidth="3" />;
            })}
            {(() => {
              const [x, y] = project(g.stops[g.stops.length - 1]);
              return (
                <g transform={`translate(${x} ${y - 26})`}>
                  <rect x="-17" y="-13" width="34" height="24" rx="8" fill="rgb(var(--ink))" />
                  <text textAnchor="middle" y="4" className="fill-sand text-[12px] font-black">{g.index}</text>
                </g>
              );
            })()}
          </g>
        );
      })}
      {(() => {
        const [x, y] = project(tourGeo['muscat-city'].start);
        return (
          <g>
            <circle cx={x} cy={y} r="9" fill="rgb(var(--accent))" stroke="rgb(var(--ink))" strokeWidth="2.5" />
            <text x={x + 14} y={y - 10} className="fill-ink text-[15px] font-black">Muscat</text>
          </g>
        );
      })()}
    </svg>
  );
}
