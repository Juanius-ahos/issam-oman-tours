/* FAQ on native <details> (works without JS, indexable). GSAP animates both
   directions: open sets [open] first then grows; close shrinks first and
   removes [open] after, so closing is as smooth as opening. The same Q&A
   feeds the FAQPage JSON-LD. */
import type { MouseEvent } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { Icon } from '../components/Icon';
import { StarDivider } from '../oman/Ornament';

function toggle(e: MouseEvent<HTMLElement>) {
  if (prefersReducedMotion()) return;
  e.preventDefault();
  const item = e.currentTarget.parentElement as HTMLDetailsElement;
  const body = item.querySelector<HTMLElement>('.faq-a')!;
  gsap.killTweensOf(body);
  if (!item.open) {
    item.open = true;
    gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.45, ease: 'power3.out' });
  } else {
    gsap.to(body, {
      height: 0,
      opacity: 0,
      duration: 0.38,
      ease: 'power3.inOut',
      onComplete: () => {
        item.open = false;
        gsap.set(body, { clearProps: 'height,opacity' });
      },
    });
  }
}

export function Faq() {
  const { m } = useI18n();
  const items = m.faq.items;
  const half = Math.ceil(items.length / 2);
  return (
    <section id="faq" className="section isolate overflow-clip">
      <header className="section-head">
        <p className="eyebrow">{m.faq.eyebrow}</p>
        <StarDivider />
        <h2 className="section-title">{m.faq.title}</h2>
      </header>
      <div className="grid max-w-[1240px] items-start gap-x-[clamp(32px,4.5vw,72px)] md:grid-cols-2">
        {[items.slice(0, half), items.slice(half)].map((col, c) => (
          <div key={c} className="border-t border-ink/15">
            {col.map((f) => (
              <details key={f.q} className="faq-item">
                <summary className="faq-q" onClick={toggle}>
                  <span>{f.q}</span>
                  <span className="faq-mark" aria-hidden="true">
                    <Icon name="plus" size={16} />
                  </span>
                </summary>
                <div className="faq-a">
                  <div>{f.a}</div>
                </div>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
