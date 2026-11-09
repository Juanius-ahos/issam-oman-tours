/* Placeholders and lazy media. No AI-generated images anywhere: until real
   photos and videos exist, a labelled gray box says exactly what goes there. */
import { useEffect, useRef, type CSSProperties } from 'react';

export function Placeholder({
  label,
  className = '',
  dark = false,
  style,
}: {
  label: string;
  className?: string;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`ph ${dark ? 'ph-dark' : ''} ${className}`} style={style} role="img" aria-label={label}>
      <span className="ph-label">{label}</span>
    </div>
  );
}

/**
 * Lazy video: preload="none", no autoplay attribute. Plays only while on screen,
 * pauses when it leaves, never plays under reduced motion. With no src yet it
 * shows the poster photo if there is one, otherwise the labelled placeholder.
 */
export function LazyVideo({
  src,
  poster,
  label,
  className = '',
  dark = true,
  sizes = '100vw',
}: {
  src?: { webm?: string; mp4?: string };
  poster?: string;
  label: string;
  className?: string;
  dark?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const hasSrc = !!(src?.webm || src?.mp4);

  useEffect(() => {
    const v = ref.current;
    if (!v || !hasSrc) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '120px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [hasSrc]);

  if (!hasSrc && poster) {
    return <img src={poster} srcSet={`${poster.replace('-1920.', '-960.')} 960w, ${poster} 1920w`} sizes={sizes} alt={label} loading="lazy" decoding="async" className={`tour-photo ${className}`} />;
  }
  if (!hasSrc) return <Placeholder label={label} dark={dark} className={className} />;
  return (
    <video ref={ref} className={`object-cover ${className}`} muted loop playsInline preload="none" poster={poster} aria-label={label}>
      {src?.webm && <source src={src.webm} type="video/webm" />}
      {src?.mp4 && <source src={src.mp4} type="video/mp4" />}
    </video>
  );
}
