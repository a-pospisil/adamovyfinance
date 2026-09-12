import type { Metadata } from "next";
import { InvestmentCalculator } from "@/components/tools/InvestmentCalculator";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { EGFIN } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Nástroje – kalkulačka investiční hypotéky, LTV, cashflow, DSCR",
  description:
    "Kalkulačka financování investičního bytu: úvěr, vlastní zdroje, splátka, cashflow, DSCR a výnos na vlastní kapitál. Plus kalkulačky Evergreen Finance a analýza portfolia zdarma.",
  path: "/nastroje",
});

const EGFIN_TOOLS = [
  { name: "Cashflow pronájmu", text: "Kolik vám byt měsíčně vydělá po splátce, nákladech a dani.", href: EGFIN.calculators },
  { name: "Investiční hypotéka", text: "Splátka, LTV a minimální nájem pro zdravé DSCR.", href: EGFIN.calculators },
  { name: "Refinancování", text: "Kolik ušetříte na sazbě a kolik kapitálu můžete uvolnit.", href: EGFIN.calculators },
  { name: "Maximální úvěr a LTV", text: "Kolik si reálně půjčíte podle příjmu a hodnoty nemovitosti.", href: EGFIN.calculators },
  { name: "Splátkový kalendář", text: "Anuitní splácení po měsících včetně exportu do Excelu.", href: EGFIN.calculators },
  { name: "Analýza portfolia zdarma", text: "Jeden formulář, do 48 pracovních hodin návrh struktury financování.", href: EGFIN.portfolioAnalysis },
];

export default function ToolsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Nástroje", path: "/nastroje" }])} />

      <PageHero
        eyebrow="Moje nástroje"
        title={
          <>
            Spočítejte si to <span className="serif-accent text-moss-300">dřív než banka.</span>
          </>
        }
        lead={
          <p>
            Kalkulačka investičního bytu, kterou používám při prvním odhadu: úvěr, vlastní zdroje, splátka, cashflow,
            DSCR a výnos na vlastní kapitál. Bez e-mailu, bez chytáků. Výsledky s interpretací, ne jen čísla.
          </p>
        }
      />

      <Section theme="light" padded={false} className="pb-24 pt-4 lg:pb-32" ariaLabelledby="calc-title">
        <Reveal>
          <Eyebrow index="01">Kalkulačka investiční hypotéky</Eyebrow>
          <h2 id="calc-title" className="display display-md mt-6">
            Cena, LTV, nájem. <span className="serif-accent text-(--accent)">A co z toho zbyde.</span>
          </h2>
        </Reveal>
        <div className="mt-10">
          <InvestmentCalculator />
        </div>
      </Section>

      <Section theme="dark" ariaLabelledby="egtools-title">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="02">Kalkulačky Evergreen Finance</Eyebrow>
            <h2 id="egtools-title" className="display display-md mt-6">
              Šest kalkulaček, <span className="serif-accent text-moss-300">které používá i můj tým.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[0.9rem] text-sand">Nástroje běží na egfin.cz, webu mé společnosti. Otevírají se v nové záložce.</p>
        </Reveal>
        <ul className="mt-12 grid border-t border-(--line) md:grid-cols-2 lg:grid-cols-3">
          {EGFIN_TOOLS.map((t, i) => (
            <Reveal as="li" key={t.name} delay={(i % 3) * 0.08} className="border-b border-(--line) lg:[&:not(:nth-child(3n))]:border-r">
              <a href={t.href} target="_blank" rel="noopener noreferrer" className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:bg-ink-900 lg:p-8">
                <span className="font-mono text-[0.65rem] tracking-[0.14em] text-sand">0{i + 1}</span>
                <span>
                  <span className="display display-sm block text-[1.3rem]">{t.name}</span>
                  <span className="mt-2 block text-[0.9rem] text-sand">{t.text}</span>
                </span>
                <span aria-hidden="true" className="self-end text-sand transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section theme="light" ariaLabelledby="tools-cta-title">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="tools-cta-title" className="display display-md">
              Kalkulačka řekne, <span className="serif-accent text-(--accent)">kolik. Banka řekne, jestli.</span>
            </h2>
            <p className="mt-6 max-w-xl text-(--muted)">
              Mezi tím je metodika: uznání nájmu, DTI, zástavy, pořadí kroků. Pošlete mi svá čísla a řeknu vám, jak
              je banka uvidí.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button href="/kontakt" magnetic>Probrat mé financování</Button>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
