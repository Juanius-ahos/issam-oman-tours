/* Two small things only Issam's site has: say hello to him in any of his
   12 languages (each chip opens WhatsApp with a first message written in that
   language), and the current time in Muscat, so travelers see where he is. */
import { useEffect, useState } from 'react';
import { locales, type Locale } from '../config';
import { useI18n } from '../i18n';
import { WaLink } from './Bits';

/** First WhatsApp message per language: natural, short, ready to send. */
const firstMessage: Record<Locale, string> = {
  en: "Hi Issam, I'd like to plan a tour in Oman.",
  ar: 'مرحبًا عصام، أود التخطيط لجولة في عُمان.',
  es: 'Hola Issam, me gustaría planear un tour por Omán.',
  it: 'Ciao Issam, vorrei organizzare un tour in Oman.',
  de: 'Hallo Issam, ich möchte eine Tour im Oman planen.',
  fr: "Bonjour Issam, j'aimerais organiser un circuit à Oman.",
  zh: '你好 Issam，我想安排一次阿曼之旅。',
  pt: 'Olá Issam, gostaria de planear um tour em Omã.',
  ca: "Hola Issam, m'agradaria planificar un tour per Oman.",
  ru: 'Здравствуйте, Иссам! Хочу спланировать тур по Оману.',
  hi: 'नमस्ते इस्साम, मैं ओमान में एक टूर प्लान करना चाहता हूँ।',
  bal: 'سلام عصام، من عمانءَ یک ٹورے ءِ پلان کنگ لوٹان.',
};

export function HelloChips() {
  const { m, locale } = useI18n();
  // The visitor's own language first, then the rest in the site's order.
  const list = [...locales].sort((a, b) => Number(b.code === locale) - Number(a.code === locale));
  return (
    <div className="hello mt-7">
      <p className="label-xs text-ink/70">{m.plan.chipsLabel}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {list.map((l) => (
          <li key={l.code}>
            <WaLink
              location={`hello:${l.code}`}
              text={firstMessage[l.code]}
              className="hello-chip"
              lang={l.hreflang}
              dir={l.dir}
              aria-label={`WhatsApp, ${l.english}`}
            >
              {l.name}
            </WaLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Now in Muscat 18:42". Client-only, so the static HTML never shows a stale time. */
export function MuscatTime({ className = '' }: { className?: string }) {
  const { m, locale } = useI18n();
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'bal' ? 'ar' : locale, { timeZone: 'Asia/Muscat', hour: '2-digit', minute: '2-digit' });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [locale]);
  if (!now) return null;
  return (
    <p className={`muscat-time label-xs ${className}`}>
      <span className="muscat-dot" aria-hidden="true" />
      {m.plan.localTime.replace('{time}', now)}
    </p>
  );
}
