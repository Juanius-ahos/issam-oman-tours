/* "Moments from the road": Issam's own photos from real tours (sent by him,
   2026-11-11). No captions or places are claimed, only who is in the picture.
   Guests' children with visible faces are left out on purpose.
   Desktop: a 4-column masonry. Mobile: a swipeable strip. */
import { BASE } from '../routes';
import { useI18n } from '../i18n';
import { StarDivider } from '../oman/Ornament';

type Kind = 'guests' | 'issam' | 'place';
const shots: { name: string; kind: Kind; w: number; h: number }[] = [
  { name: 'desert-sunset', kind: 'guests', w: 960, h: 1280 },
  { name: 'guests-karak', kind: 'guests', w: 1000, h: 968 },
  { name: 'guests-turban', kind: 'guests', w: 1280, h: 852 },
  { name: 'issam-night', kind: 'issam', w: 852, h: 1280 },
  { name: 'guests-dunes', kind: 'guests', w: 960, h: 1280 },
  { name: 'guests-selfie', kind: 'guests', w: 1000, h: 750 },
  { name: 'wadi-pool', kind: 'place', w: 960, h: 1280 },
  { name: 'guests-mirror', kind: 'guests', w: 852, h: 1280 },
  { name: 'guests-dunes-view', kind: 'guests', w: 1280, h: 960 },
  { name: 'desert-landcruiser', kind: 'guests', w: 960, h: 1280 },
  { name: 'issam-mountains', kind: 'issam', w: 1261, h: 1280 },
  { name: 'guests-dinner', kind: 'guests', w: 960, h: 1280 },
  { name: 'issam-fort', kind: 'issam', w: 773, h: 1280 },
  { name: 'desert-kettle', kind: 'place', w: 960, h: 1280 },
  { name: 'guests-wadi', kind: 'guests', w: 960, h: 1280 },
  { name: 'issam-terrace', kind: 'issam', w: 960, h: 1280 },
];

export function Gallery() {
  const { m } = useI18n();
  const alt: Record<Kind, string> = { guests: m.gallery.altGuests, issam: m.gallery.altIssam, place: m.gallery.altPlace };
  return (
    <section id="moments" className="section">
      <header className="section-head">
        <p className="eyebrow">{m.gallery.eyebrow}</p>
        <StarDivider />
        <h2 className="section-title">{m.gallery.title}</h2>
        <p className="section-lead">{m.gallery.lead}</p>
      </header>
      <ul className="moments">
        {shots.map((s) => (
          <li key={s.name} className="moment">
            <img
              src={`${BASE}media/issam/${s.name}-640.webp`}
              srcSet={`${BASE}media/issam/${s.name}-640.webp 640w, ${BASE}media/issam/${s.name}-1280.webp 1280w`}
              sizes="(max-width: 900px) 72vw, 22vw"
              width={s.w}
              height={s.h}
              alt={alt[s.kind]}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
