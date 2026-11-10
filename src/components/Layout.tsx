/* Page chrome: sidebar (desktop) that doubles as the menu sheet (mobile),
   the mobile top bar, a floating WhatsApp button and the footer. */
import { useEffect, useState, type ReactNode } from 'react';
import { config, whatsappUrl } from '../config';
import { useI18n } from '../i18n';
import { BASE, homePath, type Route } from '../routes';
import { Smooth } from '../motion/gsap';
import { Icon, type IconName } from './Icon';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RollText, SocialRow, StatCard, WaButton, WaLink } from './Bits';
import { RequestProvider } from './TourRequest';
import { photos } from '../data/photos';
import { StarPattern } from '../oman/Ornament';

export const sectionIds = ['top', 'story', 'tours', 'follow', 'reviews', 'faq', 'plan'] as const;
type SectionId = (typeof sectionIds)[number];

const navIcons: Record<SectionId, IconName> = {
  top: 'home',
  story: 'story',
  tours: 'map',
  follow: 'instagram',
  reviews: 'star',
  faq: 'help',
  plan: 'send',
};

function useNavSpy(enabled: boolean) {
  const [current, setCurrent] = useState<SectionId>('top');
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let active: SectionId = 'top';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = id;
      }
      setCurrent(active);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [enabled]);
  return current;
}

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { m, locale } = useI18n();
  const isHome = route.page === 'home';
  const current = useNavSpy(isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  // Tour pages have no hero to collapse: the sidebar is simply there.
  useEffect(() => {
    if (isHome) return;
    document.documentElement.classList.add('no-ghost', 'is-collapsed');
  }, [isHome]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen);
    if (menuOpen) Smooth.stop();
    else Smooth.start();
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navLabels: Record<SectionId, string> = {
    top: m.nav.home,
    story: m.nav.story,
    tours: m.nav.tours,
    follow: m.nav.follow,
    reviews: m.nav.reviews,
    faq: m.nav.faq,
    plan: m.nav.plan,
  };
  const href = (id: SectionId) => (isHome ? `#${id}` : `${homePath(locale)}#${id}`);
  const onNav = (id: SectionId) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (!isHome) return;
    e.preventDefault();
    Smooth.scrollTo(id === 'top' ? 0 : `#${id}`);
    history.replaceState(null, '', `#${id}`);
  };

  const s = config.business.stats;

  return (
    <RequestProvider>
      <a href="#main" className="sr-only z-[200] rounded-lg bg-ink px-4 py-2 text-sand focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {m.nav.skip}
      </a>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-[80] flex h-[68px] items-center justify-between border-b border-ink/10 bg-sand/90 px-5 backdrop-blur-md desk:hidden">
        <a href={homePath(locale)} className="wordmark rounded-[10px] bg-accent px-3 py-2 text-[22px] text-white" aria-label={config.brand.person}>
          {config.brand.wordmark}
        </a>
        <div className="flex items-center gap-2">
          <LanguageSwitcher route={route} variant="dark" />
          <button
            type="button"
            className={`grid h-12 w-12 place-items-center rounded-xl transition-colors ${menuOpen ? 'bg-accent text-white' : 'bg-ink text-sand'}`}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? m.nav.close : m.nav.menu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </header>

      {/* Sidebar / menu sheet */}
      <aside id="site-nav" className="side" aria-label={m.nav.menu}>
        <div className="side-panel text-white">
          <div className="side-panel-bg glass-ink" />
          <div className="flex items-start justify-between gap-2">
            <a href={homePath(locale)} className="relative isolate inline-flex rounded-[10px] px-2.5 py-1.5" aria-label={config.brand.person}>
              <span className="side-panel-bg rounded-[10px] bg-accent" />
              <span data-ghost="wordmark" data-ghost-type="text" className="wordmark block text-[30px] text-white">
                {config.brand.wordmark}
              </span>
            </a>
            <div className="side-lang">
              <LanguageSwitcher route={route} />
            </div>
          </div>
          <div className="mt-3" data-ghost="socials">
            <SocialRow />
          </div>
        </div>

        <div className="side-panel side-tagline text-[12.5px] font-medium leading-snug text-white">
          <div className="side-panel-bg glass-ink" />
          <strong className="block text-[13px] font-extrabold">{config.brand.nickname}</strong>
          {m.hero.eyebrow}. {m.counters.languages}: {s.languages}.
        </div>

        <div className="side-stats flex gap-2">
          <div data-ghost="stat-a">
            <StatCard value={s.languages} label={m.counters.languages} icon="translate" />
          </div>
          <div data-ghost="stat-b">
            <StatCard value={s.travelersHosted} suffix="+" label={m.counters.travelers} icon="users" />
          </div>
        </div>

        <nav className="side-panel side-nav">
          <div className="side-panel-bg glass-ink" />
          <ul className="grid gap-1.5">
            {sectionIds.map((id) => (
              <li key={id}>
                <a href={href(id)} onClick={onNav(id)} aria-current={isHome && current === id ? 'true' : undefined} className="roll-host">
                  <Icon name={navIcons[id]} className="side-icon" />
                  <RollText>{navLabels[id]}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={whatsappUrl()}
          className="side-panel side-press flex items-center justify-between gap-2 text-[13px] font-semibold text-white"
          target="_blank"
          rel="noopener"
        >
          <div className="side-panel-bg glass-ink" />
          <span className="flex items-center gap-2">
            <Icon name="whatsapp" size={15} className="text-accent-light" />
            {config.whatsapp.display}
          </span>
          <Icon name="arrow" size={14} className="opacity-60" />
        </a>

        <div className="mt-auto" data-ghost="cta">
          <WaButton location="sidebar" />
        </div>
      </aside>

      <div className="bg-figure" aria-hidden="true">
        <img src={`${BASE}media/issam-portrait.webp`} width={867} height={1376} alt="" loading="lazy" decoding="async" />
      </div>

      {/* The home hero spans the full width; everything else sits beside the sidebar (.content). */}
      <main id="main">{children}</main>

      <div className="frieze desk:ms-[var(--nav-w)]" aria-hidden="true">
        <StarPattern tone="frieze" />
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-[var(--gutter)] py-6 text-[11px] font-bold text-ink/70 desk:ms-[var(--nav-w)]">
        <span>
          © {new Date().getFullYear()} {config.brand.person}. {m.footer.rights} {m.footer.madeIn}
        </span>
        <a href="#top" onClick={onNav('top')} className="hover:text-ink">{m.nav.backToTop}</a>
        <details className="w-full font-medium">
          <summary className="cursor-pointer font-bold hover:text-ink">{m.footer.photoCredits}</summary>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {photos.map((p) => (
              <li key={p.slug}>
                <a href={p.source} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">{p.name}</a>, {p.author},{' '}
                <a href={p.licenseUrl} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">{p.license}</a>. {m.footer.photoEdited}
              </li>
            ))}
          </ul>
        </details>
      </footer>

      {/* Floating WhatsApp, mobile only: always one tap away */}
      <WaLink
        location="float"
        className="fixed bottom-4 end-4 z-[75] grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_10px_30px_rgb(27_26_24/.3)] desk:hidden"
        aria-label={m.hero.ctaWhatsapp}
      >
        <Icon name="whatsapp" size={26} />
      </WaLink>
    </RequestProvider>
  );
}

export { WaButton };
