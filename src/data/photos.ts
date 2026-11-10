/* Real photographs from Wikimedia Commons, used until Issam's own arrive.
   Their licenses require crediting the photographer, so the footer lists every
   one. When a photo is replaced, remove its row and its files in public/media/places. */
import { BASE } from '../routes';

export const photos = [
  { slug: "wahiba-soft-dunes", name: "Wahiba Sands dunes", author: "Christoph Strässler", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Dunes_in_Wahiba_Sands,_Oman.jpg" },
  { slug: "wahiba-sunset", name: "Sunset in the Wahiba Sands", author: "Christoph Strässler", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Sunset_in_Wahiba_Sands,_Oman.jpg" },
  { slug: "wahiba-dune-drive", name: "Dune driving, Wahiba Sands", author: "Andries Oudshoorn", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Wahiba_Sands_(12).jpg" },
  { slug: "muscat-grand-mosque", name: "Sultan Qaboos Grand Mosque, Muscat", author: "Francesco Bini", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Muscat,_moschea_del_sultano_qaboos,_esterno_01.jpg" },
  { slug: "muttrah-night", name: "Muttrah at night", author: "canon_shooter92", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Intermission_in_Mutrah.jpg" },
  { slug: "nizwa-fort", name: "Nizwa Fort", author: "dconvertini", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Nizwa_Fort,_Oman_2024_14.jpg" },
  { slug: "nizwa-oasis", name: "Nizwa oasis and the Hajar mountains", author: "dconvertini", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Nizwa_Fort,_Oman_2024_10.jpg" },
  { slug: "wadi-shab", name: "Wadi Shab", author: "dconvertini", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Wadi_Shab,_Oman_-_2024_10.jpg" },
  { slug: "nizwa-night", name: "Nizwa Fort by night", author: "Ekrem Canli", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Nizwa_Fort_by_night_2019.jpg" },
  { slug: "muscat-corniche-night", name: "Mutrah Corniche at night, Muscat", author: "Omar AV", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:Fishing_at_night_time,_Mutrah,_Muscat_-_panoramio.jpg" },
  { slug: "al-hamra", name: "Al Hamra and the Hajar mountains", author: "Christoph Strässler", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Al_Hamra,_Oman.jpg" },
] as const;

export type PhotoSlug = (typeof photos)[number]['slug'];

export const photoSrc = (slug: PhotoSlug, width: 960 | 1920 = 1920) => `${BASE}media/places/${slug}-${width}.webp`;
export const photoSrcSet = (slug: PhotoSlug) => `${photoSrc(slug, 960)} 960w, ${photoSrc(slug, 1920)} 1920w`;
