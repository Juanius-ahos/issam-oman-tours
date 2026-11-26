/* "Experiences and transfers": the five extras Issam offers beyond the tours.
   Each card opens WhatsApp with the activity already named. The two experiences
   get wide cards, the three transfers sit in a row below. Data: src/data/extras.ts. */
import { useI18n } from '../i18n';
import { extraPhotos, extraSlugs, seasonalExtras } from '../data/extras';
import { WaLink } from '../components/Bits';
import { Icon } from '../components/Icon';
import { StarDivider, StarPattern } from '../oman/Ornament';

export function Extras({ id = 'extras' }: { id?: string }) {
  const { m } = useI18n();
  const x = m.extras;
  return (
    <section id={id} className="section isolate overflow-clip" aria-labelledby={`${id}-title`} data-own-cta>
      <StarPattern tone="sand" className="edge-geo edge-geo-start" />
      <header className="section-head">
        <p className="eyebrow">{x.eyebrow}</p>
        <StarDivider />
        <h2 id={`${id}-title`} className="section-title">{x.title}</h2>
        <p className="section-lead">{x.lead}</p>
      </header>
      <ul className="extras-grid">
        {extraSlugs.map((slug, i) => {
          const item = x.items[slug];
          const photo = extraPhotos[slug];
          return (
            <li key={slug} className={i < 2 ? 'extra-wide' : ''}>
              <WaLink location={`extra:${slug}`} text={`${x.waIntro} ${item.name}`} className="tour-card extra-card group">
                <img
                  className="tour-media tour-photo h-full w-full"
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes={i < 2 ? '(max-width: 900px) 100vw, 40vw' : '(max-width: 900px) 100vw, 27vw'}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={photo.pos ? { objectPosition: photo.pos } : undefined}
                />
                {seasonalExtras.includes(slug) && <span className="extra-badge">{x.seasonal}</span>}
                <div className="p-[22px]">
                  <h3 className="text-[clamp(22px,2vw,32px)] font-black leading-[1.02] tracking-[-0.035em]">{item.name}</h3>
                  <p className="mt-2 max-w-[44ch] text-[13.5px] leading-snug text-white/85">{item.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-accent-light">
                    <Icon name="whatsapp" size={14} />
                    {x.cta}
                  </span>
                </div>
              </WaLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
