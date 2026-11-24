/* Oman travel guides: long-form pages for the questions travelers search
   ("best time to visit Oman", "Oman itinerary", "things to do in Muscat").
   One file per language in ./guides/ (en.ts, de.ts, ...). A language gets a guide
   page only once it is listed in guideLangs and its file has the guide, so no
   untranslated copies are published. The build checks the two agree.
   The browser loads only the visitor's language (loadGuides); the server loads all.
   Facts: general, checkable facts about Oman, plus what Issam told us in his
   questionnaire (best months per tour, distances, what each tour includes).
   No invented personal anecdotes: his own tips can be added to `tips` later. */
import type { Locale, TourSlug } from '../config';

export const guideSlugs = ['best-time-to-visit-oman', 'oman-itinerary', 'things-to-do-in-muscat'] as const;
export type GuideSlug = (typeof guideSlugs)[number];

export type Guide = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** ISO date the content was last reviewed. */
  updated: string;
  lead: string;
  sections: { h: string; p: string[]; list?: string[] }[];
  /** Tours this guide points to, in order. */
  tours: TourSlug[];
  faq: { q: string; a: string }[];
};

/** Labels around the guide content, per locale that has guides. */
export type GuideSet = Partial<Record<GuideSlug, Guide>>;

/** Languages each guide is written in. Must match the files in ./guides/ (checked when the site is built). */
const allSix: Locale[] = ['en', 'de', 'fr', 'ru', 'es', 'it'];
export const guideLangs: Record<GuideSlug, Locale[]> = {
  'best-time-to-visit-oman': allSix,
  'oman-itinerary': allSix,
  'things-to-do-in-muscat': allSix,
};

export const guideUi: Partial<Record<Locale, { kicker: string; updated: string; toursTitle: string; faqTitle: string; footer: string; more: string; crumb: string }>> = {
  en: { kicker: 'Oman travel guide', updated: 'Updated', toursTitle: 'Tours for this', faqTitle: 'Quick answers', footer: 'Oman travel guides', more: 'More guides', crumb: 'Guides' },
  de: { kicker: 'Oman-Reiseratgeber', updated: 'Aktualisiert am', toursTitle: 'Passende Touren', faqTitle: 'Kurz beantwortet', footer: 'Oman-Reiseratgeber', more: 'Weitere Ratgeber', crumb: 'Ratgeber' },
  fr: { kicker: 'Guide de voyage Oman', updated: 'Mis à jour le', toursTitle: 'Les circuits pour cela', faqTitle: 'Réponses rapides', footer: 'Guides de voyage Oman', more: 'Autres guides', crumb: 'Guides' },
  ru: { kicker: 'Путеводитель по Оману', updated: 'Обновлено', toursTitle: 'Подходящие туры', faqTitle: 'Коротко о главном', footer: 'Путеводители по Оману', more: 'Другие статьи', crumb: 'Путеводитель' },
  es: { kicker: 'Guía de viaje de Omán', updated: 'Actualizado el', toursTitle: 'Tours para esto', faqTitle: 'Respuestas rápidas', footer: 'Guías de viaje de Omán', more: 'Más guías', crumb: 'Guías' },
  it: { kicker: 'Guida di viaggio Oman', updated: 'Aggiornato il', toursTitle: 'I tour adatti', faqTitle: 'Risposte rapide', footer: 'Guide di viaggio Oman', more: 'Altre guide', crumb: 'Guide' },
};

/** Filled per language by registerGuides: the browser loads only the visitor's
 *  language before rendering, the server build loads every file. */
export const guides: Record<GuideSlug, Partial<Record<Locale, Guide>>> = Object.fromEntries(guideSlugs.map((s) => [s, {}])) as Record<GuideSlug, Partial<Record<Locale, Guide>>>;

export function registerGuides(locale: Locale, set: GuideSet) {
  for (const slug of guideSlugs) if (set[slug]) guides[slug][locale] = set[slug];
}

const loaders = import.meta.glob<GuideSet>('./guides/*.ts', { import: 'default' });

/** Loads one language's guides (one small chunk). No-op for a language without guides. */
export async function loadGuides(locale: Locale) {
  if (!guideSlugs.some((s) => guideLangs[s].includes(locale))) return;
  const load = loaders[`./guides/${locale}.ts`];
  if (load) registerGuides(locale, await load());
}

export const hasGuide = (slug: GuideSlug, locale: Locale) => guideLangs[slug].includes(locale);
export const guideLocales = (slug: GuideSlug) => guideLangs[slug];
