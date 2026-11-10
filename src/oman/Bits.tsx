/* Issam's greeting bubble, cycling through the site's languages. */
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from '../motion/gsap';
import { prefersReducedMotion } from '../lib/viewport';

const greetings: [lang: string, word: string][] = [
  ['ar', 'أهلاً وسهلاً'],
  ['en', 'Welcome'],
  ['es', 'Bienvenidos'],
  ['it', 'Benvenuti'],
  ['de', 'Willkommen'],
  ['fr', 'Bienvenue'],
  ['zh', '欢迎'],
  ['pt', 'Bem-vindos'],
  ['ca', 'Benvinguts'],
  ['ru', 'Добро пожаловать'],
  ['hi', 'स्वागत है'],
  ['bal', 'وش آتکے'],
];

/** Portalled to body: the hero's flying wordmark stacks above everything inside the hero. */
export function GreetingBubble() {
  const [mounted, setMounted] = useState(false);
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion()) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && window.scrollY < 400) setI((n) => (n + 1) % greetings.length);
    }, 1800);
    const tween = gsap.to(ref.current, { autoAlpha: 0, y: -30, ease: 'none', scrollTrigger: { start: 0, end: 260, scrub: true } });
    return () => {
      window.clearInterval(timer);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [mounted]);

  if (!mounted) return null;
  const [lang, word] = greetings[i];
  return createPortal(
    <div ref={ref} className="hero-bubble" aria-hidden="true">
      <span key={word} lang={lang} className="hero-bubble-word">
        {word}
      </span>
    </div>,
    document.body,
  );
}
