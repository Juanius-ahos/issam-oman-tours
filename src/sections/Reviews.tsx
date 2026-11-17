/* Traveler reviews: a clean grid of light cards next to the Tripadvisor rating.
   Each card leads with the review in the reader's own language; the guest's
   original words sit behind a small "Reviewed in ..." toggle. Phones: a swipe strip.
   The reviews are real, published with the guests' permission (docs/issam-answers-2026-11.md). */
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { StarDivider, StarPattern } from '../oman/Ornament';
import { Icon } from '../components/Icon';
import { config } from '../config';

export function Reviews() {
  const { m, locale } = useI18n();
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('.review', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: list.current, start: 'top 85%', once: true },
        clearProps: 'transform,opacity',
      });
    }, list);
    return () => ctx.revert();
  }, []);

  const count = m.reviews.taCount.replace('{count}', String(config.tripadvisorRating.count));

  return (
    <section id="reviews" className="section isolate overflow-hidden">
      <StarPattern tone="sand" className="edge-geo edge-geo-top" />
      <div className="reviews-head">
        <header className="section-head !mb-0">
          <p className="eyebrow">{m.reviews.eyebrow}</p>
          <StarDivider />
          <h2 className="section-title">{m.reviews.title}</h2>
          <p className="section-lead">{m.reviews.note}</p>
        </header>
        <a href={config.tripadvisor} target="_blank" rel="noopener" className="rating-panel">
          <span className="rating-score">{config.tripadvisorRating.score}</span>
          <span className="rating-stars" aria-hidden="true">★★★★★</span>
          <span className="rating-count">{count}</span>
          <span className="rating-link">
            {m.reviews.tripadvisor}
            <Icon name="arrow" size={13} />
          </span>
        </a>
      </div>

      <ul ref={list} className="reviews-grid">
        {m.reviews.items.map((r, i) => {
          const own = r.lang === locale;
          return (
            <li key={i} className="review">
              <figure className="flex h-full flex-col">
                <span className="review-mark" aria-hidden="true">“</span>
                <blockquote lang={own ? r.lang : locale} className="review-text">
                  {own ? r.quote : r.translation}
                </blockquote>
                {!own && (
                  <details className="review-original">
                    <summary>{r.meta}</summary>
                    <p lang={r.lang}>“{r.quote}”</p>
                  </details>
                )}
                <figcaption className="review-by">
                  <span className="review-avatar" aria-hidden="true">{[...r.name][0]}</span>
                  <span>
                    <strong>{r.name}</strong>
                    {own && <span className="label-xs block text-ink/55">{r.meta}</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
