/* GA4, loaded after the page is interactive so it never competes with the
   first paint. Conversion events:
     whatsapp_click       any link to wa.me (location says which button)
     tour_request_submit  the tour request form was sent
   Mark both as conversions (key events) in GA4 > Admin > Events. */
import { config } from '../config';

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let started = false;

export function initAnalytics() {
  const id = config.analytics.gaId;
  if (!id || started || typeof window === 'undefined') return;
  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });

  const load = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  };
  // Idle or first interaction, whichever comes first.
  const events = ['pointerdown', 'keydown', 'scroll'];
  const once = () => {
    events.forEach((e) => window.removeEventListener(e, once));
    load();
  };
  events.forEach((e) => window.addEventListener(e, once, { once: true, passive: true }));
  if ('requestIdleCallback' in window) (window as Window).requestIdleCallback(once, { timeout: 4000 });
  else setTimeout(once, 3000);
}

export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', event, params);
}

export function trackWhatsApp(location: string) {
  track('whatsapp_click', { location });
}

export function trackFormSubmit(params: { tour: string; language: string; method: 'endpoint' | 'whatsapp' }) {
  track('tour_request_submit', params);
}
