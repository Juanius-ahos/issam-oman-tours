import { useEffect, useRef } from 'react';
import { config } from '../config';
import { useI18n } from '../i18n';
import { createGhost } from '../motion/ghost';
import { StarPattern } from '../oman/Ornament';
import { ScrollTrigger } from '../motion/gsap';
import { BASE } from '../routes';
import { GreetingBubble } from '../oman/Bits';
import { photoSrc, photoSrcSet } from '../data/photos';
import { SocialRow, StatCard, WaButton } from '../components/Bits';
import { Icon } from '../components/Icon';
import { Smooth } from '../motion/gsap';

export function Hero() {
  const { m } = useI18n();
  const hero = useRef<HTMLElement>(null);
  const s = config.business.stats;

  useEffect(() => {
    let cleanup = () => {};
    let timer = 0;
    const html = document.documentElement;
    // The wordmark is sized to end above the copy column. Its height depends on how
    // many lines the H1 takes in this language, so measure it rather than guess.
    const fitMark = () => {
      const left = hero.current?.querySelector<HTMLElement>('.hero-left');
      if (left) hero.current!.style.setProperty('--copy-h', `${Math.ceil(left.offsetHeight)}px`);
    };
    fitMark();
    const build = () => {
      cleanup();
      window.scrollTo(0, 0);
      fitMark();
      cleanup = createGhost(hero.current!);
      html.classList.remove('pre-ghost');
      // The hero pin is created last but sits first on the page: sections below must measure after it.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    // Fonts first: a late swap would move every measured box.
    const ready = document.fonts?.ready ?? Promise.resolve();
    Promise.race([ready, new Promise((r) => setTimeout(r, 1200))]).then(build);
    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastW) return; // ignore mobile URL bar height jitter
      lastW = window.innerWidth;
      clearTimeout(timer);
      timer = window.setTimeout(build, 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <section id="top" ref={hero} className="hero hero-layout" aria-labelledby="hero-title">
      <GreetingBubble />
      <div className="hero-stage">
        <div className="hero-geo" aria-hidden="true">
          <StarPattern tone="sand" />
        </div>
        <div className="hero-backdrop" data-hero-fade>
          <img src={photoSrc('wahiba-soft-dunes')} srcSet={photoSrcSet('wahiba-soft-dunes')} sizes="100vw" alt="" decoding="async" />
        </div>
        <span data-ghost-target="wordmark" className="wordmark hero-mark" aria-hidden="true">
          {config.brand.wordmark}
        </span>

        <img
          className="hero-portrait"
          src={`${BASE}media/issam-portrait.webp`}
          srcSet={`${BASE}media/issam-portrait-640.webp 640w, ${BASE}media/issam-portrait.webp 867w`}
          sizes="(max-width: 900px) 82vw, 60vh"
          width={867}
          height={1376}
          alt={m.hero.portraitLabel}
          decoding="async"
        />

        <div className="hero-left">
        <div className="hero-copy" data-hero-fade>
          <p className="eyebrow">{m.hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-3 text-[clamp(30px,3.2vw,52px)] font-black leading-[1.02] tracking-[var(--track-tight)] [text-wrap:balance]">
            {m.hero.title}
          </h1>
          <p className="mt-4 max-w-[46ch] text-[15px] text-ink/70">{m.hero.lead}</p>
          <p className="mt-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-accent-deep">
            <span lang="en">{config.brand.business}</span> · {m.hero.tagline}
          </p>
        </div>

        <div className="hero-socials">
          <div data-ghost-target="socials" className="hero-scale">
            <SocialRow />
          </div>
        </div>
        </div>

        <div className="hero-side">
        <div className="hero-stats">
          <div data-ghost-target="stat-a" className="hero-scale">
            <StatCard value={s.languages} label={m.counters.languages} icon="translate" />
          </div>
          <div data-ghost-target="stat-b" className="hero-scale">
            <StatCard value={s.travelersHosted} suffix="+" label={m.counters.travelers} icon="users" />
          </div>
        </div>

        <ul className="hero-traits glass-ink" data-hero-fade>
          {m.hero.traits.map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <Icon name="check" size={16} className="flex-none text-accent-light" />
              {t}
            </li>
          ))}
        </ul>
        </div>

        <div className="hero-ctas">
          <div data-ghost-target="cta" className="hero-scale">
            <WaButton location="hero" />
          </div>
          <a
            href="#tours"
            data-hero-fade
            className="btn btn-white roll-host hero-tours-btn"
            onClick={(e) => {
              e.preventDefault();
              Smooth.scrollTo('#tours');
            }}
          >
            {m.hero.ctaTours}
          </a>
        </div>
      </div>
    </section>
  );
}
