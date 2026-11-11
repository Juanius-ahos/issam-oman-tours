/* Counters with an odometer roll. The static HTML holds the real numbers
   (merheb ships "0" until JS runs); the client only adds the roll on top. */
import { useEffect, useRef } from 'react';
import { config } from '../config';
import { StarPattern } from '../oman/Ornament';
import { useI18n } from '../i18n';
import { gsap, ScrollTrigger } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';

function Odometer({ value, suffix = '' }: { value: number; suffix?: string }) {
  const text = value.toLocaleString('en-US') + suffix;
  // Screen readers and crawlers get the plain number; the rolling digits are visual only.
  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="odo" dir="ltr" aria-hidden="true">
        {value
          .toLocaleString('en-US')
          .split('')
          .map((ch, i) => (
            <span key={i} className="odo-digit" data-d={/\d/.test(ch) ? ch : undefined}>
              {ch}
            </span>
          ))}
        {suffix && <span>{suffix}</span>}
      </span>
    </>
  );
}

export function Counters() {
  const { m } = useI18n();
  const root = useRef<HTMLElement>(null);
  const s = config.business.stats;
  const items = [
    { value: s.languages, label: m.counters.languages },
    { value: s.yearsGuiding, suffix: '+', label: m.counters.years },
    { value: s.travelersHosted, suffix: '+', label: m.counters.travelers },
    { value: s.countries, suffix: '+', label: m.counters.countries },
  ];

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cols: HTMLElement[] = [];
      root.current!.querySelectorAll<HTMLElement>('.odo-digit[data-d]').forEach((cell) => {
        const d = Number(cell.dataset.d);
        const col = document.createElement('span');
        col.className = 'odo-col';
        // Two full sets so every digit travels at least one full turn.
        for (let n = 0; n < 20; n++) {
          const span = document.createElement('span');
          span.textContent = String(n % 10);
          col.appendChild(span);
        }
        cell.dataset.target = String(10 + d);
        cell.textContent = '';
        cell.appendChild(col);
        cols.push(col);
      });
      gsap.set(cols, { yPercent: 0 });
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          cols.forEach((col, i) => {
            const target = Number((col.parentElement as HTMLElement).dataset.target);
            gsap.to(col, { yPercent: -(target / 20) * 100, duration: 1.6, delay: i * 0.06, ease: 'power4.out' });
          });
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative isolate overflow-hidden border-y border-ink/10 px-[var(--gutter)] py-[clamp(60px,9vh,110px)]" aria-label={m.counters.eyebrow}>
      <StarPattern tone="sand" className="edge-geo" />
      <p className="eyebrow mb-8">{m.counters.eyebrow}</p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[repeat(4,auto)] lg:justify-between lg:gap-x-10">
        {items.map((it) => (
          <div key={it.label} className="grid gap-2">
            <dt className="order-2 text-[11px] font-extrabold uppercase tracking-[0.17em] text-ink/75 [text-transform:var(--upper)]">{it.label}</dt>
            <dd className="order-1 text-[clamp(44px,4.4vw,84px)] font-black whitespace-nowrap leading-[0.9] tracking-[-0.055em] text-accent-deep">
              <Odometer value={it.value} suffix={it.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
