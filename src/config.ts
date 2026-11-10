/* ══════════════════════════════════════════════════════════════════════
   SITE CONFIG. The one place to change contact details, socials, analytics
   and the locale list. Copy lives in src/locales/*.json, not here.

   Values marked TODO are placeholders for Issam to replace before launch.
   ══════════════════════════════════════════════════════════════════════ */

const env = import.meta.env;

export const config = {
  /** Public origin, no trailing slash. Drives canonical, hreflang, sitemap and JSON-LD. */
  siteUrl: (env.VITE_SITE_URL as string | undefined) || 'https://omanwithissam.com',

  /* Contact, socials, numbers and prices below come from Issam's questionnaire
     (docs/issam-answers-2026-11.md). */
  brand: {
    person: 'Issam Albalushi',
    nickname: 'The Languages Ninja',
    wordmark: 'ISSAM',
    /** Trading name, used as the business name in structured data. */
    business: 'Oman with Issam',
  },

  whatsapp: {
    /** International format, digits only, no + or spaces. */
    number: '96872738685',
    display: '+968 7273 8685',
  },

  email: 'Languagesninja@gmail.com',

  /** Leave a url empty to hide that network everywhere (Issam has no Facebook page). */
  socials: {
    instagram: { url: 'https://www.instagram.com/languages_ninja', handle: '@languages_ninja' },
    tiktok: { url: 'https://www.tiktok.com/@languagesninja', handle: '@languagesninja' },
    youtube: { url: 'https://www.youtube.com/@Languagesninja', handle: '@Languagesninja' },
    facebook: { url: '', handle: '' },
  },

  /** Languages Issam guides in, as English names (FAQ, llms.txt, structured data).
   *  TODO: Issam named these 11 but says 12; confirm the 12th. */
  guideLanguages: [
    { name: 'Arabic', code: 'ar' },
    { name: 'English', code: 'en' },
    { name: 'German', code: 'de' },
    { name: 'Russian', code: 'ru' },
    { name: 'Spanish', code: 'es' },
    { name: 'Italian', code: 'it' },
    { name: 'French', code: 'fr' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Catalan', code: 'ca' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Hindi', code: 'hi' },
  ],

  pricing: {
    /** Issam wants a starting price only; the rest is quoted on WhatsApp. */
    from: 200,
    currency: 'USD',
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
    /** Approximate centre of Muscat. Issam picks up anywhere. */
    geo: { lat: 23.588, lng: 58.3829 },
    priceRange: 'From USD 200',
    /** Headline figures for the counters. Guiding since 2016; about 15,000 travelers; "more than 15" countries. */
    startedGuiding: 2016,
    stats: { languages: 12, yearsGuiding: new Date().getFullYear() - 2016, travelersHosted: 15000, countries: 15 },
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
