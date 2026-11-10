/* "Also available": interpreting and translation, deliberately small. */
import { useI18n } from '../i18n';
import { WaLink } from '../components/Bits';
import { Icon } from '../components/Icon';

export function Also() {
  const { m } = useI18n();
  return (
    <section id="also" className="border-y border-ink/10 px-[var(--gutter)] py-10" aria-labelledby="also-title">
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
        <div className="flex max-w-[760px] items-start gap-4">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-ink/[0.07]">
            <Icon name="translate" size={20} />
          </span>
          <div>
            <p className="eyebrow">{m.also.eyebrow}</p>
            <h2 id="also-title" className="mt-1.5 text-[clamp(20px,2vw,26px)] font-extrabold tracking-[-0.02em]">{m.also.title}</h2>
            <p className="mt-1.5 text-ink/65">{m.also.text}</p>
          </div>
        </div>
        <WaLink location="also" text={m.also.title} className="btn btn-outline">
          {m.also.cta}
          <Icon name="arrowRight" size={16} className="rtl:-scale-x-100" />
        </WaLink>
      </div>
    </section>
  );
}
