/* "Moments from Issam's tours": his own photos from real tours (sent by him,
   2026-11-11), the strongest eight only. No captions or places are claimed.
   Guests' children with visible faces are left out on purpose.
   Desktop: one large feature plus a mosaic. Phones: a swipe strip. */
import { BASE } from '../routes';
import { useI18n } from '../i18n';
import { StarDivider, StarPattern } from '../oman/Ornament';

type Kind = 'guests' | 'issam' | 'place';
type Shape = 'xl' | 'tall' | 'wide' | '';
const shots: { name: string; kind: Kind; shape: Shape; pos?: string }[] = [
  { name: 'desert-sunset', kind: 'guests', shape: 'xl', pos: '50% 62%' },
  { name: 'guests-dunes', kind: 'guests', shape: 'tall', pos: '50% 70%' },
  { name: 'issam-night', kind: 'issam', shape: 'tall', pos: '50% 30%' },
  { name: 'wadi-pool', kind: 'place', shape: '', pos: '50% 60%' },
  { name: 'guests-turban', kind: 'guests', shape: '' },
  { name: 'desert-landcruiser', kind: 'guests', shape: 'wide', pos: '50% 58%' },
  { name: 'guests-dunes-view', kind: 'guests', shape: 'wide' },
  { name: 'guests-karak', kind: 'guests', shape: 'wide', pos: '50% 38%' },
];

export function Gallery() {
  const { m } = useI18n();
  const alt: Record<Kind, string> = { guests: m.gallery.altGuests, issam: m.gallery.altIssam, place: m.gallery.altPlace };
  return (
    <section id="moments" className="section isolate overflow-clip">
      <header className="section-head">
        <p className="eyebrow">{m.gallery.eyebrow}</p>
        <StarDivider />
        <h2 className="section-title">{m.gallery.title}</h2>
        <p className="section-lead">{m.gallery.lead}</p>
      </header>
      <div className="moments-wrap">
        <StarPattern tone="sand" className="moments-geo" />
        <ul className="moments">
          {shots.map((s) => (
            <li key={s.name} className={`moment ${s.shape ? `moment-${s.shape}` : ''}`}>
              <img
                src={`${BASE}media/issam/${s.name}-640.webp`}
                srcSet={`${BASE}media/issam/${s.name}-640.webp 640w, ${BASE}media/issam/${s.name}-1280.webp 1280w`}
                sizes={s.shape === 'xl' || s.shape === 'wide' ? '(max-width: 900px) 74vw, 44vw' : '(max-width: 900px) 74vw, 22vw'}
                alt={alt[s.kind]}
                loading="lazy"
                decoding="async"
                style={s.pos ? { objectPosition: s.pos } : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
