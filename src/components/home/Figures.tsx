import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { GrandRosette } from "@/components/engraving/Engraving";
import { FACTS } from "@/lib/site";

const FIGURES = [
  { value: `${FACTS.yearsInFinance}+`, label: "let ve financích" },
  { value: `${FACTS.loansTotalBil}+ mld.`, label: "Kč sjednaných úvěrů" },
  { value: `${FACTS.bankPartners}`, label: "bank a partnerů" },
  { value: `${FACTS.clients}+`, label: "klientů" },
];

/** 4) Zkušenost. Fotka a čísla jako nominály, bez karet. */
export function Figures() {
  return (
    <Section theme="paper" ariaLabelledby="figures-title" className="overflow-hidden border-t border-(--line)">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GrandRosette tone="gold" className="absolute -bottom-64 -right-52 hidden size-[38rem] md:block" opacity={0.16} />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden lg:aspect-square">
            <Image
              src="/images/adam-suit.jpg"
              alt="Adam Pospíšil v obleku"
              fill
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover object-[50%_18%]"
            />
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 id="figures-title" className="sr-only">
            Zkušenost v číslech
          </h2>

          <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-10 border-t border-(--line-strong) pt-8">
            {FIGURES.map((f, i) => (
              <Reveal key={f.label} delay={i * 70}>
                <dd className="nominal text-[clamp(2.75rem,5vw,4.25rem)]">{f.value}</dd>
                <dt className="mt-2 text-[0.9rem] text-(--muted)">{f.label}</dt>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={120}>
            <p className="mt-10 max-w-md text-[0.95rem] text-(--muted)">
              Z toho {FACTS.loans2025Mil} milionů korun sjednaných úvěrů v roce 2025, s týmem{" "}
              {FACTS.teamSpecialists} specialistů Evergreen Finance.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
