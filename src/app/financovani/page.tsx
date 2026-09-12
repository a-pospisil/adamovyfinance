import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CNB_2026, EGFIN } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Financování investičních nemovitostí – investiční hypotéka, refinancování, s.r.o.",
  description:
    "Jak přemýšlím o financování: investiční hypotéka, hypotéka na investiční byt, refinancování, financování portfolia, financování přes s.r.o. a hypotéka pro podnikatele. Bez klišé, s čísly.",
  path: "/financovani",
});

type Topic = {
  id: string;
  title: string;
  accent: string;
  lead: string;
  body: string[];
  questions: string[];
  egfin: { label: string; href: string };
};

const TOPICS: Topic[] = [
  {
    id: "investicni-hypoteka",
    title: "Investiční",
    accent: "hypotéka.",
    lead: "Jiný produkt s jinými pravidly než hypotéka na bydlení. Rozhoduje, kolik z nájmu banka uzná, jak započítá stávající závazky a jaké LTV dává smysl pro další nákup.",
    body: [
      `Od ${CNB_2026.effectiveFrom} platí doporučení ČNB: LTV nejvýše ${CNB_2026.investmentLtv} % a DTI nejvýše ${CNB_2026.investmentDti} pro úvěr na třetí a další obytnou nemovitost nebo na nemovitost k pronájmu. Do počtu se počítá i družstevní podíl a nemovitost v zahraničí. Vlastních zdrojů tedy potřebujete 30 % kupní ceny, nebo zástavu jinou nemovitostí.`,
      "Maximální LTV není automaticky nejlepší LTV. Nastavuji ho podle cashflow a podle toho, co má přijít po prvním nákupu, ne podle maxima banky. Krátká fixace tam, kde plánujeme refinancování po přecenění, dlouhá tam, kde má cashflow držet bez překvapení.",
    ],
    questions: ["Kolik z budoucího nájmu banka uzná: z odhadu, nebo z daňového přiznání?", "Jak se do bonity promítne hypotéka na vlastní bydlení?", "Které LTV nechá rezervu na další nákup?"],
    egfin: { label: "Investiční hypotéka na egfin.cz", href: `${EGFIN.url}/financovani/investicni-hypoteka` },
  },
  {
    id: "hypoteka-na-investicni-byt",
    title: "Hypotéka na",
    accent: "investiční byt.",
    lead: "Byt na pronájem je matematika: kupní cena, vlastní kapitál, úvěr, nájem, splátka, rezerva. Teprve z nich vzniká strategie, ne naopak.",
    body: [
      "V regionech nese byt cashflow: nájem pokryje splátku i rezervu a portfolio roste z přebytku. V Praze a Brně bývá cashflow záporné a investor si vědomě platí růst hodnoty a amortizaci jistiny. Obě strategie jsou legitimní, pokud víte, kterou z nich děláte, a příjem měsíční dotaci bezpečně unese.",
      "Před podpisem rezervační smlouvy počítám splátku, cashflow po nákladech, DSCR a výnos na vlastní kapitál. A vždy s rezervou na šest a více splátek pro měsíce, kdy v bytě nikdo nebydlí.",
    ],
    questions: ["Cashflow, nebo capital gain? A unese to příjem?", "Kolik měsíčně po splátce, nákladech a dani?", "Jak byt zapadá do dalšího nákupu za dva roky?"],
    egfin: { label: "Hypotéka na nájemní byt na egfin.cz", href: `${EGFIN.url}/financovani/hypoteka-na-najemni-byt` },
  },
  {
    id: "refinancovani",
    title: "Refinancování",
    accent: "hypotéky.",
    lead: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět. Pasivní refix u stávající banky bývá nejdražší varianta, i když má nejnižší sazbu.",
    body: [
      "Refinancování není jen honba za sazbou. Je to prodloužení splatnosti jako nejúčinnější tlumič vyšších sazeb, přecenění nemovitosti po letech růstu a účelové navýšení úvěru, které se stane vlastními zdroji pro další nákup. Refinancování a rekonstrukce navíc nejsou předmětem přísnějšího doporučení ČNB pro nákup investiční nemovitosti.",
      "U portfolií slaďuji fixace do vln, aby se konce fixací nerozpadly do náhodných termínů, ale otevíraly prostor pro další krok.",
    ],
    questions: ["Kolik hodnoty přibylo od posledního odhadu?", "Prodloužit splatnost, nebo snížit sazbu?", "Konsolidovat k jedné bance, nebo rozložit riziko?"],
    egfin: { label: "Refinancování investičních úvěrů na egfin.cz", href: `${EGFIN.url}/financovani/refinancovani-investicnich-uveru` },
  },
  {
    id: "financovani-portfolia",
    title: "Financování",
    accent: "portfolia.",
    lead: "Od druhé nemovitosti přestává být financování o hypotékách a začíná být o systému: která nemovitost nese kterou zástavu, kde je volná bonita a v jakém pořadí kupovat.",
    body: [
      "Audit úvěrů, zástav a fixací u rostoucích portfolií běžně ukáže deset až dvacet procent skryté kapacity. Křížové zástavy umí růst zrychlit i celé portfolio zamknout; záleží na tom, komu slouží. Plán akvizic s modelem bonity říká, kolik můžete koupit letos, kolik za dva roky a co pro to udělat teď.",
      "Právě druhý a třetí nákup rozhodují, jestli za pět let vlastníte sedm jednotek, nebo jste zamčení na dvou. To je moje hlavní disciplína a stejným způsobem stavím i vlastní portfolio.",
    ],
    questions: ["Kolik kapitálu ve vašich nemovitostech spí?", "Která banka ponese pátý úvěr, když čtvrtý řekl ne?", "Kdy se vyplatí část portfolia převést na s.r.o.?"],
    egfin: { label: "Financování portfolia na egfin.cz", href: `${EGFIN.url}/financovani/financovani-portfolia-nemovitosti` },
  },
  {
    id: "financovani-pres-sro",
    title: "Financování",
    accent: "přes s.r.o.",
    lead: "Nákup na s.r.o. je u větších portfolií standard: oddělení majetku, reinvestice zisku, snazší prodej. Cenou je dražší financování a přísnější posuzování přes DSCR.",
    body: [
      "Doporučení ČNB se na úvěry právnickým osobám nevztahuje. Banka se ale u firmy dívá na výkazy, historii a ručení: jiná pravidla, jiná příprava, jiné banky. Investiční úvěr dostane i nově založené s.r.o., rozhoduje kvalita projektu, vlastní zdroje a DSCR z doložitelných nájmů.",
      "Bod zlomu, kdy se s.r.o. vyplatí, počítám na konkrétních číslech: daně, sazby, cashflow, časový test i exit. Rozhodnutí je matematika, ne dogma.",
    ],
    questions: ["Fyzická osoba, nebo s.r.o.: kde je bod zlomu u vás?", "Vklad, nebo půjčka společníka?", "Jaké DSCR banka požaduje a jak ho zlepšit?"],
    egfin: { label: "Financování přes s.r.o. na egfin.cz", href: `${EGFIN.url}/financovani/financovani-pres-sro` },
  },
  {
    id: "hypoteka-pro-podnikatele",
    title: "Hypotéka pro",
    accent: "podnikatele a OSVČ.",
    lead: "Paušál, optimalizace nebo krátká historie s.r.o. jsou pro většinu bank problém. Pro mě konkrétní zadání: která metodika dokáže uznat vaše reálné příjmy.",
    body: [
      "Každá banka počítá příjmy z podnikání jinak: z daňového přiznání, z obratu, z podílu na zisku, s různými koeficienty. Stejný podnikatel vychází v jedné bance na úvěr o miliony vyšší než v jiné. Žádost proto stavím podle metodiky konkrétní banky, ne podle formuláře na přepážce.",
    ],
    questions: ["Které příjmy banka uzná a v jaké výši?", "Jak zapracovat nájmy a podíly na zisku?", "Kdy dává smysl počkat na další daňové přiznání?"],
    egfin: { label: "Hypotéka pro podnikatele a OSVČ na egfin.cz", href: `${EGFIN.url}/financovani/hypoteka-pro-podnikatele-a-osvc` },
  },
  {
    id: "hypoteka-na-bydleni",
    title: "Hypotéka na",
    accent: "vlastní bydlení.",
    lead: "I první bydlení je začátek portfolia. Úvěr, který dnes podepíšete, bude banka počítat do každé další žádosti.",
    body: [
      `Pro vlastní bydlení platí LTV až ${CNB_2026.ownHomeLtv} %, pro žadatele do 36 let až ${CNB_2026.ownHomeLtvUnder36} %. Fixaci, splatnost a zástavu nastavuji s ohledem na to, co má přijít za tři nebo pět let: první investiční byt, refinancování, uvolnění kapitálu. Hypotéka na bydlení není finále, je to první krok řady.`,
    ],
    questions: ["Jaká splatnost nechá bonitu na další úvěr?", "Kdy se vyplatí kratší fixace?", "Jak bydlení později poslouží jako zástava?"],
    egfin: { label: "Hypotéka na bydlení na egfin.cz", href: `${EGFIN.url}/hypoteka-na-vlastni-bydleni` },
  },
];

