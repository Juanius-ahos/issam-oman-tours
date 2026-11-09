/* Tour page: hero video, quick facts, the route as a mini timeline beside a
   focused map, what is included, and a request button. Same visual language
   as the home page. */
import { useEffect, useRef } from 'react';
import { tourSlugs, type TourSlug } from '../config';
import { useI18n } from '../i18n';
import { homePath } from '../routes';
import { tourMedia } from '../data/tours';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { LazyVideo } from '../components/Media';
import { Icon, type IconName } from '../components/Icon';
import { WaLink, RollText } from '../components/Bits';
import { useRequest } from '../components/TourRequest';
import { SatelliteRouteMap } from '../map/SatelliteRouteMap';
import { TourCard } from '../sections/Tours';
import { Faq } from '../sections/Faq';

export function TourPage({ slug }: { slug: TourSlug }) {
  const { m, locale } = useI18n();
  const t = m.tours.items[slug];
  const p = m.tourPage;
  const { openRequest } = useRequest();
  const root = useRef<HTMLDivElement>(null);
  const index = tourSlugs.indexOf(slug);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-rise]', { y: 30, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' });
      gsap.from('.route-step', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.route-list', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, [index]);

  const facts: { icon: IconName; label: string; value: string }[] = [
    { icon: 'clock', label: p.duration, value: t.duration },
    { icon: 'route', label: p.distance, value: t.distance },
    { icon: 'sun', label: p.bestTime, value: t.bestTime },
    { icon: 'users', label: p.group, value: p.groupValue },
  ];

  return (
    <div ref={root} className="desk:ps-[var(--nav-w)]">
      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden px-[var(--gutter)] pb-[7vh] pt-[120px] text-white desk:pt-[10vh]">
        <LazyVideo src={tourMedia[slug]} poster={tourMedia[slug].poster} label={t.name} className="!absolute inset-0 -z-10 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
        <nav aria-label="Breadcrumb" data-rise>
          <a href={`${homePath(locale)}#tours`} className="label-xs inline-flex items-center gap-1.5 text-white/75 hover:text-white">
            <Icon name="arrowRight" size={13} className="-scale-x-100 rtl:scale-x-100" />
            {p.back}
          </a>
        </nav>
        <p className="mt-6 text-[11px] font-extrabold tracking-[0.2em] text-accent-light" data-rise>
          {String(index + 1).padStart(2, '0')}
        </p>
        <h1 className="mt-2 max-w-[16ch] text-[clamp(44px,7vw,108px)] font-black leading-[0.92] tracking-[-0.045em] [text-wrap:balance]" data-rise>
          {t.name}
        </h1>
        <p className="mt-5 max-w-[54ch] text-[clamp(15px,1.3vw,18px)] text-white/85" data-rise>{t.intro}</p>
        <div className="mt-8 flex flex-wrap gap-2.5" data-rise>
          <button type="button" className="btn btn-accent btn-lg roll-host" onClick={() => openRequest(slug)}>
            <Icon name="send" size={17} />
            <RollText>{p.request}</RollText>
          </button>
          <WaLink location={`tour:${slug}`} text={`${m.form.waIntro} ${t.name}.`} className="btn btn-white btn-lg roll-host">
            <Icon name="whatsapp" size={18} />
            <RollText>{p.whatsapp}</RollText>
          </WaLink>
        </div>
      </section>

      {/* Facts */}
      <section className="grid grid-cols-2 gap-2.5 px-[var(--gutter)] py-8 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="glass-ink rounded-[var(--radius)] p-5">
            <Icon name={f.icon} size={18} className="text-accent-light" />
            <p className="label-xs mt-6 text-white/75">{f.label}</p>
            <p className="mt-1.5 text-[clamp(15px,1.4vw,19px)] font-extrabold leading-snug">{f.value}</p>
          </div>
        ))}
      </section>

      {/* Route + map */}
      <section className="section grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="eyebrow">{p.route}</h2>
          <ol className="route-list relative mt-6 border-s-2 border-dashed border-ink/20 ps-8">
            {t.stops.map((s, i) => (
              <li key={s.name} className="route-step relative pb-9 last:pb-0">
                <span className="absolute -start-[45px] top-0 grid h-[26px] w-[26px] place-items-center rounded-full bg-accent text-[11px] font-black text-white">
                  {i + 1}
                </span>
                <h3 className="text-[clamp(18px,1.7vw,24px)] font-extrabold tracking-[-0.02em]">{s.name}</h3>
                <p className="mt-1.5 max-w-[48ch] text-ink/70">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] border border-ink/10 lg:sticky lg:top-8">
          <SatelliteRouteMap focus={slug} className="absolute inset-0 h-full w-full" />
        </div>
      </section>

      {/* Included */}
      <section className="section grid gap-10 pt-0 md:grid-cols-2">
        {[
          { title: p.included, items: t.included, icon: 'check' as const, tone: 'bg-accent text-white' },
          { title: p.notIncluded, items: t.notIncluded, icon: 'minus' as const, tone: 'bg-ink/10 text-ink' },
        ].map((col) => (
          <div key={col.title}>
            <h2 className="text-[clamp(24px,2.4vw,34px)] font-black tracking-[-0.03em]">{col.title}</h2>
            <ul className="mt-5 grid gap-3 border-t border-ink/15 pt-5">
              {col.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-[15px]">
                  <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full ${col.tone}`}>
                    <Icon name={col.icon} size={13} />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Request band */}
      <section className="mx-[var(--gutter)] mb-[clamp(60px,9vh,110px)] flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-ink p-[clamp(24px,4vw,48px)] text-sand">
        <h2 className="max-w-[18ch] text-[clamp(28px,3.4vw,48px)] font-black leading-none tracking-[-0.03em]">{m.plan.title}</h2>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn btn-accent btn-lg" onClick={() => openRequest(slug)}>
            {p.request}
          </button>
          <WaLink location={`tour-band:${slug}`} text={`${m.form.waIntro} ${t.name}.`} className="btn btn-lg border border-sand/30 text-sand hover:border-sand">
            <Icon name="whatsapp" size={18} />
            {p.whatsapp}
          </WaLink>
        </div>
      </section>

      <Faq />

      {/* Other tours */}
      <section className="section pt-0">
        <h2 className="section-title mb-8">{p.more}</h2>
        <div className="grid gap-3.5 sm:grid-cols-3">
          {tourSlugs
            .filter((s) => s !== slug)
            .map((s) => (
              <TourCard key={s} slug={s} className="aspect-[4/5]" />
            ))}
        </div>
      </section>
    </div>
  );
}
