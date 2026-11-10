/* One modal contract for every overlay (DESIGN-NOTES 5.9): Escape closes,
   scrim click closes, Tab is trapped inside, smooth scroll and body scroll
   stop, focus returns to the opener. */
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { gsap, Smooth } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { Icon } from './Icon';
import { StarPattern } from '../oman/Ornament';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function Modal({
  open,
  onClose,
  labelledBy,
  closeLabel,
  children,
  from,
  panelClassName = '',
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  children: ReactNode;
  /** Optional element to grow the panel out of (timeline cards). */
  from?: HTMLElement | null;
  panelClassName?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  useIsoLayoutEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    Smooth.stop();
    document.body.style.overflow = 'hidden';

    const p = panel.current!;
    if (!prefersReducedMotion()) {
      gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
      if (from) {
        const a = from.getBoundingClientRect();
        const b = p.getBoundingClientRect();
        gsap.fromTo(
          p,
          { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: 'top left', opacity: 0.6 },
          { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.55, ease: 'power3.inOut' },
        );
      } else {
        gsap.fromTo(p, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' });
      }
      gsap.fromTo(p.querySelectorAll('[data-stagger]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, delay: 0.15, ease: 'power2.out' });
    }
    const first = p.querySelector<HTMLElement>('input, select, textarea, button:not(.modal-close)') ?? p.querySelector<HTMLElement>('button');
    first?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...p.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => el.getClientRects().length,
      );
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      Smooth.start();
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div ref={scrim} className="modal-scrim" onClick={onClose} />
      <div ref={panel} className={`modal-panel isolate ${panelClassName}`}>
        <StarPattern tone="fine" className="modal-geo" />
        <button type="button" className="modal-close" onClick={onClose} aria-label={closeLabel}>
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