const FAQ = [
  { q: "Kolik stojí vaše služby?", a: "Pro klienty je zprostředkování hypotéky a investičních úvěrů ve většině případů zdarma, odměnu vyplácí banka jako provizi. Pokud by konkrétní struktura znamenala přímou platbu, například u nebankovního nebo developerského financování, dozvíte se to předem, písemně a s přesnou částkou." },
  { q: "Čím se lišíte od běžného hypotečního poradce?", a: "Specializací a vlastní zkušeností. Neřeším pojištění ani rodinné finance. Dělám financování investičních nemovitostí, znám metodiky čtrnácti bank do detailu a stejné strategie používám na vlastním portfoliu od roku 2022." },
  { q: "Jaké LTV dostanu na investiční nemovitost?", a: `Od dubna 2026 ČNB doporučuje pro nákup investiční nemovitosti LTV nejvýše ${CNB_2026.investmentLtv} % a DTI ${CNB_2026.investmentDti}. Konkrétní číslo záleží na typu nemovitosti, příjmech, dalších zástavách a struktuře. Refinancování a rekonstrukce pod přísnější doporučení nespadají.` },
  { q: "Započítá banka nájem do příjmů?", a: "Většina ano, ale každá jinak: z odhadu nebo z daňového přiznání, v rozsahu od nuly po celý nájem. Právě tento rozdíl často rozhoduje o tom, zda další úvěr projde." },
  { q: "Mám jen jeden byt na investici. Jsem malý klient?", a: "Ne. Většina klientů začínala jedním bytem. Právě u prvních nákupů se rozhoduje, jestli portfolio poroste, nebo se zamkne na dvou jednotkách." },
  { q: "Funguje spolupráce online?", a: "Ano. Většinu financování řeším na dálku přes telefon a Google Meet, podklady se předávají elektronicky. Osobní schůzka v Praze je možná po domluvě." },
];

