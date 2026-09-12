import type { Metadata } from "next";
import { InvestmentCalculator } from "@/components/tools/InvestmentCalculator";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { EGFIN } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Nástroje – kalkulačka investiční hypotéky, LTV, cashflow, DSCR",
  description:
    "Kalkulačka financování investičního bytu: úvěr, vlastní zdroje, splátka, cashflow, DSCR a výnos na vlastní kapitál. Plus kalkulačky Evergreen Finance.",
  path: "/nastroje",
});

const EGFIN_TOOLS = [
  { name: "Cashflow pronájmu", text: "Kolik byt měsíčně vydělá po splátce, nákladech a dani.", href: EGFIN.calculators },
  { name: "Investiční hypotéka", text: "Splátka, LTV a minimální nájem pro zdravé DSCR.", href: EGFIN.calculators },
  { name: "Refinancování", text: "Kolik ušetříte na sazbě a kolik kapitálu uvolníte.", href: EGFIN.calculators },
  { name: "Maximální úvěr a LTV", text: "Kolik si reálně půjčíte podle příjmu a hodnoty nemovitosti.", href: EGFIN.calculators },
  { name: "Splátkový kalendář", text: "Anuitní splácení po měsících včetně exportu do Excelu.", href: EGFIN.calculators },
  { name: "Analýza portfolia", text: "Jeden formulář, do 48 pracovních hodin návrh struktury financování.", href: EGFIN.portfolioAnalysis },
];

export default function ToolsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Nástroje", path: "/nastroje" }])} />

      <PageHero
        label="Moje nástroje"
        numeral="06"
        title={
          <>
            Spočítejte si to <span className="italic-accent text-burgundy">dřív než banka.</span>
          </>
        }
        lead={
          <p>
            Kalkulačka investičního bytu, kterou používám při prvním odhadu: úvěr, vlastní zdroje, splátka, cashflow,
            DSCR a výnos na vlastní kapitál. Bez e-mailu, bez chytáků.
          </p>
        }
      />

      <Section theme="paper" ariaLabelledby="calc-title" className="border-t border-(--line)">
        <Reveal>
          <SectionMark index="01">Kalkulačka investiční hypotéky</SectionMark>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="calc-title" className="display display-md mt-10 max-w-[16ch]">
            Cena, LTV, nájem. <span className="italic-accent text-burgundy">A co z toho zbyde.</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <InvestmentCalculator />
        </Reveal>
      </Section>

      <Section theme="ink" ariaLabelledby="egtools-title">
        <Reveal>
          <SectionMark index="02">Kalkulačky Evergreen Finance</SectionMark>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="egtools-title" className="display display-md mt-10 max-w-[16ch]">
            Šest kalkulaček, <span className="italic-accent text-gold-300">které používá i můj tým.</span>
          </h2>
        </Reveal>
        <ol className="mt-12 border-t border-(--line)">
          {EGFIN_TOOLS.map((t, i) => (
            <Reveal as="li" key={t.name} delay={(i % 3) * 60} className="border-b border-(--line)">
              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-2 py-6 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <span className="label-xs tabular text-(--accent) md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="display display-sm md:col-span-4">{t.name}</span>
                <span className="text-[0.95rem] text-(--muted) md:col-span-6">{t.text}</span>
                <span aria-hidden="true" className="label-xs md:col-span-1 md:text-right">
                  egfin.cz
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section theme="paper" ariaLabelledby="tools-cta-title" className="border-t border-(--line)">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="tools-cta-title" className="display display-md max-w-[16ch]">
              Kalkulačka řekne kolik. <span className="italic-accent text-burgundy">Banka řekne jestli.</span>
            </h2>
            <p className="mt-5 max-w-xl text-(--muted)">
              Mezi tím je metodika: uznání nájmu, DTI, zástavy, pořadí kroků. Pošlete mi svá čísla a řeknu vám, jak je
              banka uvidí.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button href="/kontakt">Probrat financování</Button>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
