import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Guilloche } from "@/components/engraving/Engraving";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CNB_2026, EGFIN } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Financování investičních nemovitostí – investiční hypotéka, refinancování, s.r.o.",
  description:
    "Jak přemýšlím o financování: investiční hypotéka, hypotéka na investiční byt, refinancování, financování portfolia, financování přes s.r.o. a hypotéka pro podnikatele.",
  path: "/financovani",
});

type Topic = {
  id: string;
  title: string;
  lead: string;
  body: string;
  questions: string[];
  egfin: { label: string; href: string };
};

const TOPICS: Topic[] = [
  {
    id: "investicni-hypoteka",
    title: "Investiční hypotéka",
    lead: "Jiný produkt s jinými pravidly než hypotéka na bydlení.",
    body: `Od ${CNB_2026.effectiveFrom} platí doporučení ČNB: LTV nejvýše ${CNB_2026.investmentLtv} % a DTI nejvýše ${CNB_2026.investmentDti} pro úvěr na třetí a další obytnou nemovitost nebo na nemovitost k pronájmu. Maximální LTV přitom není automaticky nejlepší LTV — nastavuji ho podle cashflow a podle toho, co má přijít po prvním nákupu.`,
    questions: [
      "Kolik z budoucího nájmu banka uzná: z odhadu, nebo z daňového přiznání?",
      "Jak se do bonity promítne hypotéka na vlastní bydlení?",
      "Které LTV nechá rezervu na další nákup?",
    ],
    egfin: { label: "Investiční hypotéka", href: `${EGFIN.url}/financovani/investicni-hypoteka` },
  },
  {
    id: "hypoteka-na-investicni-byt",
    title: "Hypotéka na investiční byt",
    lead: "Byt na pronájem je matematika, ne pocit.",
    body: "V regionech nese byt cashflow: nájem pokryje splátku i rezervu. V Praze a Brně bývá cashflow záporné a investor si vědomě platí růst hodnoty a amortizaci jistiny. Obě strategie jsou legitimní, pokud víte, kterou z nich děláte a příjem měsíční dotaci unese.",
    questions: [
      "Cashflow, nebo capital gain? A unese to příjem?",
      "Kolik zbyde měsíčně po splátce, nákladech a dani?",
      "Jak byt zapadá do dalšího nákupu za dva roky?",
    ],
    egfin: { label: "Hypotéka na nájemní byt", href: `${EGFIN.url}/financovani/hypoteka-na-najemni-byt` },
  },
  {
    id: "refinancovani",
    title: "Refinancování",
    lead: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět.",
    body: "Refinancování není honba za sazbou. Je to prodloužení splatnosti jako nejúčinnější tlumič vyšších sazeb, přecenění nemovitosti po letech růstu a účelové navýšení, které se stane vlastními zdroji na další nákup. Refinancování ani rekonstrukce nespadají pod přísnější doporučení pro nákup.",
    questions: [
      "Kolik hodnoty přibylo od posledního odhadu?",
      "Prodloužit splatnost, nebo snížit sazbu?",
      "Konsolidovat k jedné bance, nebo rozložit riziko?",
    ],
    egfin: { label: "Refinancování investičních úvěrů", href: `${EGFIN.url}/financovani/refinancovani-investicnich-uveru` },
  },
  {
    id: "financovani-portfolia",
    title: "Financování portfolia",
    lead: "Od druhé nemovitosti jde o systém, ne o jednotlivé hypotéky.",
    body: "Audit úvěrů, zástav a fixací u rostoucích portfolií běžně ukáže deset až dvacet procent skryté kapacity. Křížové zástavy umí růst zrychlit i celé portfolio zamknout. Právě druhý a třetí nákup rozhodují, jestli za pět let vlastníte sedm jednotek, nebo jste zamčení na dvou.",
    questions: [
      "Kolik kapitálu ve vašich nemovitostech spí?",
      "Která banka ponese pátý úvěr, když čtvrtý řekl ne?",
      "Kdy se vyplatí část portfolia převést na s.r.o.?",
    ],
    egfin: { label: "Financování portfolia", href: `${EGFIN.url}/financovani/financovani-portfolia-nemovitosti` },
  },
  {
    id: "financovani-pres-sro",
    title: "Financování přes s.r.o.",
    lead: "U větších portfolií standard, ne daňový trik.",
    body: "Doporučení ČNB se na úvěry právnickým osobám nevztahuje. Banka se ale u firmy dívá na výkazy, historii a ručení: jiná pravidla, jiná příprava, jiné banky. Investiční úvěr dostane i nově založené s.r.o., rozhoduje kvalita projektu, vlastní zdroje a DSCR z doložitelných nájmů.",
    questions: [
      "Fyzická osoba, nebo s.r.o.: kde je bod zlomu u vás?",
      "Vklad, nebo půjčka společníka?",
      "Jaké DSCR banka požaduje a jak ho zlepšit?",
    ],
    egfin: { label: "Financování přes s.r.o.", href: `${EGFIN.url}/financovani/financovani-pres-sro` },
  },
  {
    id: "hypoteka-pro-podnikatele",
    title: "Hypotéka pro podnikatele a OSVČ",
    lead: "Paušál a optimalizace jsou pro většinu bank problém. Pro mě zadání.",
    body: "Každá banka počítá příjmy z podnikání jinak: z daňového přiznání, z obratu, z podílu na zisku, s různými koeficienty. Stejný podnikatel vychází v jedné bance na úvěr o miliony vyšší než v jiné. Žádost proto stavím podle metodiky konkrétní banky, ne podle formuláře na přepážce.",
    questions: [
      "Které příjmy banka uzná a v jaké výši?",
      "Jak zapracovat nájmy a podíly na zisku?",
      "Kdy dává smysl počkat na další daňové přiznání?",
    ],
    egfin: { label: "Hypotéka pro podnikatele a OSVČ", href: `${EGFIN.url}/financovani/hypoteka-pro-podnikatele-a-osvc` },
  },
  {
    id: "hypoteka-na-bydleni",
    title: "Hypotéka na vlastní bydlení",
    lead: "I první bydlení je začátek portfolia.",
    body: `Pro vlastní bydlení platí LTV až ${CNB_2026.ownHomeLtv} %, pro žadatele do 36 let až ${CNB_2026.ownHomeLtvUnder36} %. Fixaci, splatnost a zástavu nastavuji s ohledem na to, co má přijít za tři nebo pět let: první investiční byt, refinancování, uvolnění kapitálu.`,
    questions: [
      "Jaká splatnost nechá bonitu na další úvěr?",
      "Kdy se vyplatí kratší fixace?",
      "Jak bydlení později poslouží jako zástava?",
    ],
    egfin: { label: "Hypotéka na bydlení", href: `${EGFIN.url}/hypoteka-na-vlastni-bydleni` },
  },
];

