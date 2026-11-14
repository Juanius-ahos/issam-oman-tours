/* "The Tours": four numbered cards over a real satellite map.
   Desktop: the section pins; scrolling moves the card strip sideways while
   the camera flies route to route and each route draws itself.
   Mobile / reduced motion: the whole map, then the cards stacked. */
import { useEffect, useRef, useState } from 'react';
import { tourSlugs, type TourSlug } from '../config';
import { useI18n } from '../i18n';
import { tourPath, toursPath } from '../routes';
import { tourMedia } from '../data/tours';
import { gsap, refreshSoon } from '../motion/gsap';
import { isMobile, prefersReducedMotion } from '../lib/viewport';
import { LazyVideo } from '../components/Media';
import { SatelliteRouteMap } from '../map/SatelliteRouteMap';
import { Icon } from '../components/Icon';
import { StarBadge } from '../oman/Ornament';

export function TourCard({ slug, className = '' }: { slug: TourSlug; className?: string }) {
  const { m, locale } = useI18n();
  const t = m.tours.items[slug];
  const index = String(tourSlugs.indexOf(slug) + 1).padStart(2, '0');
  return (
    <a href={tourPath(locale, slug)} className={`tour-card group roll-host ${className}`} data-tour={slug}>
      <LazyVideo src={tourMedia[slug]} poster={tourMedia[slug].poster} label={t.name} sizes="(max-width: 900px) 100vw, 420px" className="tour-media h-full w-full" />
      <StarBadge className="!absolute start-4 top-4">{index}</StarBadge>
      <div className="p-[22px]">
        <h3 className="text-[clamp(26px,2.4vw,38px)] font-black leading-none tracking-[-0.04em]">{t.name}</h3>
        <p className="mt-2 max-w-[34ch] text-[13px] text-white/80">{t.short}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-accent-light">
          {m.tours.view}
          <Icon name="arrowRight" size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </a>
  );
}

export function Tours() {
  const { m, dir, locale } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<TourSlug | null>(null);
  const [mode, setMode] = useState<'static' | 'pinned'>('static');

  useEffect(() => {
    if (isMobile() || prefersReducedMotion()) return;
    setMode('pinned');
  }, []);

  useEffect(() => {
    if (mode !== 'pinned') return;
    const ctx = gsap.context(() => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - el.parentElement!.clientWidth);
      const sign = dir === 'rtl' ? 1 : -1;
      gsap.fromTo(
        el,
        { x: 0 },
        {
          x: () => sign * distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              setActive(tourSlugs[Math.min(tourSlugs.length - 1, Math.floor(st.progress * tourSlugs.length))]);
            },
            onLeaveBack: () => setActive(null),
          },
        },
      );
      gsap.fromTo(
        el.children,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 75%' } },
      );
    }, section);
    refreshSoon();
    return () => ctx.revert();
  }, [mode, dir]);

  return (
    <section id="tours" ref={section} className={`relative ${mode === 'pinned' ? 'h-screen overflow-hidden' : 'section'}`}>
      {mode === 'pinned' ? (
        <>
          <div className="absolute inset-0">
            <SatelliteRouteMap active={active} className="h-full w-full" />
            <div className="sat-scrim" />
          </div>
          <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-[6vh] pt-[8vh]">
            <header className="tours-head relative max-w-[560px] text-white">
              <p className="eyebrow !text-white/80">{m.tours.eyebrow}</p>
              <h2 className="section-title mt-3">{m.tours.title}</h2>
              <p className="section-lead mt-3 !text-white/85">{m.tours.lead}</p>
              <p className="label-xs mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-accent-light">
                <span className="flex items-center gap-2">
                  <Icon name="route" size={14} />
                  {m.tours.mapHint}
                </span>
                <a href={toursPath(locale)} className="text-white underline underline-offset-4 hover:text-accent-light">{m.nav.allTours}</a>
              </p>
            </header>
            <div className="-me-[var(--gutter)] overflow-hidden">
              <div ref={track} className="flex w-max gap-[18px] pe-[var(--gutter)]">
                {tourSlugs.map((slug) => (
                  <TourCard
                    key={slug}
                    slug={slug}
                    className={`h-[min(36vh,360px)] w-[clamp(280px,26vw,420px)] transition-transform duration-500 ease-out ${active === slug ? '-translate-y-3' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="section-head">
            <p className="eyebrow">{m.tours.eyebrow}</p>
            <h2 className="section-title">{m.tours.title}</h2>
            <p className="section-lead">{m.tours.lead}</p>
            <a href={toursPath(locale)} className="label-xs text-accent-deep underline underline-offset-4">{m.nav.allTours}</a>
          </header>
          <figure className="mb-8 overflow-hidden rounded-[var(--radius)] border border-ink/10">
            <SatelliteRouteMap className="aspect-[1000/739] w-full" />
            <figcaption className="sr-only">{m.tours.mapFallback}</figcaption>
          </figure>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {tourSlugs.map((slug) => (
              <TourCard key={slug} slug={slug} className="aspect-[4/5] sm:aspect-[3/4]" />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
