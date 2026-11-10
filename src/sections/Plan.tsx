/* "Plan your tour": plays as a chat. Avatar pops, typing dots, the message
   pops from its tail corner, then the two replies (DESIGN-NOTES 11, item 7). */
import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';
import { useRequest } from '../components/TourRequest';
import { WaLink, RollText, Avatar } from '../components/Bits';
import { Icon } from '../components/Icon';
import { StarPattern } from '../oman/Ornament';

export function Plan() {
  const { m, dir } = useI18n();
  const { openRequest } = useRequest();
  const chat = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = chat.current!;
    const typing = root.querySelector('.chat-typing');
    if (prefersReducedMotion()) {
      typing?.remove();
      return;
    }
    const corner = dir === 'rtl' ? 'right bottom' : 'left bottom';
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 82%' } });
      tl.fromTo('.chat-avatar', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 0)
        .fromTo(typing, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)', transformOrigin: corner }, 0.2)
        .to(typing, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in', display: 'none' }, 0.95)
        .fromTo('.chat-bubble', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', transformOrigin: corner }, 1.2)
        .fromTo('.chat-actions > *', { y: 14, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.08 }, 1.45);
    }, root);
    return () => ctx.revert();
  }, [dir]);

  return (
    <section id="plan" className="section isolate overflow-hidden">
      <StarPattern tone="sand" className="plan-geo" />
      <p className="eyebrow">{m.plan.eyebrow}</p>
      <h2 className="mt-4 max-w-[14ch] text-[clamp(42px,7.4vw,110px)] font-black leading-[0.95] tracking-[-0.05em] [text-wrap:balance]">{m.plan.title}</h2>
      <p className="label-xs mt-5 text-ink/70">{m.plan.note}</p>

      <div ref={chat} className="mt-10 flex items-end gap-3">
        <Avatar className="chat-avatar h-14 w-14" label={m.plan.avatarLabel} />
        <div className="grid gap-3">
          <div className="chat-typing" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="chat-bubble w-fit">{m.plan.bubble}</p>
          <div className="chat-actions flex flex-wrap gap-2.5">
            <button type="button" className="btn btn-accent btn-lg roll-host" onClick={() => openRequest()}>
              <Icon name="send" size={17} />
              <RollText>{m.plan.ctaRequest}</RollText>
            </button>
            <WaLink location="plan" className="btn btn-outline btn-lg roll-host">
              <Icon name="whatsapp" size={18} />
              <RollText>{m.plan.ctaWhatsapp}</RollText>
            </WaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
