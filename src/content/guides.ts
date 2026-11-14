/* Oman travel guides: long-form pages for the questions travelers search
   ("best time to visit Oman", "Oman itinerary", "things to do in Muscat").
   English first; a locale gets a guide page only once its translation is added
   here, so no untranslated copies are published (routes.ts reads this).
   Facts: general, checkable facts about Oman, plus what Issam told us in his
   questionnaire (best months per tour, distances, what each tour includes).
   No invented personal anecdotes: his own tips can be added to `tips` later. */
import type { Locale, TourSlug } from '../config';

export const guideSlugs = ['best-time-to-visit-oman', 'oman-itinerary', 'things-to-do-in-muscat'] as const;
export type GuideSlug = (typeof guideSlugs)[number];

export type Guide = {
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** ISO date the content was last reviewed. */
  updated: string;
  lead: string;
  sections: { h: string; p: string[]; list?: string[] }[];
  /** Tours this guide points to, in order. */
  tours: TourSlug[];
  faq: { q: string; a: string }[];
};

/** Labels around the guide content, per locale that has guides. */
export const guideUi: Partial<Record<Locale, { kicker: string; updated: string; toursTitle: string; faqTitle: string; footer: string; more: string; crumb: string }>> = {
  en: { kicker: 'Oman travel guide', updated: 'Updated', toursTitle: 'Tours for this', faqTitle: 'Quick answers', footer: 'Oman travel guides', more: 'More guides', crumb: 'Guides' },
};

