import { useEffect } from 'react';
import { I18nContext, localeInfo, type Messages } from './i18n';
import type { Route } from './routes';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Counters } from './sections/Counters';
import { Press } from './sections/Press';
import { OmanDay } from './sections/OmanDay';
import { QuoteBand } from './sections/QuoteBand';
import { initTitleReveals } from './motion/reveals';
import { Story } from './sections/Story';
import { Tours } from './sections/Tours';
import { Follow } from './sections/Follow';
import { Reviews } from './sections/Reviews';
import { Gallery } from './sections/Gallery';
import { Faq } from './sections/Faq';
import { Plan } from './sections/Plan';
import { Also } from './sections/Also';
import { TourPage } from './pages/TourPage';

function HomePage() {
  return (
    <>
      <Hero />
      <div className="desk:ps-[var(--nav-w)]">
        <Counters />
        <Press />
        <QuoteBand />
        <OmanDay />
        <Story />
        <Tours />
        <Follow />
        <Reviews />
        <Gallery />
        <Faq />
        <Plan />
        <Also />
      </div>
    </>
  );
}

export function App({ route, messages }: { route: Route; messages: Messages }) {
  const dir = localeInfo(route.locale).dir;
  useEffect(() => initTitleReveals(), []);
  return (
    <I18nContext.Provider value={{ locale: route.locale, m: messages, dir }}>
      <Layout route={route}>{route.page === 'home' ? <HomePage /> : <TourPage slug={route.slug} />}</Layout>
    </I18nContext.Provider>
  );
}
