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
  title: "Financování investičních nemovitostí",
  description:
    "Investiční hypotéka, hypotéka na investiční byt, refinancování, financování portfolia, nákup přes s.r.o. a hypotéka pro OSVČ. Přehled oblastí, ve kterých Adam Pospíšil pracuje s investory.",
  path: "/financovani",
});

/**
 * Stránka je záměrně krátká: rozcestník, který drží klíčová slova a vede
 * na podrobné stránky Evergreen Finance. Odborný obsah patří tam, ne sem.
 */
type Topic = {
  id: string;
  title: string;
  lead: string;
  egfin: string;
};

const TOPICS: Topic[] = [
  {
    id: "investicni-hypoteka",
    title: "Investiční hypotéka",
    lead: "Jiný produkt s jinými pravidly než hypotéka na bydlení.",
    egfin: `${EGFIN.url}/financovani/investicni-hypoteka`,
  },
  {
    id: "hypoteka-na-investicni-byt",
    title: "Hypotéka na investiční byt",
    lead: "Byt na pronájem je matematika, ne pocit.",
    egfin: `${EGFIN.url}/financovani/hypoteka-na-najemni-byt`,
  },
  {
    id: "refinancovani",
    title: "Refinancování investičních úvěrů",
    lead: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět.",
    egfin: `${EGFIN.url}/financovani/refinancovani-investicnich-uveru`,
  },
  {
    id: "financovani-portfolia",
    title: "Financování portfolia nemovitostí",
    lead: "Od druhé nemovitosti jde o systém, ne o jednotlivé hypotéky.",
    egfin: `${EGFIN.url}/financovani/financovani-portfolia-nemovitosti`,
  },
  {
    id: "financovani-pres-sro",
    title: "Financování přes s.r.o.",
    lead: "U větších portfolií standard, ne daňový trik.",
    egfin: `${EGFIN.url}/financovani/financovani-pres-sro`,
  },
  {
    id: "hypoteka-pro-podnikatele",
    title: "Hypotéka pro podnikatele a OSVČ",
    lead: "Paušál a optimalizace jsou pro většinu bank problém. Pro mě zadání.",
    egfin: `${EGFIN.url}/financovani/hypoteka-pro-podnikatele-a-osvc`,
  },
  {
    id: "hypoteka-na-bydleni",
    title: "Hypotéka na vlastní bydlení",
    lead: "I první bydlení je začátek portfolia.",
    egfin: `${EGFIN.url}/hypoteka-na-vlastni-bydleni`,
  },
];

const FAQ = [
  {
    q: "Kolik stojí vaše služby?",
    a: "Zprostředkování hypotéky a investičních úvěrů je pro klienty ve většině případů zdarma, odměnu vyplácí banka. Pokud by konkrétní struktura znamenala přímou platbu, dozvíte se to předem, písemně a s přesnou částkou.",
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
        label="Investiční hypotéky · refinancování · portfolio"
        numeral="02"
        title={
          <>
            Financování investičních nemovitostí,{" "}
            <span className="italic-accent text-burgundy">od prvního bytu po portfolio.</span>
          </>
        }
        lead={
          <p>
            Sedm oblastí, ve kterých s investory pracuji. Tady jen přehled — každou mám podrobně rozepsanou na{" "}
            <a href={EGFIN.url} className="underline decoration-(--line-strong) underline-offset-4 hover:decoration-burgundy" target="_blank" rel="noopener noreferrer">
              Evergreen Finance
            </a>
            .
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
              className="grid gap-2 border-b border-(--line) py-7 lg:grid-cols-12 lg:items-baseline lg:gap-8"
            >
              <span className="label-sm tabular text-(--accent) lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display display-sm lg:col-span-4">{t.title}</h3>
              <p className="text-(--muted) lg:col-span-4">{t.lead}</p>
              <a
                href={t.egfin}
                className="label-xs tap mt-2 inline-block justify-self-start whitespace-nowrap border-b border-(--line-strong) pb-0.5 transition-colors hover:border-(--accent) hover:text-(--accent) lg:col-span-3 lg:mt-0 lg:justify-self-end" target="_blank" rel="noopener noreferrer">
                Podrobně na egfin.cz
              </a>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section theme="ink" ariaLabelledby="faq-title" className="overflow-hidden">
        <Guilloche className="pointer-events-none absolute -right-32 top-10 size-[30rem]" opacity={0.12} />
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