export const guides: Record<GuideSlug, Partial<Record<Locale, Guide>>> = {
  'best-time-to-visit-oman': {
    en: {
      title: 'The best time to visit Oman, month by month',
      seoTitle: 'Best Time to Visit Oman: Month by Month Guide',
      seoDescription: 'When to visit Oman: October to April is the most pleasant, summer is very hot in Muscat and the desert, and Salalah turns green in the monsoon. Month by month, from a local guide.',
      updated: '2026-11-14',
      lead: 'For most travelers the best time to visit Oman is from October to April, when days in Muscat are warm rather than hot and the desert and the wadis are comfortable to explore. Here is what each part of the year is like, and which tours fit it best.',
      sections: [
        {
          h: 'October to April: the main season',
          p: [
            'These are the most comfortable months in the north of Oman. In Muscat the days are usually in the high 20s to low 30s °C, the sea is warm, and evenings on the Mutrah Corniche are pleasant. December to February are the mildest months.',
            'This is also the best time for the Wahiba Sands and for wadis such as Wadi Shab. Issam runs his Muscat and Wahiba tours from September to May, and Wadi Shab from September to April.',
          ],
        },
        {
          h: 'Winter nights in the desert and the mountains',
          p: [
            'Days are mild in winter, but nights in the desert and up in the Hajar mountains can be surprisingly cold. If you plan a sunset in the Wahiba Sands or a day around Nizwa and the mountains between December and February, bring a warm layer for the evening.',
          ],
        },
        {
          h: 'May and September: hot shoulder months',
          p: [
            'Temperatures climb in May and stay high into September. Early mornings and evenings are still good for sightseeing, and these months are quieter. Start tours early, plan indoor stops such as museums at midday, and keep the desert for the late afternoon.',
          ],
        },
        {
          h: 'June to August: summer in the north, green season in the south',
          p: [
            'Summer in Muscat and the interior is very hot, often above 40 °C, and humid on the coast. Outdoor tours are best kept short and early.',
            'The far south is the exception. Around Salalah in Dhofar, the khareef monsoon brings mist, drizzle and green hills from about June to September, and it is the busy season there.',
          ],
        },
        {
          h: 'Nizwa: good all year',
          p: [
            'Nizwa, with its fort and souq, can be visited in any month. In summer, go early in the morning or in the evening: Issam also runs Nizwa by night, when the fort is lit and the souq stays open late.',
          ],
        },
        {
          h: 'Ramadan and public holidays',
          p: [
            'The dates of Ramadan move about 11 days earlier each year. During Ramadan, eating and drinking in public during daylight is not allowed, many restaurants open only after sunset and opening hours are shorter. Tours still run, and the evenings are lively. The two Eid holidays are busy with local travelers, so book early.',
          ],
        },
        {
          h: 'Rain and wadis',
          p: [
            'Rain is rare but can be heavy, and wadis can flood quickly. Nobody should enter a wadi when rain is forecast. If the weather closes a route, Issam offers an alternative, or a refund if there is none.',
          ],
        },
      ],
      tours: ['muscat-city', 'wahiba-desert', 'wadi-shab-coast', 'nizwa-mountains'],
      faq: [
        { q: 'What is the best month to visit Oman?', a: 'December to February are the mildest months, and October to April is the best season overall for Muscat, the desert and the wadis.' },
        { q: 'Is Oman too hot in summer?', a: 'June to August are very hot in Muscat and the interior, often above 40 °C. Tours are still possible early in the morning and in the evening, and Salalah in the south is green and cooler in the monsoon season.' },
        { q: 'Can I visit Oman during Ramadan?', a: 'Yes. Tours run as usual, but eating and drinking in public during the day is not allowed and many places keep shorter hours. The evenings after sunset are lively.' },
      ],
    },
  },
  'oman-itinerary': {
    en: {
      title: 'Oman itinerary: 3, 5 and 7 days',
      seoTitle: 'Oman Itinerary: 3, 5 and 7 Days from Muscat',
      seoDescription: 'How to spend 3, 5 or 7 days in Oman from Muscat: the Grand Mosque and Mutrah, Nizwa, the Wahiba Sands, Wadi Shab and Al Hamra, with driving distances and tips from a local guide.',
      updated: '2026-11-14',
      lead: 'Oman is easy to plan around Muscat: most of the classic places are a day trip away. These itineraries follow real driving distances and the private tours Issam runs, and every day can be changed to suit you.',
      sections: [
        {
          h: '3 days: the essentials',
          p: ['Three days are enough for the capital, the old heart of the country and the desert.'],
          list: [
            'Day 1, Muscat: the Sultan Qaboos Grand Mosque in the morning, then the Royal Opera House, Mutrah Corniche and Souq, and Old Muscat with Al Alam Palace (about 50 km).',
            'Day 2, Nizwa: the fort and souq of the old capital below the Hajar mountains (about 300 km return).',
            'Day 3, the Wahiba Sands: the dunes by 4x4 and sunset in the desert (about 300 km return).',
          ],
        },
        {
          h: '5 days: add the coast and an evening',
          p: ['With five days, add a wadi and see Muscat after dark.'],
          list: [
            'Days 1 to 3 as above.',
            'Day 4, Wadi Shab: an early start along the coast south of Muscat, a short boat ride, a canyon walk and natural pools (about 200 km return).',
            'Day 5, a slow morning, then Muscat by night: the Opera House lit up, the Corniche and the evening souq.',
          ],
        },
        {
          h: '7 days: a round trip',
          p: ['A week lets you stop moving back and forth to Muscat. Issam joins the tours into one round trip of several days and helps book the hotels on the way.'],
          list: [
            'Day 1, Muscat city.',
            'Day 2, Nizwa, staying in the area.',
            'Day 3, Al Hamra old village, with Misfat Al Abriyeen on request.',
            'Day 4, across to the Wahiba Sands for sunset.',
            'Day 5, the coast: Wadi Shab, and Sur on request.',
            'Day 6, back to Muscat, Muscat by night.',
            'Day 7, free, or a second day in the place you liked most.',
          ],
        },
        {
          h: 'Getting around',
          p: [
            'Distances are moderate and roads are good, but days out of Muscat are long: Nizwa and the Wahiba Sands are each about 300 km return. A private guide and driver means you can rest between stops and change the plan as you go. Tours are private for 1 to 45 travelers, by car or by bus, with pickup wherever you stay.',
          ],
        },
        {
          h: 'When to go',
          p: ['October to April is the most comfortable time for this route. In the summer months keep outdoor stops to early mornings and evenings. See the month by month guide for details.'],
        },
      ],
      tours: ['muscat-city', 'nizwa-mountains', 'wahiba-desert', 'wadi-shab-coast', 'multi-day'],
      faq: [
        { q: 'How many days do you need in Oman?', a: 'Three days cover Muscat, Nizwa and the desert. Five days add a wadi and an evening in Muscat. A week allows a relaxed round trip with nights outside Muscat.' },
        { q: 'Can I do day trips from Muscat?', a: 'Yes. Nizwa, the Wahiba Sands and Wadi Shab are all day trips from Muscat, with pickup from your hotel.' },
        { q: 'Do you need a car in Oman?', a: 'Not with a private tour: pickup and drop-off are included, and Issam can plan several days and help with hotels.' },
      ],
    },
  },
  'things-to-do-in-muscat': {
    en: {
      title: 'Things to do in Muscat',
      seoTitle: 'Things to Do in Muscat: A Local Guide’s List',
      seoDescription: 'The best things to do in Muscat, Oman: the Sultan Qaboos Grand Mosque, Mutrah Corniche and Souq, Old Muscat, the Royal Opera House and Muscat by night, with dress code tips.',
      updated: '2026-11-14',
      lead: 'Muscat is spread along the coast between the mountains and the sea, and its best places are easy to combine in one day. Here are the places most travelers come for, and how to see them.',
      sections: [
        {
          h: 'Sultan Qaboos Grand Mosque',
          p: [
            'The country’s great mosque, with its huge prayer hall, chandelier and hand-woven carpet. It opens to non-Muslim visitors on weekday mornings, so it is usually the first stop of the day.',
            'Dress code: women cover their hair, and everyone wears long sleeves and long trousers or a long skirt.',
          ],
        },
        {
          h: 'Mutrah Corniche and Souq',
          p: [
            'The seafront promenade along the old harbour, and one of the oldest souqs in the region behind it: frankincense, silver, textiles and karak tea. It is at its best in the late afternoon and evening.',
          ],
        },
        {
          h: 'Old Muscat and Al Alam Palace',
          p: [
            'The ceremonial palace with its blue and gold facade, between the Al Jalali and Al Mirani forts above the bay. The palace and forts are seen from outside, and the area is small enough to walk.',
          ],
        },
        {
          h: 'Royal Opera House Muscat',
          p: ['A white stone opera house in Shati Al Qurum, worth seeing by day and lit up at night. Check the program if you want to attend a performance.'],
        },
        {
          h: 'Muscat by night',
          p: ['When the heat drops, Muscat comes alive: the lit Opera House, the Corniche full of families and the evening souq. Issam runs this as a private evening tour.'],
        },
        {
          h: 'Day trips from Muscat',
          p: ['The capital is also the base for day trips: Nizwa and its fort, the Wahiba Sands, Wadi Shab on the coast with the Bimmah Sinkhole on the way, and the mud-brick village of Al Hamra.'],
        },
        {
          h: 'Tips',
          p: [],
          list: [
            'Start early: mornings are cooler, and the Grand Mosque is open to visitors in the morning.',
            'Dress modestly in the old town and souqs: shoulders and knees covered.',
            'Cards work in most places; keep some cash for taxis and small shops.',
            'A half-day tour (8:00 to 12:00) covers the main sights; a full day (8:00 to 15:00) leaves time for the hidden corners.',
          ],
        },
      ],
      tours: ['muscat-city', 'muscat-night', 'wadi-shab-coast', 'nizwa-mountains'],
      faq: [
        { q: 'How many days do you need in Muscat?', a: 'One full day covers the Grand Mosque, Mutrah and Old Muscat. Add an evening for Muscat by night, and use Muscat as a base for day trips.' },
        { q: 'What should I wear to the Sultan Qaboos Grand Mosque?', a: 'Women cover their hair, and everyone wears long sleeves and long trousers or a long skirt.' },
        { q: 'Is Muscat walkable?', a: 'Each area, such as Mutrah or Old Muscat, is easy to walk, but the city is long and spread out, so you need transport between them.' },
      ],
    },
  },
};

export const hasGuide = (slug: GuideSlug, locale: Locale) => Boolean(guides[slug][locale]);
export const guideLocales = (slug: GuideSlug) => Object.keys(guides[slug]) as Locale[];
