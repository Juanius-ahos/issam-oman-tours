/* Language switcher: links to the same page in each locale (real links, so
   crawlers and no-JS visitors can use it too). */
import { useEffect, useId, useRef, useState } from 'react';
import { locales } from '../config';
import { useI18n } from '../i18n';
import { pathFor, swapLocale, type Route } from '../routes';
import { Icon } from './Icon';

export function LanguageSwitcher({ route, variant = 'light' }: { route: Route; variant?: 'light' | 'dark' }) {
  const { m, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${locale}, ${m.nav.language}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-[30px] items-center gap-1.5 rounded-lg px-2 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
          variant === 'dark' ? 'bg-ink text-sand hover:bg-ink/85' : 'bg-white/15 text-white hover:bg-white/25'
        }`}
      >
        <Icon name="globe" size={14} />
        {locale}
      </button>
      {open && (
        <ul
          id={id}
          className="absolute end-0 top-[calc(100%+8px)] z-50 grid max-h-[70vh] w-48 gap-0.5 overflow-y-auto rounded-xl bg-ink p-1.5 text-sand shadow-2xl"
        >
          {locales.map((l) => (
            <li key={l.code}>
              <a
                href={pathFor(swapLocale(route, l.code))}
                hrefLang={l.hreflang}
                lang={l.code}
                aria-current={l.code === locale ? 'true' : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10 ${
                  l.code === locale ? 'bg-accent text-ink hover:bg-accent' : ''
                }`}
              >
                <span>{l.name}</span>
                <span className="text-[10px] font-extrabold uppercase opacity-60">{l.code}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
