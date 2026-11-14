/* One place that registers GSAP plugins and owns Lenis, so every component
   shares the same ticker and ScrollTrigger sees the smoothed scroll. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { isMobile, prefersReducedMotion, isBrowser } from '../lib/viewport';

if (isBrowser) {
  gsap.registerPlugin(ScrollTrigger);
  if (import.meta.env.DEV || new URLSearchParams(location.search).has('debug')) Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger };

type VelocityListener = (v: number) => void;
const velocityListeners = new Set<VelocityListener>();

export const Smooth = {
  lenis: null as Lenis | null,

  init() {
    // Native scroll on touch screens and for reduced motion: Lenis only helps wheels.
    if (this.lenis || prefersReducedMotion() || isMobile()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', (e: Lenis) => {
      ScrollTrigger.update();
      velocityListeners.forEach((fn) => fn(e.velocity));
    });
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    this.lenis = lenis;
  },
  stop() {
    this.lenis?.stop();
  },
  start() {
    this.lenis?.start();
  },
  scrollTo(target: number | string | HTMLElement) {
    if (this.lenis) this.lenis.scrollTo(target as never, { offset: 0 });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  },
  onVelocity(fn: VelocityListener) {
    velocityListeners.add(fn);
    return () => velocityListeners.delete(fn);
  },
};

export const EASE = 'power3.out';

/** One ScrollTrigger.refresh for a burst of requests (sections mounting together),
    instead of a full layout pass per section. */
let refreshTimer = 0;
export function refreshSoon(delay = 120) {
  if (typeof window === 'undefined') return;
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), delay);
}
