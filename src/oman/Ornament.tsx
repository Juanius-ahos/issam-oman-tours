/* Islamic geometric accents, constructed rather than drawn.

   Star and cross (khatam): on a square grid of size S, an 8-point star made of
   two overlapping squares sits in every cell, its four axial points touching
   the neighbours'. The space between four stars closes into a cross.

   Accents only: always behind content, faded out with a mask, never captioned.
   Plain SVG, rendered on the server, colors from the site tokens. */
import { useId, type CSSProperties } from 'react';

const r2 = (n: number) => Math.round(n * 100) / 100;
const P = (x: number, y: number) => `${r2(x)} ${r2(y)}`;

/** Outline of an 8-point star built from two squares of circumradius R. */
function octagram(cx: number, cy: number, R: number) {
  const ri = (R * Math.cos(Math.PI / 4)) / Math.cos(Math.PI / 8); // where the two squares cross
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 8;
    const r = i % 2 ? ri : R;
    pts.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a)));
  }
  return `M${pts.join('L')}Z`;
}

/** The same star as two separate squares. */
function twoSquares(cx: number, cy: number, R: number) {
  const sq = (rot: number) => [0, 1, 2, 3].map((i) => P(cx + R * Math.cos(rot + (i * Math.PI) / 2), cy + R * Math.sin(rot + (i * Math.PI) / 2))).join('L');
  return `M${sq(-Math.PI / 2)}Z M${sq(-Math.PI / 4)}Z`;
}

type Tone = 'sand' | 'dark' | 'fine' | 'frieze';

const tones: Record<Tone, { size: number; line: string; core?: string; fill?: string; width: number; coreWidth?: number }> = {
  /** Outline strapwork for light sections. */
  sand: { size: 120, line: 'rgb(var(--accent) / .22)', core: 'rgb(var(--sand))', width: 0.034, coreWidth: 0.011 },
  /** Purple stars glowing through dark panels. */
  dark: { size: 120, line: 'rgb(var(--accent-light) / .28)', fill: 'rgb(var(--accent) / .16)', width: 0.01 },
  /** Smaller version for popups. */
  fine: { size: 72, line: 'rgb(var(--accent-light) / .3)', fill: 'rgb(var(--accent) / .18)', width: 0.012 },
  /** Small stars in a thin band. */
  frieze: { size: 32, line: 'rgb(var(--accent-light) / .55)', fill: 'rgb(var(--accent) / .35)', width: 0.03 },
};

/** Star-and-cross texture that fills its box. Position and mask it with className. */
export function StarPattern({ tone = 'sand', className = '', style }: { tone?: Tone; className?: string; style?: CSSProperties }) {
  const id = `geo${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const t = tones[tone];
  const S = t.size;
  const star = octagram(S / 2, S / 2, S / 2);
  return (
    <svg className={`pointer-events-none ${className}`} style={style} width="100%" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={S} height={S} patternUnits="userSpaceOnUse">
          {t.fill && <path d={star} fill={t.fill} />}
          <path d={star} fill="none" stroke={t.line} strokeWidth={S * t.width} strokeLinejoin="miter" />
          {t.core && <path d={star} fill="none" stroke={t.core} strokeWidth={S * (t.coreWidth ?? 0)} strokeLinejoin="miter" />}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Small star with fine hairlines that fade away from it. "start" sits the star at the leading edge. */
export function StarDivider({ align = 'start', width = 240, className = '' }: { align?: 'start' | 'center'; width?: number; className?: string }) {
  const id = `fade${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const h = 28;
  const y = h / 2;
  const c = align === 'center' ? width / 2 : 14;
  const dia = (x: number, s: number) => `M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`;
  const right = `M${c + 22} ${y - 2.5}H${width}M${c + 22} ${y + 2.5}H${width}`;
  const left = align === 'center' ? `M0 ${y - 2.5}H${c - 22}M0 ${y + 2.5}H${c - 22}` : '';
  const diamonds = align === 'center' ? `${dia(c - 34, 3)} ${dia(c + 34, 3)} ${dia(c - 48, 2)} ${dia(c + 48, 2)}` : `${dia(c + 34, 3)} ${dia(c + 48, 2)}`;
  return (
    <svg className={`block rtl:-scale-x-100 ${className}`} viewBox={`0 0 ${width} ${h}`} width={width} height={h} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          {align === 'center' && <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity="0" />}
          <stop offset={align === 'center' ? '.42' : '0'} stopColor="rgb(var(--accent))" />
          {align === 'center' && <stop offset=".58" stopColor="rgb(var(--accent))" />}
          <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${left}${right}`} stroke={`url(#${id})`} strokeWidth="1" />
      <path d={diamonds} fill="rgb(var(--accent))" />
      <path d={twoSquares(c, y, 12)} fill="none" stroke="rgb(var(--accent))" strokeWidth="1.2" strokeLinejoin="miter" />
      <path d={octagram(c, y, 5.5)} fill="rgb(var(--amber))" />
    </svg>
  );
}
