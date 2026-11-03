/* Inline SVG icons (no icon font, no extra request). 24px grid, currentColor. */
import type { SVGProps } from 'react';

const paths = {
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" fill="currentColor" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" fill="currentColor" />,
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path d="m10 9 5 3-5 3V9Z" fill="rgb(var(--sand))" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5Z" fill="currentColor" />,
  home: <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z" fill="currentColor" />,
  story: <path d="M5 3h11l3 3v15H5V3Zm3 6h8v2H8V9Zm0 4h8v2H8v-2Z" fill="currentColor" />,
  map: <path d="m9 4 6 2 6-2v16l-6 2-6-2-6 2V6l6-2Zm0 2.2v11.6l6 2V8.2l-6-2Z" fill="currentColor" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor" />,
  help: (
    <>
      <path d="M9 9a3 3 0 1 1 4.2 2.8c-.8.3-1.2 1-1.2 1.8V15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </>
  ),
  send: <path d="M3 11 21 3l-8 18-2-8-8-2Z" fill="currentColor" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3C9.5 5.5 8.2 8.5 8.2 12S9.5 18.5 12 21" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  arrow: <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  close: <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  minus: <path d="M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  menu: <path d="M4 8h16M4 16h16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  play: <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />,
  check: <path d="m5 12 4.5 4.5L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" fill="currentColor" />
      <circle cx="18" cy="6" r="2.5" fill="currentColor" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" fill="currentColor" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0h-13Z" fill="currentColor" />
      <circle cx="17" cy="9" r="2.6" fill="currentColor" opacity=".6" />
      <path d="M16 20a7.8 7.8 0 0 0-1.5-4.6A5 5 0 0 1 22 20h-6Z" fill="currentColor" opacity=".6" />
    </>
  ),
  translate: <path d="M3 5h10M8 3v2m3.5 0c-.8 4-3.4 7.5-7.5 9.5M6 9c1 2 2.8 3.6 5 4.6M13 21l4-10 4 10m-6.8-3.4h5.6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  copy: <path d="M9 9h10v10H9V9Zm-4 6V5h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
      {paths[name]}
    </svg>
  );
}
