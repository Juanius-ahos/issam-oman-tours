/* "Private Tours in Oman": the tours hub (/xx/tours/). One page that answers the
   search "tours in Oman" in every language: what Issam offers, all tours as
   cards, why book privately with him, a short FAQ and the request chat.
   Every claim here comes from Issam's answers (docs/issam-answers-2026-11.md). */
import { config, tourSlugs } from '../config';
import { useI18n } from '../i18n';
import { homePath } from '../routes';
import { Guides } from '../sections/Guides';
import { TourCard } from '../sections/Tours';
import { Faq } from '../sections/Faq';
import { Plan } from '../sections/Plan';
import { WaButton } from '../components/Bits';
import { Icon, type IconName } from '../components/Icon';
import { StarDivider, StarPattern } from '../oman/Ornament';

const whyIcons: IconName[] = ['users', 'translate', 'route', 'send', 'star'];

export function ToursPage() {
  const { m, locale } = useI18n();
  const p = m.toursPage;
  const rating = p.rating.replace('{score}', config.tripadvisorRating.score).replace('{count}', String(config.tripadvisorRating.count));
  return (
    <div className="desk:ps-[var(--nav-w)]">
      <section data-own-cta className="section isolate overflow-clip pt-[clamp(110px,16vh,170px)]">
        <StarPattern tone="sand" className="edge-geo" />
        <nav aria-label="Breadcrumb" className="label-xs mb-6 flex items-center gap-2 text-ink/60">
          <a href={homePath(locale)} className="hover:text-ink">{m.nav.home}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.crumb}</span>
        </nav>
        <p className="eyebrow">{p.eyebrow}</p>
        <StarDivider className="mt-3" />
        <h1 className="mt-4 max-w-[16ch] text-[clamp(40px,6vw,88px)] font-black leading-[0.95] tracking-[var(--track-tight)] [text-wrap:balance]">{p.title}</h1>
        <div className="mt-6 grid max-w-[760px] gap-4 text-[clamp(16px,1.35vw,19px)] text-ink/75">
          {p.intro.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <WaButton location="tours-hub" />
          <a href={config.tripadvisor} target="_blank" rel="noopener" className="ta-badge !mt-0">
            <span className="ta-score">{config.tripadvisorRating.score}</span>
            <span className="ta-text">{rating}</span>
          </a>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="hub-list">
        <h2 id="hub-list" className="section-title mb-8">{p.listTitle}</h2>
        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {tourSlugs.map((s) => (
            <TourCard key={s} slug={s} className="aspect-[4/5]" />
          ))}
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="hub-why">
        <h2 id="hub-why" className="section-title mb-8">{p.whyTitle}</h2>
        <ul className="grid gap-x-10 gap-y-7 md:grid-cols-2 xl:grid-cols-3">
          {p.why.map((w, i) => (
            <li key={w.t} className="flex gap-4">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-accent/12 text-accent-deep">
                <Icon name={whyIcons[i % whyIcons.length]} size={20} />
              </span>
              <span>
                <strong className="block text-[17px] font-extrabold">{w.t}</strong>
                <span className="mt-1 block text-[15px] text-ink/70">{w.d.replace('{score}', config.tripadvisorRating.score).replace('{count}', String(config.tripadvisorRating.count))}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Faq items={p.faq} eyebrow={m.faq.eyebrow} title={p.faqTitle} id="hub-faq" />

      <Guides id="hub-guides" />
      <Plan />
    </div>
  );
}
