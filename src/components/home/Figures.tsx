import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { MicroStrip, Rosette } from "@/components/engraving/Engraving";
import { FACTS } from "@/lib/site";

const FIGURES = [
  { value: `${FACTS.yearsInFinance}+`, label: "let ve financích", note: `od roku ${FACTS.sinceYear}` },
  { value: `${FACTS.loansTotalBil}+ mld.`, label: "Kč sjednaných úvěrů", note: `${FACTS.loans2025Mil} mil. Kč v roce 2025` },
  { value: `${FACTS.bankPartners}`, label: "bank a metodik", note: "bankovních i nebankovních partnerů" },
  { value: `${FACTS.clients}+`, label: "klientů", note: `tým ${FACTS.teamSpecialists} specialistů` },
];

/** 03 — Zkušenost. Nominální hodnoty jako na bankovce: čísla, linky, prostor. */
export function Figures() {
  return (
    <Section theme="paper" ariaLabelledby="figures-title">
      <Reveal>
        <SectionMark index="03">Zkušenost</SectionMark>
      </Reveal>

      <Reveal delay={60}>
        <h2 id="figures-title" className="sr-only">
          Zkušenost v číslech
        </h2>
      </Reveal>

      <dl className="mt-12 border-t border-(--line-strong)">
        {FIGURES.map((f, i) => (
          <Reveal
            key={f.label}
            delay={i * 80}
            className="grid items-baseline gap-x-8 gap-y-1 border-b border-(--line) py-7 sm:grid-cols-12 sm:py-9"
          >
            <dd className="nominal text-[clamp(3.25rem,9vw,7rem)] text-ink sm:col-span-5">{f.value}</dd>
            <dt className="display display-sm sm:col-span-4">{f.label}</dt>
            <dd className="label-xs sm:col-span-3 sm:text-right">{f.note}</dd>
          </Reveal>
        ))}
      </dl>

      <div className="mt-8 flex items-center justify-between gap-6">
        <MicroStrip text="Adam Pospíšil · Investment financing" repeat={3} className="hidden max-w-[60%] sm:block" />
        <Rosette className="size-10 shrink-0" opacity={0.4} />
      </div>
    </Section>
  );
}
