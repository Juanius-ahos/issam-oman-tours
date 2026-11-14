/* Oman travel guide page (/xx/guide/<slug>/): a long-form answer to one search
   question, written as plain readable sections, then the tours that fit it,
   quick answers (FAQ schema) and the request chat. Content: src/content/guides.ts. */
import { useI18n } from '../i18n';
import { homePath, guidePath } from '../routes';
import { guides, guideSlugs, guideUi, hasGuide, type GuideSlug } from '../content/guides';
import { TourCard } from '../sections/Tours';
import { Faq } from '../sections/Faq';
import { Plan } from '../sections/Plan';
import { StarDivider, StarPattern } from '../oman/Ornament';

export function GuidePage({ slug }: { slug: GuideSlug }) {
  const { m, locale } = useI18n();
  const g = guides[slug][locale]!;
  const ui = guideUi[locale]!;
  const others = guideSlugs.filter((s) => s !== slug && hasGuide(s, locale));
  const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(g.updated));
  return (
    <div className="desk:ps-[var(--nav-w)]">
      <article>
        <header className="section isolate overflow-clip pb-0 pt-[clamp(110px,16vh,170px)]">
          <StarPattern tone="sand" className="edge-geo" />
          <nav aria-label="Breadcrumb" className="label-xs mb-6 flex items-center gap-2 text-ink/60">
            <a href={homePath(locale)} className="hover:text-ink">{m.nav.home}</a>
            <span aria-hidden="true">/</span>
            <span>{ui.crumb}</span>
          </nav>
          <p className="eyebrow">{ui.kicker}</p>
          <StarDivider className="mt-3" />
          <h1 className="mt-4 max-w-[18ch] text-[clamp(38px,5.6vw,80px)] font-black leading-[0.97] tracking-[var(--track-tight)] [text-wrap:balance]">{g.title}</h1>
          <p className="label-xs mt-5 text-ink/60">
            {ui.updated} <time dateTime={g.updated}>{date}</time>
          </p>
          <p className="mt-6 max-w-[62ch] text-[clamp(17px,1.45vw,21px)] leading-relaxed text-ink/80">{g.lead}</p>
        </header>

        <div className="section guide-body max-w-[820px] pt-[clamp(40px,6vh,64px)]">
          {g.sections.map((s) => (
            <section key={s.h} className="mb-[clamp(28px,4vh,44px)]">
              <h2 className="text-[clamp(24px,2.3vw,34px)] font-black leading-tight tracking-[-0.025em]">{s.h}</h2>
              {s.p.map((t) => (
                <p key={t} className="mt-3 text-[17px] leading-[1.7] text-ink/80">{t}</p>
              ))}
              {s.list && (
                <ul className="mt-4 grid gap-2.5">
                  {s.list.map((t) => (
                    <li key={t} className="flex gap-3 text-[17px] leading-[1.6] text-ink/80">
                      <span className="mt-[9px] h-2 w-2 flex-none rotate-45 bg-accent" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>

      <section className="section pt-0" aria-labelledby="guide-tours">
        <h2 id="guide-tours" className="section-title mb-8">{ui.toursTitle}</h2>
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {g.tours.map((t) => (
            <TourCard key={t} slug={t} className="aspect-[4/5]" />
          ))}
        </div>
      </section>

      <Faq items={g.faq} eyebrow={ui.kicker} title={ui.faqTitle} id="guide-faq" />

      {others.length > 0 && (
        <section className="section pt-0" aria-labelledby="guide-more">
          <h2 id="guide-more" className="section-title mb-6">{ui.more}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {others.map((s) => (
              <li key={s}>
                <a href={guidePath(locale, s)} className="block rounded-[var(--radius)] border border-ink/12 bg-white/60 p-6 transition-colors hover:border-accent hover:bg-white">
                  <span className="block text-[20px] font-extrabold leading-snug tracking-[-0.02em]">{guides[s][locale]!.title}</span>
                  <span className="mt-2 block text-[15px] text-ink/70">{guides[s][locale]!.seoDescription}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Plan />
    </div>
  );
}
