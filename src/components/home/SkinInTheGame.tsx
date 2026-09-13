import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Guilloche } from "@/components/engraving/Engraving";
import { FACTS } from "@/lib/site";

const OWN = ["Vlastní portfolio", "Vlastní úvěry", "Vlastní rozhodnutí", "Vlastní riziko"];

/** 03 — Vlastní investice. Osobní rovina dřív než odbornost. */
export function SkinInTheGame() {
  return (
    <Section theme="cocoa" ariaLabelledby="skin-title" className="overflow-hidden">
      <Guilloche className="pointer-events-none absolute -right-44 top-1/2 size-[36rem] -translate-y-1/2" opacity={0.12} />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="order-2 lg:order-1 lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/adam-portrait.jpg"
              alt="Adam Pospíšil, zakladatel Evergreen Finance"
              fill
              sizes="(max-width: 1024px) 100vw, 38vw"
              className="object-cover object-[52%_16%]"
            />
          </div>
          <p className="microtype mt-3">Vlastní portfolio od roku {FACTS.ownPortfolioSince}</p>
        </Reveal>

        <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <SectionMark index="03">Vlastní investice</SectionMark>
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
