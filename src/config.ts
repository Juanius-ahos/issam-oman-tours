/* ══════════════════════════════════════════════════════════════════════
   SITE CONFIG. The one place to change contact details, socials, analytics
   and the locale list. Copy lives in src/locales/*.json, not here.

   Values marked TODO are placeholders for Issam to replace before launch.
   ══════════════════════════════════════════════════════════════════════ */

const env = import.meta.env;

export const config = {
  /** Public origin, no trailing slash. Drives canonical, hreflang, sitemap and JSON-LD. */
  siteUrl: (env.VITE_SITE_URL as string | undefined) || 'https://www.example-oman-tours.com', // TODO: real domain

  brand: {
    person: 'Issam Baloushi',
    nickname: 'The Languages Ninja',
    wordmark: 'ISSAM',
  },

  whatsapp: {
    /** International format, digits only, no + or spaces. */
    number: '96800000000', // TODO: Issam's WhatsApp number
    display: '+968 0000 0000', // TODO
  },

  email: 'hello@example-oman-tours.com', // TODO

  socials: {
    instagram: { url: 'https://www.instagram.com/TODO', handle: '@TODO' },
    tiktok: { url: 'https://www.tiktok.com/@TODO', handle: '@TODO' },
    youtube: { url: 'https://www.youtube.com/@TODO', handle: '@TODO' },
    facebook: { url: 'https://www.facebook.com/TODO', handle: '/TODO' },
  },

  /** Google Business Profile URL, added to LocalBusiness sameAs once it exists. */
  googleBusinessProfile: '', // TODO

  analytics: {
    /** GA4 measurement ID from .env.local (VITE_GA_ID). Empty disables GA entirely. */
    gaId: (env.VITE_GA_ID as string | undefined) || '',
  },

  form: {
    /** Optional POST endpoint (for example Formspree). Empty sends the request to WhatsApp instead. */
    endpoint: (env.VITE_FORM_ENDPOINT as string | undefined) || '',
  },

  business: {
    city: 'Muscat',
    region: 'Muscat Governorate',
    country: 'OM',
    /** Approximate centre of Muscat. TODO: exact pickup base if Issam wants it public. */
    geo: { lat: 23.588, lng: 58.3829 },
    priceRange: '$$',
    /** Headline figures for the counters. TODO: real numbers. */
    stats: { languages: 12, yearsGuiding: 10, travelersHosted: 3000, countries: 60 },
  },

  seo: {
    /**
     * Locales still marked "_status": "todo" are English placeholders. Publishing 12 copies of the
     * English page invites duplicate-content problems, so by default they are served with
     * noindex and left out of hreflang and the sitemap. Flip to true only for a staging preview.
     * A locale joins the sitemap and hreflang automatically once its JSON is translated.
     */
    indexTodoLocales: false,
  },
} as const;

/** The 13 site locales. Arabic is the only RTL one. Order is the switcher order. */
export const locales = [
  { code: 'en', english: 'English', name: 'English', dir: 'ltr', hreflang: 'en' },
  { code: 'ar', english: 'Arabic', name: 'العربية', dir: 'rtl', hreflang: 'ar' },
  { code: 'es', english: 'Spanish', name: 'Español', dir: 'ltr', hreflang: 'es' },
  { code: 'it', english: 'Italian', name: 'Italiano', dir: 'ltr', hreflang: 'it' },
  { code: 'de', english: 'German', name: 'Deutsch', dir: 'ltr', hreflang: 'de' },
  { code: 'fr', english: 'French', name: 'Français', dir: 'ltr', hreflang: 'fr' },
  { code: 'zh', english: 'Chinese', name: '中文', dir: 'ltr', hreflang: 'zh-Hans' },
  { code: 'pt', english: 'Portuguese', name: 'Português', dir: 'ltr', hreflang: 'pt' },
  { code: 'ca', english: 'Catalan', name: 'Català', dir: 'ltr', hreflang: 'ca' },
  { code: 'ru', english: 'Russian', name: 'Русский', dir: 'ltr', hreflang: 'ru' },
  { code: 'ko', english: 'Korean', name: '한국어', dir: 'ltr', hreflang: 'ko' },
  { code: 'ja', english: 'Japanese', name: '日本語', dir: 'ltr', hreflang: 'ja' },
  { code: 'hi', english: 'Hindi', name: 'हिन्दी', dir: 'ltr', hreflang: 'hi' },
] as const;

export type Locale = (typeof locales)[number]['code'];
export const defaultLocale: Locale = 'en';

/** Tour slugs in display order. Content for each lives under "tours" in the locale JSON. */
export const tourSlugs = ['muscat-city', 'nizwa-mountains', 'wahiba-desert', 'wadi-shab-coast'] as const;
export type TourSlug = (typeof tourSlugs)[number];

export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${config.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
