/* Short excerpts from Issam's Tripadvisor reviews (copied 2026-11-26), each linking
   to the full review. Text is as Tripadvisor shows it in English; where `from` is
   set, Tripadvisor translated it from that language. Reviewer names are their
   public Tripadvisor display names. Text only: no review schema (Google's rules on
   self-hosted reviews), and no star rating per quote. */
export type TripadvisorQuote = { name: string; place?: string; month: string; text: string; from?: string; url: string };

export const tripadvisorQuotes: TripadvisorQuote[] = [
  {
    name: 'Lekste',
    place: 'Milan, Italy',
    month: '2026-11',
    text: 'Five days in Oman with Issam: more than a guide, a travel companion with a smile always ready and a joke in his pocket.',
    from: 'Italian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28294554-r1086325795-5_Days_6_Nights_Private_Tour_in_Oman-Muscat_Muscat_Governorate.html',
  },
  {
    name: 'Bruno D',
    place: 'Pianezza, Italy',
    month: '2026-11',
    text: 'Issam is the guide every tourist would want, for the knowledge he has of the country, from history to culture to the customs of Oman.',
    from: 'Italian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28294554-r1085830859-5_Days_6_Nights_Private_Tour_in_Oman-Muscat_Muscat_Governorate.html',
  },
  {
    name: 'Дмитрий Н',
    month: '2026-10',
    text: 'We went to places where there are few tourists, very atmospheric and authentic. Delicious food, coffee, tea, stunning views, a sea of impressions.',
    from: 'Russian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28225601-r1083856416-Historical_Nizwa_and_its_HIDDEN_GEMS_in_different_languages-Muscat_Muscat_Gov.html',
  },
  {
    name: 'Francesca P',
    month: '2026-11',
    text: 'It is he who made the trip unforgettable thanks to his great preparation and competence but also thanks to his friendliness.',
    from: 'Italian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28294554-r1086286814-5_Days_6_Nights_Private_Tour_in_Oman-Muscat_Muscat_Governorate.html',
  },
  {
    name: 'Natali V',
    place: 'Oman',
    month: '2026-11',
    text: 'Guide Issam showed many beautiful places, was attentive, and told interesting facts about Oman. Kind, positive, open.',
    from: 'Russian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28194501-r1084747605-Private_Safari_tour_and_Wadi_in_4x4_with_a_local_guide-Muscat_Muscat_Governor.html',
  },
  {
    name: 'Igor M',
    month: '2026-11',
    text: 'Issam, well done! A very positive guy, a real Omani, who loves his country.',
    from: 'Russian',
    url: 'https://www.tripadvisor.com/ShowUserReviews-g1940497-d28225601-r1084789286-Historical_Nizwa_and_its_HIDDEN_GEMS_in_different_languages-Muscat_Muscat_Gov.html',
  },
];
