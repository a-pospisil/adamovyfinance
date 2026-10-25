import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Townhouse } from "@/components/engraving/Engraving";
import { FACTS } from "@/lib/site";

const OWN = ["Vlastní portfolio", "Vlastní úvěry", "Vlastní rozhodnutí", "Vlastní riziko"];

/** 2) Vlastní investice. Osobní rovina dřív než odbornost. */
export function SkinInTheGame() {
  return (
    <Section theme="cocoa" ariaLabelledby="skin-title" className="bricks overflow-hidden">
      {/* Rytina činžovního domu: vlastní nemovitosti, ne ilustrace. */}
      <Townhouse className="pointer-events-none absolute -bottom-5 right-[4%] hidden w-[26rem] text-gold-300 opacity-35 md:block" />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="border border-gold-300/55 p-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/adam-portrait.jpg"
                alt="Adam Pospíšil, zakladatel Evergreen Finance"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover object-[52%_16%]"
              />
            </div>
          </div>
          <p className="microtype mt-3">Vlastní portfolio od roku {FACTS.ownPortfolioSince}</p>
        </Reveal>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <SectionMark index="02">Vlastní investice</SectionMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="skin-title" className="display display-lg mt-10 max-w-[14ch]">
              Neučím investory něco, <span className="italic-accent text-gold-300">co sám nedělám.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead mt-8 max-w-lg">
              Vlastní portfolio nájemních nemovitostí stavím od roku {FACTS.ownPortfolioSince}. Stejné banky, stejné
              metodiky, stejná rozhodnutí, která řeším s klienty. Když řeknu, že struktura funguje, mám ji sám.
            </p>
          </Reveal>
          <ol className="mt-10 border-t border-(--line)">
            {OWN.map((o, i) => (
              <Reveal as="li" key={o} delay={140 + i * 60} className="flex items-baseline gap-5 border-b border-(--line) py-4">
                <span className="label-xs tabular text-(--accent)">0{i + 1}</span>
                <span className="display display-sm">{o}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
