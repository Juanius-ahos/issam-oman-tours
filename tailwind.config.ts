import type { Config } from 'tailwindcss';

// Colors point at CSS variables (src/styles/tokens.css) so one token file
// drives Tailwind utilities, plain CSS and the 3D map materials.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: 'rgb(var(--sand) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-deep': 'rgb(var(--accent-deep) / <alpha-value>)',
        'accent-light': 'rgb(var(--accent-light) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      maxWidth: {
        prose: '62ch',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(.22,1,.36,1)',
      },
      screens: {
        // "desk" mirrors src/lib/viewport.ts: wide AND not a short touch screen.
        desk: { raw: '(min-width: 901px) and (min-height: 561px), (min-width: 901px) and (pointer: fine)' },
      },
    },
  },
  plugins: [],
} satisfies Config;
