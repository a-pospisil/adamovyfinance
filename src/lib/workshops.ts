import { nb } from "@/lib/format";
import { EGFIN, FACTS } from "@/lib/site";

export type Workshop = {
  slug: "zacatecnici" | "pokrocile";
  level: string;
  title: string;
  claim: string;
  description: string;
  start: string;
  end: string;
  place: { name: string; street: string; city: string; zip: string; mapUrl: string };
  price: number;
  earlyBird: { price: number; until: string } | null
  saleStart: string;
  capacity: number;
  audience: string[];
  takeaways: string[];
  program: { time: string; title: string }[];
  url: string;
};

const PLACE = {
  name: "Baťův palác",
  street: "Václavské náměstí 774/6",
  city: "Praha 1",
  zip: "110 00",
  mapUrl: "https://maps.google.com/?q=Václavské+náměstí+774/6,+110+00+Praha+1",
};

export const WORKSHOPS: Workshop[] = [
  {
    slug: "zacatecnici",
    level: "Pro začínající investory",
    title: "Financování prvních 4 nemovitostí",
    claim: "Získejte od banky víc, než vám nabídnou na přepážce.",
    description:
      "Večerní workshop pro investory na startu: jak postavit portfolio tak, abyste příští nemovitost financovali bezpečně — bez zamítnutí kvůli bonitě a bez čekání, až naspoříte dost vlastních zdrojů.",
    start: "2026-09-23T18:00:00+02:00",
    end: "2026-09-23T20:30:00+02:00",
    place: PLACE,
    saleStart: "2026-09-12T00:00:00+02:00",
    price: 3800,
    earlyBird: { price: 2649, until: "2026-09-14T23:59:59+02:00" },
    capacity: FACTS.workshopCapacity,
    audience: [
      "Kupujete první nemovitost a chcete rozumět financování dřív, než požádáte banku.",
      "Banka vás odmítla a nevíte proč.",
      "Máte jednu nemovitost a chcete další, ale zasekli jste se na bonitě nebo zástavě.",
      "Chcete mít od začátku systém, který vydrží i pátý nákup.",
    ],
    takeaways: [
      "Jak koupit další nemovitost, aniž byste na ni měli předem naspořeno.",
      "Co banka posuzuje ještě předtím, než otevře vaši žádost: příjmy, závazky, zástavy.",
      "Kolik z nájmu vám která banka uzná — rozpětí je 60 až 70 % a každá to má jinak.",
      "Jak přestavět svou situaci tak, aby pro banku vypadala neodolatelně, bez navyšování příjmu.",
      "Jak pracovat se zástavou, aby vám nikdy nedošly vlastní zdroje.",
      "Co doporučení ČNB od dubna 2026 znamená pro první investiční byt: na pražský byt o milion vlastních zdrojů víc.",
    ],
    program: [
      { time: "17:45", title: "Příchod účastníků" },
      { time: "18:00", title: "Úvod do financování: pojmy a logika investování bez žargonu" },
      { time: "18:45", title: "Přestávka" },
      { time: "19:00", title: "Financování od A do Z: od bonity po výběr banky" },
      { time: "20:00", title: "Diskuze nad praxí a dotazy účastníků" },
      { time: "20:30", title: "Konec oficiální části, neformální networking" },
    ],
    url: EGFIN.workshopBeginners,
  },
  {
    slug: "pokrocile",
    level: "Pro pokročilé investory",
    title: "Strategie, portfolio, růst",
    claim: "Máte čtyři a více nemovitostí a potřebujete zvednout svůj strop.",
    description:
      "Večerní workshop pro investory se zavedeným portfoliem: kde je váš strop DTI 7 a jak s ním pracuje struktura, financování přes s.r.o., refinancování pro reinvestici a jednání s bankou s čísly místo argumentů.",
    start: "2026-09-24T18:00:00+02:00",
    end: "2026-09-24T20:30:00+02:00",
    place: PLACE,
    saleStart: "2026-09-12T00:00:00+02:00",
    price: 4800,
    earlyBird: { price: 3649, until: "2026-09-14T23:59:59+02:00" },
    capacity: FACTS.workshopCapacity,
    audience: [
      "Máte 4 a více investičních nemovitostí a banka odmítla další úvěr.",
      "Narazili jste na strop bonity nebo zástavní hodnoty.",
      "Potřebujete vědět, co DTI 7 a LTV 70 % znamenají pro škálování, ne pro jednu koupi. Dozvíte se, jak zařídit, aby vás tohle nezastavilo.",
      "Řešíte, kdy a jak přejít na s.r.o.",
    ],
    takeaways: [
      "Kde je váš strop DTI 7 a proč s ním hne struktura, ne akontace. DTI 7 není strop.",
      "Jak nastavit a udržet bonitu, aby vás nezastavila při škálování na pátou, šestou a další nemovitost.",
      "Kdy financovat přes s.r.o., co je pro banku důležité a jak pracovat s výkazy.",
      "Kdy je refinancování jedné nemovitosti krok k růstu a kdy portfolio prodražuje.",
      "Jak pracovat se zástavami při více nemovitostech a na co si dát pozor.",
      "Jak vyjednávat s bankou fundovaně a jít si rovnou pro peníze, které vám dosud odmítala dát.",
    ],
    program: [
      { time: "17:45", title: "Příchod účastníků" },
      { time: "18:00", title: "Nejčastější chyby pokročilých investorů" },
      { time: "18:15", title: "Fyzické osoby: limity, bonita a kdy přejít na s.r.o." },
      { time: "18:45", title: "Právnické osoby: podmínky a nastavení financování přes s.r.o." },
      { time: "19:15", title: "Přestávka" },
      { time: "19:30", title: "Další růst: jak portfolio nastavit jako výhodu, ne překážku" },
      { time: "20:10", title: "Q&A a networking" },
      { time: "20:30", title: "Konec oficiálního programu" },
    ],
    url: EGFIN.workshopAdvanced,
  },
];