const FAQ = [
  {
    q: "Kolik stojí vaše služby?",
    a: "Pro klienty je zprostředkování hypotéky a investičních úvěrů ve většině případů zdarma, odměnu vyplácí banka jako provizi. Pokud by konkrétní struktura znamenala přímou platbu, například u nebankovního nebo developerského financování, dozvíte se to předem, písemně a s přesnou částkou.",
  },
  {
    q: "Čím se lišíte od běžného hypotečního poradce?",
    a: "Specializací a vlastní zkušeností. Neřeším pojištění ani rodinné finance. Dělám financování investičních nemovitostí, znám metodiky čtrnácti bank do detailu a stejné strategie používám na vlastním portfoliu od roku 2022.",
  },
  {
    q: "Jaké LTV dostanu na investiční nemovitost?",
    a: `Od dubna 2026 ČNB doporučuje pro nákup investiční nemovitosti LTV nejvýše ${CNB_2026.investmentLtv} % a DTI ${CNB_2026.investmentDti}. Konkrétní číslo záleží na typu nemovitosti, příjmech, dalších zástavách a struktuře. Refinancování a rekonstrukce pod přísnější doporučení nespadají.`,
  },
  {
    q: "Započítá banka nájem do příjmů?",
    a: "Většina ano, ale každá jinak: z odhadu nebo z daňového přiznání, v rozsahu od nuly po celý nájem. Právě tento rozdíl často rozhoduje o tom, zda další úvěr projde.",
  },
  {
    q: "Mám jen jeden byt na investici. Jsem malý klient?",
    a: "Ne. Většina klientů začínala jedním bytem. Právě u prvních nákupů se rozhoduje, jestli portfolio poroste, nebo se zamkne na dvou jednotkách.",
  },
];

export default function FinancingPage() {
  return (
    <main>
      <JsonLd data={[breadcrumbSchema([{ name: "Financování", path: "/financovani" }]), faqSchema(FAQ)]} />

      <PageHero
        label="Financování investičních nemovitostí"
        numeral="02"
        title={
          <>
            Hypotéka není produkt. <span className="italic-accent text-burgundy">Je to nástroj.</span>
          </>
        }
        lead={
          <p>
            Sedm situací, se kterými za mnou investoři chodí. Ne katalog služeb, ale způsob uvažování, ve kterém každý
            úvěr počítá s tím dalším.
          </p>
        }
      />

      <Section theme="paper" ariaLabelledby="topics-title" className="border-t border-(--line)">
        <h2 id="topics-title" className="sr-only">
          Oblasti financování
        </h2>
        <ol className="border-t border-(--line-strong)">
          {TOPICS.map((t, i) => (
            <Reveal
              as="li"
              key={t.id}
              id={t.id}
              delay={(i % 3) * 60}
              className="grid gap-6 border-b border-(--line) py-10 lg:grid-cols-12 lg:gap-10 lg:py-14"
            >
              <div className="lg:col-span-5">
                <span className="label-sm tabular text-(--accent)">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display display-md mt-4">{t.title}</h3>
                <p className="mt-4 max-w-sm text-[1.05rem] text-(--muted)">{t.lead}</p>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="max-w-xl leading-relaxed">{t.body}</p>
                <ul className="mt-7 border-t border-(--line)">
                  {t.questions.map((q) => (
                    <li key={q} className="border-b border-(--line) py-2.5 text-[0.95rem] text-(--muted)">
                      {q}
                    </li>
                  ))}
                </ul>
                <a
                  href={t.egfin.href}
                  rel="noopener"
                  className="label-xs mt-5 inline-block border-b border-(--line-strong) pb-0.5 transition-colors hover:border-(--accent) hover:text-(--accent)"
                >
                  {t.egfin.label} na egfin.cz
                </a>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section theme="ink" ariaLabelledby="faq-title" className="overflow-hidden">
        <Guilloche className="pointer-events-none absolute -right-32 top-10 size-[30rem]" tone="gold" opacity={0.12} />
        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="08">Otázky</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="faq-title" className="display display-md mt-10 max-w-[12ch]">
                Na co se investoři <span className="italic-accent text-gold-300">ptají nejčastěji.</span>
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-10">
              <Button href="/kontakt" variant="outline">
                Probrat mé financování
              </Button>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={100}>
            <dl className="border-t border-(--line)">
              {FAQ.map((f) => (
                <div key={f.q} className="border-b border-(--line) py-6">
                  <dt className="display display-sm">{f.q}</dt>
                  <dd className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-(--muted)">{f.a}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
