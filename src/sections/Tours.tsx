/* "The Tours": four numbered cards over a routes map.
   Desktop: the section pins; scrolling moves the card strip sideways while
   the map flies route to route and each route draws itself.
   Mobile / reduced motion: static SVG map, then the cards stacked. */
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { tourSlugs, type TourSlug } from '../config';
import { useI18n } from '../i18n';
import { tourPath } from '../routes';
import { tourMedia } from '../data/tours';
import { gsap, ScrollTrigger } from '../motion/gsap';
import { canRender3D, isMobile, prefersReducedMotion } from '../lib/viewport';
import { LazyVideo } from '../components/Media';
import { RoutesMapSvg } from '../map/RoutesMapSvg';
import { Icon } from '../components/Icon';

const RoutesMap3D = lazy(() => import('../map/RoutesMap3D'));

export function TourCard({ slug, className = '' }: { slug: TourSlug; className?: string }) {
  const { m, locale } = useI18n();
  const t = m.tours.items[slug];
  const index = String(tourSlugs.indexOf(slug) + 1).padStart(2, '0');
  return (
    <a href={tourPath(locale, slug)} className={`tour-card group roll-host ${className}`} data-tour={slug}>
      <LazyVideo src={tourMedia[slug]} poster={tourMedia[slug].poster} label={`${m.tours.videoLabel}: ${t.name}`} className="tour-media h-full w-full" />
      <span className="absolute start-5 top-5 text-[10px] font-extrabold tracking-[0.2em] text-white/80">{index}</span>
      <div className="p-[22px]">
        <h3 className="text-[clamp(26px,2.4vw,38px)] font-black leading-none tracking-[-0.04em]">{t.name}</h3>
        <p className="mt-2 max-w-[34ch] text-[13px] text-white/80">{t.short}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-accent">
          {m.tours.view}
          <Icon name="arrowRight" size={14} className="transition-transform duration-300 ease-out group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </a>
  );
}

export function Tours() {
  const { m, dir } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState<TourSlug | null>(null);
  const [mode, setMode] = useState<'static' | 'pinned'>('static');
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    if (isMobile() || prefersReducedMotion()) return;
    setMode('pinned');
    if (!canRender3D()) return;
    // Start fetching three.js a screen before the section arrives.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow3D(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(section.current!);
    return () => io.disconnect();
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
              progress.current = st.progress;
              setActive(tourSlugs[Math.min(3, Math.floor(st.progress * 4))]);
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
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [mode, dir]);

  return (
    <section id="tours" ref={section} className={`relative ${mode === 'pinned' ? 'h-screen overflow-hidden' : 'section'}`}>
      {mode === 'pinned' ? (
        <>
          <div className="absolute inset-0">
            <RoutesMapSvg active={active} slice className={`h-full w-full transition-opacity duration-700 ${show3D ? 'opacity-0' : 'opacity-100'}`} />
            {show3D && (
              <Suspense fallback={null}>
                <RoutesMap3D progress={progress} className="!absolute inset-0" />
              </Suspense>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sand via-transparent to-sand/90" />
          </div>
          <div className="relative flex h-full flex-col justify-between px-[var(--gutter)] pb-[6vh] pt-[8vh]">
            <header className="max-w-[640px]">
              <p className="eyebrow">{m.tours.eyebrow}</p>
              <h2 className="section-title mt-3">{m.tours.title}</h2>
              <p className="section-lead mt-3">{m.tours.lead}</p>
              <p className="label-xs mt-4 flex items-center gap-2 text-accent-deep">
                <Icon name="route" size={14} />
                {m.tours.mapHint}
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
          </header>
          <figure className="mb-8 overflow-hidden rounded-[var(--radius)] border border-ink/10">
            <RoutesMapSvg className="h-auto w-full" />
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