export default function FinancingPage() {
  return (
    <main>
      <JsonLd data={[breadcrumbSchema([{ name: "Financování", path: "/financovani" }]), faqSchema(FAQ)]} />

      <PageHero
        eyebrow="Financování investičních nemovitostí"
        title={
          <>
            Hypotéka není produkt. <span className="serif-accent text-moss-300">Je to nástroj.</span>
          </>
        }
        lead={
          <p>
            Jak přemýšlím o investiční hypotéce, refinancování, financování portfolia, s.r.o. a příjmech
            podnikatelů. Ne katalog služeb, ale způsob uvažování, se kterým každý úvěr počítá s tím dalším.
          </p>
        }
        aside={
          <nav aria-label="Témata na této stránce" className="border-t border-(--line)">
            {TOPICS.map((t, i) => (
              <a key={t.id} href={`#${t.id}`} className="group flex items-baseline justify-between gap-4 border-b border-(--line) py-3 text-[0.95rem] transition-colors hover:text-moss-300">
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.65rem] text-sand">0{i + 1}</span>
                  {t.title} {t.accent}
                </span>
                <span aria-hidden="true" className="text-sand transition-transform group-hover:translate-y-0.5">↓</span>
              </a>
            ))}
          </nav>
        }
      />

      {TOPICS.map((t, i) => (
        <Section key={t.id} id={t.id} theme={i % 2 === 0 ? "light" : "dark"} as="article" ariaLabelledby={`${t.id}-title`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <Eyebrow index={`0${i + 1}`}>Téma</Eyebrow>
              <h2 id={`${t.id}-title`} className="display display-md mt-6">
                {t.title} <span className="serif-accent text-(--accent)">{t.accent}</span>
              </h2>
              <p className="lead mt-6 max-w-md text-(--muted)">{t.lead}</p>
            </Reveal>
            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
              <div className="space-y-5 leading-relaxed">
                {t.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <p className="mono-label mt-8 text-(--accent)">Na co se ptám</p>
              <ul className="mt-3 divide-y divide-(--line) border-y border-(--line)">
                {t.questions.map((qn) => (
                  <li key={qn} className="py-3 text-[0.95rem]">{qn}</li>
                ))}
              </ul>
              <a href={t.egfin.href} rel="noopener" className="group mt-6 inline-flex items-center gap-2 text-[0.9rem] text-(--muted) transition-colors hover:text-(--fg)">
                Jak to řešíme v Evergreen Finance: {t.egfin.label}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </Reveal>
          </div>
        </Section>
      ))}

      <Section theme="dark" ariaLabelledby="ffaq-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="08">Otázky</Eyebrow>
            <h2 id="ffaq-title" className="display display-md mt-6">
              Na co se investoři <span className="serif-accent text-moss-300">ptají nejčastěji.</span>
            </h2>
            <div className="mt-8">
              <Button href="/kontakt" magnetic>Probrat mé financování</Button>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <dl className="divide-y divide-(--line) border-y border-(--line)">
              {FAQ.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="text-[1.1rem] font-medium">{f.q}</dt>
                  <dd className="mt-2 max-w-2xl text-sand">{f.a}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
