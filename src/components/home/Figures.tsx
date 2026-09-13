import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { FACTS } from "@/lib/site";

const FIGURES = [
  { value: `${FACTS.yearsInFinance}+`, label: "let ve financích" },
  { value: `${FACTS.loansTotalBil}+ mld.`, label: "Kč sjednaných úvěrů" },
  { value: `${FACTS.bankPartners}`, label: "bank a partnerů" },
  { value: `${FACTS.clients}+`, label: "klientů" },
];

/** 05 — Zkušenost. Čísla až po příběhu, na jednom řádku, bez karet. */
export function Figures() {
  return (
    <Section theme="paper" ariaLabelledby="figures-title" className="border-t border-(--line)">
      <Reveal>
        <SectionMark index="05">Zkušenost</SectionMark>
      </Reveal>
      <h2 id="figures-title" className="sr-only">
        Zkušenost v číslech
      </h2>

      <dl className="mt-12 grid gap-x-10 gap-y-10 border-t border-(--line-strong) pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {FIGURES.map((f, i) => (
          <Reveal key={f.label} delay={i * 70}>
            <dd className="nominal text-[clamp(2.75rem,6vw,4.5rem)]">{f.value}</dd>
            <dt className="label-xs mt-3">{f.label}</dt>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={120}>
        <p className="mt-10 max-w-xl text-[0.9rem] text-(--muted)">
          Z toho {FACTS.loans2025Mil} milionů korun sjednaných úvěrů v roce 2025, s týmem{" "}
          {FACTS.teamSpecialists} specialistů Evergreen Finance. Vlastní portfolio stavím od roku{" "}
          {FACTS.ownPortfolioSince}.
        </p>
      </Reveal>
    </Section>
  );
}
