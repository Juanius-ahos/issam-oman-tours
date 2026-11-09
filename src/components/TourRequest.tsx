/* Tour request popup. Fields: tour, date, group size, preferred language,
   name, WhatsApp number, message. Submits to config.form.endpoint when set;
   otherwise (or on any failure) it opens WhatsApp with the request written
   out, so a lead is never lost. */
import { createContext, useCallback, useContext, useId, useState, type FormEvent, type ReactNode } from 'react';
import { config, locales, tourSlugs, whatsappUrl, type TourSlug } from '../config';
import { useI18n } from '../i18n';
import { trackFormSubmit } from '../lib/analytics';
import { Modal } from './Modal';
import { Icon } from './Icon';

type Ctx = { openRequest: (tour?: TourSlug) => void };
const RequestContext = createContext<Ctx>({ openRequest: () => {} });
export const useRequest = () => useContext(RequestContext);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState<TourSlug | ''>('');
  const openRequest = useCallback((t?: TourSlug) => {
    setTour(t ?? '');
    setOpen(true);
  }, []);
  return (
    <RequestContext.Provider value={{ openRequest }}>
      {children}
      <RequestModal open={open} onClose={() => setOpen(false)} initialTour={tour} />
    </RequestContext.Provider>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'whatsapp' | 'error';

function RequestModal({ open, onClose, initialTour }: { open: boolean; onClose: () => void; initialTour: TourSlug | '' }) {
  const { m, locale } = useI18n();
  const f = m.form;
  const titleId = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState(false);
  // Kept so the error state can offer a tap-to-send link: a window.open after
  // an awaited fetch is often blocked as a popup.
  const [waText, setWaText] = useState('');

  const close = () => {
    onClose();
    setStatus('idle');
    setInvalid(false);
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (!data.name?.trim() || !data.whatsapp?.trim() || !data.date) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    const tourName = data.tour ? m.tours.items[data.tour as TourSlug].name : f.tourAny;
    const langName = locales.find((l) => l.code === data.language)?.name ?? data.language;
    const text = [
      f.waIntro,
      `${f.tour}: ${tourName}`,
      `${f.date}: ${data.date}`,
      `${f.groupSize}: ${data.groupSize}`,
      `${f.language}: ${langName}`,
      `${f.name}: ${data.name}`,
      `${f.whatsapp}: ${data.whatsapp}`,
      data.message ? `${f.message} ${data.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    setWaText(text);
    const viaWhatsApp = (next: Status) => {
      window.open(whatsappUrl(text), '_blank', 'noopener');
      trackFormSubmit({ tour: data.tour || 'any', language: data.language, method: 'whatsapp' });
      setStatus(next);
    };

    if (!config.form.endpoint) return viaWhatsApp('whatsapp');
    setStatus('sending');
    try {
      const res = await fetch(config.form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, tourName, page: location.pathname, siteLocale: locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackFormSubmit({ tour: data.tour || 'any', language: data.language, method: 'endpoint' });
      setStatus('sent');
    } catch {
      viaWhatsApp('error');
    }
  }

  const done = status === 'sent' || status === 'whatsapp' || status === 'error';

  return (
    <Modal open={open} onClose={close} labelledBy={titleId} closeLabel={f.close}>
      <h2 id={titleId} className="pe-12 text-[clamp(28px,3.4vw,44px)] font-black uppercase leading-none tracking-[-0.03em]" data-stagger>
        {f.title}
      </h2>
      <p className="mt-3 text-sand/70" data-stagger>{f.intro}</p>

      {done ? (
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white/5 p-5" role="status">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-accent text-white">
            <Icon name="check" />
          </span>
          <div className="pt-1.5">
            <p className="font-semibold">{status === 'sent' ? f.success : status === 'error' ? f.error : f.openedWhatsapp}</p>
            {status !== 'sent' && (
              <a href={whatsappUrl(waText)} target="_blank" rel="noopener" className="btn btn-accent mt-4">
                <Icon name="whatsapp" size={17} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      ) : (
        <form className="mt-7 grid gap-3 sm:grid-cols-2" onSubmit={submit} noValidate>
          <label className="field sm:col-span-2" data-stagger>
            <span className="field-label">{f.tour}</span>
            <select name="tour" defaultValue={initialTour}>
              <option value="">{f.tourAny}</option>
              {tourSlugs.map((s) => (
                <option key={s} value={s}>{m.tours.items[s].name}</option>
              ))}
            </select>
          </label>
          <label className="field" data-stagger>
            <span className="field-label">{f.date}</span>
            <input type="date" name="date" required min={new Date().toISOString().slice(0, 10)} />
          </label>
          <label className="field" data-stagger>
            <span className="field-label">{f.groupSize}</span>
            <select name="groupSize" defaultValue="2">
              {['1', '2', '3', '4', '5', '6', '7+'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className="field sm:col-span-2" data-stagger>
            <span className="field-label">{f.language}</span>
            <select name="language" defaultValue={locale}>
              {locales.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </label>
          <label className="field" data-stagger>
            <span className="field-label">{f.name}</span>
            <input name="name" autoComplete="name" required />
          </label>
          <label className="field" data-stagger>
            <span className="field-label">{f.whatsapp}</span>
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder={f.whatsappHint} required />
          </label>
          <label className="field sm:col-span-2" data-stagger>
            <span className="field-label">{f.message}</span>
            <textarea name="message" placeholder={f.messagePlaceholder} />
          </label>
          {invalid && (
            <p className="text-sm font-semibold text-amber sm:col-span-2" role="alert">{f.required}</p>
          )}
          <button
            type="submit"
            className="btn btn-accent btn-lg mt-2 w-full text-[13px] font-black uppercase tracking-[0.18em] sm:col-span-2"
            disabled={status === 'sending'}
            data-stagger
          >
            {status === 'sending' ? f.sending : f.submit}
          </button>
        </form>
      )}
    </Modal>
  );
}
