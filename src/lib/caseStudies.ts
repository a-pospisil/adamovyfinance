import { EGFIN } from "@/lib/site";

export type CaseStudy = {
  slug: string;
  region: string;
  title: string;
  metrics: { label: string; value: string }[];
  problem: string;
  decision: string;
  structure: string;
  result: string;
  lesson: string;
  sourceUrl: string;
};

/**
 * Anonymised client cases from Adam's team. Numbers are real and rounded,
 * identities changed. Full versions with bank names live on egfin.cz.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "praha-capital-gain",
    region: "Praha · první investiční byt",
    title: "Záporné cashflow jako vědomá strategie",
    metrics: [
      { label: "Cashflow", value: "−14 500 Kč / měs." },
      { label: "Amortizace jistiny", value: "+8 000 Kč / měs." },
      { label: "Celkový výnos na kapitál", value: "≈ 12,6 % p.a." },
      { label: "LTV / fixace", value: "80 % / 3 roky" },
    ],
    problem:
      "IT manažerka (38 let, čistý příjem 96 tis. Kč) chtěla první investiční byt: 2+kk 54 m² ve Vršovicích za 7,9 mil. Kč s tržním nájmem 21 500 Kč. Hrubý výnos 3,3 % znamená, že nájem splátku nepokryje. Dvě banky jí záměr rozmluvily jako ztrátový.",
    decision:
      "Spočítat celkovou návratnost, ne jen cashflow. Splátka 32 700 Kč obsahuje od první splátky zhruba 8 000 Kč amortizace a lokalita při konzervativním růstu 4 % p.a. přidává na hodnotě. Záporné cashflow je cena za pozici na trhu, kterou příjem bezpečně unese.",
    structure:
      "Banka, která uznává 70 % budoucího nájmu z odhadu. LTV 80 %, aby zbylá hotovost zůstala jako rezerva a základ druhého nákupu. Sazba 4,69 %, splatnost 30 let, fixace 3 roky kvůli plánovanému refinancování po přecenění.",
    result:
      "Roční bilance: cashflow −174 tis. Kč, amortizace +96 tis. Kč, zhodnocení při 4 % ≈ +316 tis. Kč. Celkem ≈ +239 tis. Kč ročně na vloženém kapitálu 1,9 mil. Kč, tedy výnos přibližně 12,6 % p.a. Plán: refixace za 3 roky, přecenění a příprava druhého bytu.",
    lesson:
      "Cashflow strategie a capital gain strategie jsou dva různé nástroje. Profesionál je nemíchá náhodou, ale podle cíle. Podmínkou je, že měsíční dotaci unese příjem a existuje rezerva na 6 a více splátek.",
    sourceUrl: `${EGFIN.url}/pripadove-studie/investicni-byt-praha-capital-gain`,
  },
  {
    slug: "refinancovani-portfolia",
    region: "Regiony · portfolio 3 bytů",
    title: "Konec levných fixací otevřel cestu ke čtvrtému bytu",
    metrics: [
      { label: "Cashflow po akci", value: "+5 000 Kč / měs." },
      { label: "Jednotky", value: "3 → 4" },
      { label: "LTV portfolia", value: "52 %" },
      { label: "Nová hotovost klienta", value: "jen 400 tis. Kč" },
    ],
    problem:
      "OSVČ ze stavebnictví (45 let) koupil v letech 2019–2021 tři byty v Kladně a Mostě: hodnota 11,4 mil. Kč, úvěry 5,1 mil. Kč, nájmy 37 400 Kč. Dvěma úvěrům končily fixace 2,9 % a nové sazby kolem 5,3 % by zvedly splátky o zhruba 4 200 Kč měsíčně. Cashflow by zůstalo těsně kladné, ale bonita by zablokovala jakýkoli další nákup.",
    decision:
      "Místo pasivního refixu u stávajících bank portfolio přestavět: všechny tři úvěry konsolidovat k jedné bance s novou splatností 30 let a součástí refinancování udělat účelové navýšení proti nárůstu hodnoty.",
    structure:
      "Jeden úvěr 7,15 mil. Kč, sazba 4,89 %, fixace 5 let, splatnost 30 let, včetně účelového navýšení o 2,05 mil. Kč. Navýšení plus 400 tis. Kč hotovosti financovalo čtvrtý byt 2+1 v Chomutově za 2,45 mil. Kč s nájmem 13 500 Kč (hrubý výnos 6,6 %).",
    result:
      "Čtyři jednotky v hodnotě 13,85 mil. Kč, jediný úvěr 7,15 mil. Kč (LTV 52 %), splátka 37 900 Kč proti nájmům 50 900 Kč. Cashflow +5 000 Kč měsíčně i po započtení provozních rezerv. Jedna banka, jedna splátka, jeden termín fixace a prostor pro pátou jednotku.",
    lesson:
      "Konec fixace není hrozba, ale jediný moment, kdy jde portfolio levně přestavět. Prodloužení splatnosti často zachrání cashflow spolehlivěji než honba za nejnižší sazbou.",
    sourceUrl: `${EGFIN.url}/pripadove-studie/refinancovani-portfolia-ctvrty-byt`,
  },
  {
    slug: "bytovy-dum-sro",
    region: "Kolín · bytový dům přes s.r.o.",
    title: "Zanedbaný dům se 6 byty: +5,4 mil. Kč za 14 měsíců",
    metrics: [
      { label: "Hodnota", value: "14,2 → 19,6 mil. Kč" },
      { label: "Nájmy", value: "62 → 96 tis. Kč / měs." },
      { label: "DSCR po stabilizaci", value: "1,39" },
      { label: "Vráceno z refinancování", value: "2,7 mil. Kč" },
    ],
    problem:
      "Dva společníci se s.r.o. (dvouletá historie, správa dvou menších nemovitostí) našli v Kolíně zanedbaný dům se 6 byty za 14,2 mil. Kč. Dvě jednotky prázdné, zbytek se starými smlouvami a nájmy jen 62 tis. Kč měsíčně. Banka při standardním posouzení viděla slabé výnosové ocenění a nízké DSCR, ne potenciál po rekonstrukci.",
    decision:
      "Postavit žádost na stabilizovaném stavu, ne na dnešku: podložený rozpočet rekonstrukce 1,8 mil. Kč, tržní srovnání nájmů v Kolíně a harmonogram obsazení.",
    structure:
      "Investiční úvěr pro s.r.o. na 65 % kupní ceny (5,39 %, splatnost 25 let) plus rekonstrukční tranže čerpaná na etapy proti fakturám. Po 9 měsících rekonstrukce a přeobsazení nájmy 96 tis. Kč, nové výnosové ocenění 19,6 mil. Kč a druhý krok: refinancování na 70 % nové hodnoty u jiné banky.",
    result:
      "Refinancování splatilo původní úvěr i rekonstrukci a vrátilo společníkům 2,7 mil. Kč hotovosti na další projekt. Dům nese nájmy 96 tis. Kč proti splátce 56 tis. Kč, DSCR 1,39. Vytvořená hodnota +5,4 mil. Kč za 14 měsíců.",
    lesson:
      "U výnosových nemovitostí se hodnota nekupuje, ale vyrábí: každá koruna měsíčního nájmu navíc znamená při výnosovém ocenění zhruba 200 Kč hodnoty. Klíčem je banka, která umí číst stabilizovaný stav.",
    sourceUrl: `${EGFIN.url}/pripadove-studie/bytovy-dum-sro-rekonstrukce`,
  },
];

/** Shorter cases Adam uses on workshops (numbers as published, identities changed). */
export const WORKSHOP_CASES = [
  {
    title: "Stejná banka, o 4 miliony víc",
    who: "Petr H., 45 let, Praha",
    metrics: [
      { label: "Vyšší úvěr", value: "+4 mil. Kč" },
      { label: "Banka, stejná před i po", value: "1" },
      { label: "Náklady počítané dvakrát", value: "2×" },
    ],
    problem: "Klient žádal o investiční hypotéku. Banka mu příjem z nájmu počítala z daňového přiznání a úvěr vyšel o čtyři miliony níž, než potřeboval.",
    change: "Z nákladů se odstranily ty, které banka počítala dvakrát. Metodika to umožňuje, na přepážce ji ale nikdo nenabídne.",
    result: "O 4 miliony korun vyšší úvěr. Stejný klient, stejný příjem, stejná banka.",
  },
  {
    title: "Podnikatel, kterému banky říkaly ne",
    who: "Investor s portfoliem nemovitostí",
    metrics: [
      { label: "Nové hypotéky", value: "30 mil. Kč" },
      { label: "Šance podle bank na začátku", value: "0 %" },
      { label: "Klíčové změny ve struktuře", value: "2" },
    ],
    problem: "Banky ho opakovaně odmítaly. Standardní způsob dokládání příjmů na další úvěr nestačil.",
    change: "Alternativní způsob dokládání bonity a optimalizace celého portfolia: zástavy, příjmy, výdaje i celková struktura.",
    result: "30 milionů korun v nových hypotékách, optimalizované portfolio a silnější pozice vůči bankám do budoucna.",
  },
] as const;