export type WorkshopStatus = {
  phase: "early" | "regular" | "past";
  priceNow: number;
  regularPrice: number;
  earlyUntil: string | null;
};

/** Price and phase of a workshop at a given moment (computed on the server at render time). */
export function workshopStatus(w: Workshop, now = new Date()): WorkshopStatus {
  const t = now.getTime();
  if (t > new Date(w.end).getTime()) {
    return { phase: "past", priceNow: w.price, regularPrice: w.price, earlyUntil: null };
  }
  if (w.earlyBird && t <= new Date(w.earlyBird.until).getTime()) {
    return { phase: "early", priceNow: w.earlyBird.price, regularPrice: w.price, earlyUntil: w.earlyBird.until };
  }
  return { phase: "regular", priceNow: w.price, regularPrice: w.price, earlyUntil: null };
}

/**
 * Balíček „Dva workshopy + nástroje pro investora“ — na egfin.cz označený jako nejprodávanější.
 * Ceny a obsah převzaté ze stránek workshopů; early bird končí stejně jako u jednotlivých večerů.
 */
export const BUNDLE = {
  name: "Obě úrovně + nástroje pro investora",
  price: 8640,
  earlyBird: { price: 5990, until: "2026-09-14T23:59:59+02:00" },
  includes: [
    "vstup na oba večery, 23. a 24. 9.",
    "Excel na správu portfolia",
    "seznam dokumentů k hypotéce",
    "kalkulačka bonity",
    "roční přístup do aplikace na portfolio",
  ],
  url: `${EGFIN.workshopBeginners}#balicky`,
} as const;

