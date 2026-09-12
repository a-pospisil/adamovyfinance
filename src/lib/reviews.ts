/**
 * Hodnocení klientů.
 *
 * Zdroj: veřejný profil Evergreen Finance na Google, jak je publikuje sama
 * společnost na egfin.cz (JSON-LD `review` na úvodní stránce). Texty ani jména
 * nejsou nijak upravené a nic není dopsané. Google Places API k dispozici není,
 * takže se recenze nenačítají živě — při změně na Google je potřeba tento
 * soubor aktualizovat.
 */

export const GOOGLE_PROFILE_URL =
  "https://www.google.com/maps/place/Evergreen+finance/@50.0808873,14.423933,17z/data=!4m6!3m5!1s0x470b955c61251fef:0xeeeaa88a3605cb5f!8m2!3d50.0808873!4d14.423933!16s%2Fg%2F11q2jzzwvv";

export const GOOGLE_RATING = { value: "5,0", count: 31 } as const;

export type Review = { author: string; text: string; rating: 5 };

export const REVIEWS: Review[] = [
  {
    author: "Martina Janovska",
    rating: 5,
    text: "Pan Pospíšil je doslova chodící kalkulačka – pracuje velmi rychle, efektivně a zároveň profesionálně. Za mě jednoznačně palec nahoru. Jeho služeb určitě v budoucnu znovu využiji.",
  },
  {
    author: "Simona Čadová",
    rating: 5,
    text: "Služby hypotečního poradce mohu jednoznačně doporučit. Díky jeho odbornosti, zkušenostem a individuálnímu přístupu se podařilo najít možnosti financování, které by mě samotnou vůbec nenapadly.",
  },
  {
    author: "Jan Nachtigal",
    rating: 5,
    text: "S panem Pospíšilem jsme se snažili získat úvěr na složitou nemovitost s mojí složitější situací. Sice to nevyšlo, ale houževnatost, snahu a nápady na různé cesty, které pan Pospíšil vymyslel, byly opravdu obdivuhodné.",
  },
];
