import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";

const PRINCIPLES = [
  "První financování rozhoduje o druhém nákupu.",
  "Nejlepší sazba nemusí být nejlepší financování.",
  "Každá banka vidí stejného investora jinak.",
  "Portfolio se financuje jako celek, ne po jednom úvěru.",
];

/** 3) Jak přemýšlím. Značkové tvrzení, čtyři věty a fotka. */
export function Philosophy() {
  return (
    <Section theme="paper" ariaLabelledby="phil-title" className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionMark index="03">Jak přemýšlím</SectionMark>
          </Reveal>

          <Reveal delay={60}>
            <h2 id="phil-title" className="display display-lg mt-10 max-w-[16ch]">
              Jedna hypotéka <span className="italic-accent text-burgundy">není investiční strategie.</span>
            </h2>
          </Reveal>

          <ul className="mt-10 border-t border-(--line-strong)">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p} delay={i * 80} className="border-b border-(--line) py-5">
                <p className="display text-[clamp(1.35rem,2.2vw,1.65rem)] leading-[1.2]">{p}</p>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal as="figure" delay={120} className="lg:col-span-4 lg:col-start-9">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/adam-phone.jpg"
              alt="Adam Pospíšil telefonuje u okna"
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover object-[50%_20%]"
            />
          </div>
          <figcaption className="mt-3 text-[0.8rem] leading-relaxed text-(--muted)">
            Banka řeší dnešní žádost. Investor by měl řešit, co dnešní podpis udělá s jeho možnostmi za rok a za pět let.
          </figcaption>
        </Reveal>
      </div>
    </Section>
  );
}