/** Stav balíčku: early bird do 14. 9., běžná cena, po druhém večeru „past“. */
export function bundleStatus(now = new Date()): WorkshopStatus {
  const t = now.getTime();
  const lastEnd = Math.max(...WORKSHOPS.map((w) => new Date(w.end).getTime()));
  if (t > lastEnd) return { phase: "past", priceNow: BUNDLE.price, regularPrice: BUNDLE.price, earlyUntil: null };
  if (t <= new Date(BUNDLE.earlyBird.until).getTime()) {
    return { phase: "early", priceNow: BUNDLE.earlyBird.price, regularPrice: BUNDLE.price, earlyUntil: BUNDLE.earlyBird.until };
  }
  return { phase: "regular", priceNow: BUNDLE.price, regularPrice: BUNDLE.price, earlyUntil: null };
}

const dateFmt = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", year: "numeric", timeZone: "Europe/Prague" });
const timeFmt = new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Prague" });
const weekdayFmt = new Intl.DateTimeFormat("cs-CZ", { weekday: "long", timeZone: "Europe/Prague" });

export function formatWorkshopDate(w: Workshop) {
  const s = new Date(w.start);
  const e = new Date(w.end);
  return {
    date: nb(dateFmt.format(s)),
    weekday: weekdayFmt.format(s),
    time: `${timeFmt.format(s)}–${timeFmt.format(e)}`,
  };
}

export function formatDayMonth(iso: string) {
  const d = new Date(iso);
  return nb(new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", timeZone: "Europe/Prague" }).format(d));
}

/** Terms explained in the interactive workshop map. */
export const WORKSHOP_TOPICS: { term: string; title: string; text: string }[] = [
  { term: "LTV", title: "Loan to Value", text: "Poměr úvěru k hodnotě nemovitosti. U investiční nemovitosti od dubna 2026 doporučeno max. 70 %, u vlastního bydlení 80 % (do 36 let 90 %). Rozhoduje odhad banky, ne kupní cena." },
  { term: "DTI", title: "Debt to Income", text: "Celkový dluh k čistému ročnímu příjmu. Pro investiční hypotéky doporučeno max. 7. Do dluhu se počítají jistiny všech úvěrů, do příjmu jen část nájmu a každá banka jinak." },
  { term: "DSTI", title: "Debt Service to Income", text: "Podíl všech splátek na čistém měsíčním příjmu. Ukazatel, který banky používají ve vlastních metodikách, i když ČNB horní hranici aktuálně nestanovuje." },
  { term: "DSCR", title: "Debt Service Coverage Ratio", text: "Kolikrát nájem pokryje splátku. U s.r.o. klíčová metrika, banky obvykle chtějí 1,2 a více. Zlepšuje ho delší splatnost, nižší LTV nebo vyšší doložitelný nájem." },
  { term: "Bonita", title: "Bonita", text: "Schopnost splácet podle metodiky konkrétní banky: typ příjmu, jeho historie, stávající závazky, počet nemovitostí. Stejný člověk vychází v každé bance jinak." },
  { term: "Zástavy", title: "Zástavní hodnota", text: "Co banka bere jako zajištění a jak ho oceňuje. Druhá nemovitost v zástavě umí snížit LTV i sazbu, křížové zástavy ale mohou celé portfolio zamknout." },
  { term: "Refinancování", title: "Refinancování", text: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět: prodloužit splatnost, přecenit nemovitost a účelově navýšit úvěr na další nákup." },
  { term: "s.r.o.", title: "Financování přes s.r.o.", text: "Investiční úvěry pro právnické osoby posuzované přes DSCR, výkazy a vlastní zdroje. Doporučení ČNB se na ně nevztahuje, banky ale mají vlastní pravidla a dražší sazby." },
  { term: "Cashflow", title: "Cashflow", text: "Nájem minus splátka, provozní náklady, rezerva na neobsazenost a daň. Záporné cashflow může být vědomá strategie, pokud ho unese příjem a máte rezervu." },
  { term: "Metodiky", title: "Bankovní metodiky", text: "Interní pravidla, podle kterých banka uznává příjmy, nájmy, paušály OSVČ nebo historii s.r.o. Právě rozdíly mezi metodikami jsou prostor, ve kterém se dá financování postavit." },
];
