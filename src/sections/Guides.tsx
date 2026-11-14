/* "Oman travel guides": links to the long-form guides in this language (none
   rendered when a language has no guides yet). Used on home and the tours hub. */
import { useI18n } from '../i18n';
import { guidePath } from '../routes';
import { guides, guideSlugs, guideUi, hasGuide } from '../content/guides';
import { StarDivider, StarPattern } from '../oman/Ornament';

export function Guides({ id = 'guides', eyebrow }: { id?: string; eyebrow?: string }) {
  const { locale } = useI18n();
  const ui = guideUi[locale];
  const list = guideSlugs.filter((g) => hasGuide(g, locale));
  if (!ui || list.length === 0) return null;
  return (
    <section id={id} className="section isolate overflow-clip" aria-labelledby={`${id}-title`}>
      <StarPattern tone="sand" className="edge-geo" />
      <header className="section-head">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <StarDivider />
        <h2 id={`${id}-title`} className="section-title">{ui.footer}</h2>
      </header>
      <ul className="grid gap-3 md:grid-cols-3">
        {list.map((g) => (
          <li key={g}>
            <a href={guidePath(locale, g)} className="group flex h-full flex-col rounded-[var(--radius)] border border-ink/12 bg-white/60 p-6 transition-colors hover:border-accent hover:bg-white">
              <span className="label-xs text-accent-deep">{ui.kicker}</span>
              <span className="mt-2 block text-[20px] font-extrabold leading-snug tracking-[-0.02em]">{guides[g][locale]!.title}</span>
              <span className="mt-2 block flex-1 text-[14.5px] text-ink/70">{guides[g][locale]!.seoDescription}</span>
              <span className="mt-4 text-[13px] font-extrabold text-accent-deep underline-offset-4 group-hover:underline" aria-hidden="true">→</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
