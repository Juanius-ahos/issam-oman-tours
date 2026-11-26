import { useEffect } from 'react';
import { I18nContext, localeInfo, type Messages } from './i18n';
import type { Route } from './routes';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Counters } from './sections/Counters';
import { Press } from './sections/Press';
import { OmanDay } from './sections/OmanDay';
import { QuoteBand } from './sections/QuoteBand';
import { initTitleReveals, initPatternMotion } from './motion/reveals';
import { isMobile } from './lib/viewport';
import { Story } from './sections/Story';
import { Tours } from './sections/Tours';
import { Extras } from './sections/Extras';
import { Follow } from './sections/Follow';
import { Reviews } from './sections/Reviews';
import { Gallery } from './sections/Gallery';
import { Faq } from './sections/Faq';
import { Guides } from './sections/Guides';
import { Plan } from './sections/Plan';
import { Also } from './sections/Also';
import { TourPage } from './pages/TourPage';
import { ToursPage } from './pages/ToursPage';
import { GuidePage } from './pages/GuidePage';

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
        <Extras />
        <Follow />
        <Reviews />
        <Gallery />
        <Faq />
        <Guides />
        <Plan />
        <Also />
      </div>
    </>
  );
}

export function App({ route, messages }: { route: Route; messages: Messages }) {
  const dir = localeInfo(route.locale).dir;
  // Decorative only, so phones skip them: splitting every heading into words and
  // moving the star lattices cost seconds of main-thread work on a mid-range phone.
  useEffect(() => (isMobile() ? undefined : initTitleReveals()), []);
  useEffect(() => (isMobile() ? undefined : initPatternMotion()), []);
  return (
    <I18nContext.Provider value={{ locale: route.locale, m: messages, dir }}>
      <Layout route={route}>{route.page === 'home' ? <HomePage /> : route.page === 'tours' ? <ToursPage /> : route.page === 'guide' ? <GuidePage slug={route.slug} /> : <TourPage slug={route.slug} />}</Layout>
    </I18nContext.Provider>
  );
}
