/* Small shared pieces used by both the sidebar and the hero, so a hero
   ghost target and its sidebar twin always render identical markup. */
import type { ReactNode } from 'react';
import { config, whatsappUrl } from '../config';
import { useI18n } from '../i18n';
import { trackWhatsApp } from '../lib/analytics';
import { Icon, type IconName } from './Icon';

export function WaLink({
  location,
  text,
  className = '',
  children,
  ...rest
}: { location: string; text?: string; className?: string; children: ReactNode } & Record<string, unknown>) {
  return (
    <a
      href={whatsappUrl(text)}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => trackWhatsApp(location)}
      {...rest}
    >
      {children}
    </a>
  );
}

export function RollText({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

const socialIcons: Record<keyof typeof config.socials, IconName> = {
  instagram: 'instagram',
  tiktok: 'tiktok',
  youtube: 'youtube',
  facebook: 'facebook',
};

export function SocialRow({ tileClass = '' }: { tileClass?: string }) {
  return (
    <ul className="flex gap-1.5">
      {(Object.keys(config.socials) as (keyof typeof config.socials)[]).map((k) => (
        <li key={k}>
          <a
            href={config.socials[k].url}
            target="_blank"
            rel="noopener me"
            aria-label={k}
            className={`grid h-[30px] w-[30px] place-items-center rounded-lg bg-sand text-ink transition-transform duration-300 ease-out hover:-translate-y-0.5 ${tileClass}`}
          >
            <Icon name={socialIcons[k]} size={15} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function StatCard({ value, suffix = '', label, icon }: { value: number; suffix?: string; label: string; icon: IconName }) {
  return (
    <div className="glass-ink relative flex h-[96px] w-[101px] flex-col justify-end rounded-[14px] p-3">
      <Icon name={icon} size={14} className="absolute end-3 top-3 text-accent-light" />
      <span className="text-[26px] font-black leading-none tracking-[-0.045em] text-accent-light">
        {value.toLocaleString('en-US')}
        {suffix}
      </span>
      <span className="mt-1.5 text-[8.5px] font-extrabold uppercase leading-tight tracking-[0.12em] text-white/85">{label}</span>
    </div>
  );
}

export function WaButton({ location, className = '' }: { location: string; className?: string }) {
  const { m } = useI18n();
  return (
    <WaLink location={location} className={`btn btn-accent roll-host w-[220px] ${className}`}>
      <Icon name="whatsapp" size={17} />
      <RollText>{m.hero.ctaWhatsapp}</RollText>
    </WaLink>
  );
}
