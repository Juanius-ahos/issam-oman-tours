import { createContext, useContext } from 'react';
import type en from './locales/en.json';
import { locales, defaultLocale, type Locale } from './config';

export type Messages = typeof en;

// One chunk per locale, so a visitor only downloads their own language.
const loaders = import.meta.glob<Messages>('./locales/*.json', { import: 'default' });

export async function loadMessages(locale: Locale): Promise<Messages> {
  const load = loaders[`./locales/${locale}.json`] ?? loaders[`./locales/${defaultLocale}.json`];
  return load();
}

export function isLocale(value: string | undefined): value is Locale {
  return !!value && locales.some((l) => l.code === value);
}

export function localeInfo(locale: Locale) {
  return locales.find((l) => l.code === locale)!;
}

export function isTranslated(messages: Messages) {
  return messages._status !== 'todo';
}

type I18n = { locale: Locale; m: Messages; dir: 'ltr' | 'rtl' };
export const I18nContext = createContext<I18n | null>(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n outside I18nContext');
  return ctx;
}
