import { config } from '../config';
import { useI18n } from '../i18n';
import { Icon, type IconName } from '../components/Icon';
import { StarDivider, StarPattern } from '../oman/Ornament';

const order = ['instagram', 'tiktok', 'youtube', 'facebook'] as const;
const names: Record<(typeof order)[number], string> = { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', facebook: 'Facebook' };

export function Follow() {
  const { m } = useI18n();
  return (
    <section id="follow" className="section isolate overflow-clip">
      <StarPattern tone="sand" className="edge-geo" />
      <header className="section-head">
        <p className="eyebrow">{m.follow.eyebrow}</p>
        <StarDivider />
        <h2 className="section-title">{m.follow.title}</h2>
        <p className="section-lead">{m.follow.lead}</p>
      </header>
      <ul className="border-t border-ink/15">
        {order.filter((k) => config.socials[k].url).map((k) => (
          <li key={k}>
            <a href={config.socials[k].url} target="_blank" rel="noopener me" className="plat">
              <span className="plat-ico">
                <Icon name={k as IconName} size={20} />
              </span>
              <span className="text-[clamp(20px,2.2vw,32px)] font-black tracking-[-0.035em]">{names[k]}</span>
              <span className="hidden text-[14px] font-bold text-ink/72 md:block">{config.socials[k].handle}</span>
              <span className="label-xs text-end text-ink/70">{m.follow.notes[k]}</span>
              <Icon name="arrow" size={20} className="plat-arrow" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
