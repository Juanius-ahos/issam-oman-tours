/* Story timeline. A dot sits at each card's outer top corner; a bowed SVG
   line runs through the dots behind the cards and draws itself with the
   scroll, lighting each dot as it arrives. "Read more" grows the card into
   a dark full-story panel (DESIGN-NOTES 5.4). */
import { useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { gsap, ScrollTrigger } from '../motion/gsap';
import { isMobile, prefersReducedMotion } from '../lib/viewport';
import { Modal } from '../components/Modal';

export function Story() {
  const { m, dir } = useI18n();
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [d, setD] = useState('');
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [fromEl, setFromEl] = useState<HTMLElement | null>(null);
  const titleId = useId();
  const cards = m.story.cards;

  // Build the connector from live card rects; rebuild on resize.
  useEffect(() => {
    const build = () => {
      const w = wrap.current;
      if (!w || isMobile()) {
        setD('');
        setDots([]);
        return;
      }
      const box = w.getBoundingClientRect();
      const pts = [...w.querySelectorAll<HTMLElement>('.tl-card')].map((c, i) => {
        const r = c.getBoundingClientRect();
        const end = i % 2 === 0;
        // Outer top corner: the side facing away from the column centre.
        const physicalRight = dir === 'rtl' ? !end : end;
        return { x: (physicalRight ? r.right + 26 : r.left - 26) - box.left, y: r.top - box.top + 34 };
      });
      let p = `M ${pts[0].x} ${pts[0].y - 60}`;
      p += ` L ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const midY = (a.y + b.y) / 2;
        p += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
      }
      const last = pts[pts.length - 1];
      p += ` L ${last.x} ${last.y + 160}`;
      setD(p);
      setDots(pts);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap.current!);
    return () => ro.disconnect();
  }, [dir]);

  // Draw the line with the scroll and light dots as it passes them.
  useEffect(() => {
    const el = path.current;
    if (!el || !d) return;
    const len = el.getTotalLength();
    const dotEls = [...wrap.current!.querySelectorAll<HTMLElement>('.tl-dot')];
    if (prefersReducedMotion()) {
      el.style.strokeDasharray = 'none';
      dotEls.forEach((dot) => dot.classList.add('is-lit'));
      return;
    }
    // Path length at each dot, found by sampling.
    const marks = dots.map((pt) => {
      let best = 0;
      let bestD = Infinity;
      for (let s = 0; s <= len; s += 8) {
        const q = el.getPointAtLength(s);
        const dd = (q.x - pt.x) ** 2 + (q.y - pt.y) ** 2;
        if (dd < bestD) {
          bestD = dd;
          best = s;
        }
      }
      return best / len;
    });
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.8,
            onUpdate: (st) => dotEls.forEach((dot, i) => dot.classList.toggle('is-lit', st.progress >= marks[i] - 0.01)),
          },
        },
      );
      gsap.utils.toArray<HTMLElement>('.tl-card', wrap.current).forEach((card) => {
        gsap.from(card, { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [d, dots]);

  const open = openIdx === null ? null : cards[openIdx];

  return (
    <section id="story" ref={root} className="section">
      <header className="section-head">
        <p className="eyebrow">{m.story.eyebrow}</p>
        <h2 className="section-title">{m.story.title}</h2>
        <p className="section-lead">{m.story.lead}</p>
      </header>

      <div ref={wrap} className="relative">
        {d && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="tl-fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgb(27 26 24)" stopOpacity="0" />
                <stop offset=".08" stopColor="rgb(27 26 24)" stopOpacity=".6" />
                <stop offset=".9" stopColor="rgb(27 26 24)" stopOpacity=".6" />
                <stop offset="1" stopColor="rgb(27 26 24)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path ref={path} d={d} fill="none" stroke="url(#tl-fade)" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
        {dots.map((pt, i) => (
          <span key={i} className="tl-dot" style={{ left: pt.x, top: pt.y }} aria-hidden="true" />
        ))}

        <ol className="relative">
          {cards.map((c, i) => (
            <li key={c.year} className={`tl-card glass-light ${i % 2 === 0 ? 'is-end' : ''}`}>
              <p className="tl-year">
                <span aria-hidden="true">’{c.year.slice(2)}</span>
                <span className="sr-only">{c.year}</span>
              </p>
              <h3 className="mt-3 text-[clamp(20px,1.9vw,26px)] font-extrabold tracking-[-0.02em]">{c.title}</h3>
              <p className="mt-2 text-[clamp(14px,1.15vw,16px)] text-ink/70">{c.blurb}</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-[13px] text-ink/72">
                  <span className="ph h-9 w-9 rounded-full" aria-hidden="true" />
                  @TODO
                </span>
                <button
                  type="button"
                  className="btn btn-outline min-h-[38px] px-4 text-[13px]"
                  onClick={(e) => {
                    setFromEl((e.currentTarget as HTMLElement).closest<HTMLElement>('.tl-card'));
                    setOpenIdx(i);
                  }}
                >
                  {m.story.readMore}
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Modal open={!!open} onClose={() => setOpenIdx(null)} labelledBy={titleId} closeLabel={m.story.close} from={fromEl}>
        {open && (
          <>
            <p className="text-[clamp(64px,8vw,120px)] font-black leading-none tracking-[-0.02em] text-accent-light" data-stagger>{open.year}</p>
            <h3 id={titleId} className="mt-3 text-[clamp(24px,2.6vw,38px)] font-extrabold tracking-[-0.02em]" data-stagger>{open.title}</h3>
            <p className="mt-4 text-[clamp(15px,1.3vw,18px)] text-sand/80" data-stagger>{open.full}</p>
            <p className="mt-6 text-[17px] font-bold italic text-accent-light" data-stagger>“{open.quote}”</p>
          </>
        )}
      </Modal>
    </section>
  );
}
