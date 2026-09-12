import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Numeral } from "@/components/engraving/Engraving";

const PRINCIPLES = [
  "První financování rozhoduje o druhém nákupu.",
  "Nejlepší sazba nemusí být nejlepší financování.",
  "Každá banka vidí stejného investora jinak.",
  "Portfolio se financuje jako celek, ne po jednom úvěru.",
];

/** 04 — Jak přemýšlím. Značkové tvrzení a čtyři věty, nic víc. */
export function Philosophy() {
  return (
    <Section theme="paper" ariaLabelledby="phil-title" className="overflow-hidden">
      <Numeral value="04" className="pointer-events-none absolute -right-6 top-10 text-[16rem] leading-none sm:text-[22rem]" tone="brown" opacity={0.05} />

      <div className="relative">
        <Reveal>
          <SectionMark index="04">Jak přemýšlím</SectionMark>
        </Reveal>

        <Reveal delay={60}>
          <p className="lead mt-12 max-w-lg">
            Banka řeší dnešní žádost. Investor by měl řešit, co dnešní podpis udělá s jeho možnostmi za rok a za pět let.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <h2 id="phil-title" className="display display-lg mt-8 max-w-[15ch]">
            Jedna hypotéka <span className="italic-accent text-burgundy">není investiční strategie.</span>
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-(--line-strong)">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              as="li"
              key={p}
              delay={i * 80}
              className="grid items-baseline gap-3 border-b border-(--line) py-7 sm:grid-cols-[5rem_1fr] sm:gap-8"
            >
              <span className="nominal text-3xl text-(--accent)">0{i + 1}</span>
              <p className="display text-[clamp(1.35rem,2.6vw,2.1rem)] leading-[1.15]">{p}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
