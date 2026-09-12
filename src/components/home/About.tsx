import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { CornerOrnament } from "@/components/engraving/Engraving";
import { FACTS } from "@/lib/site";

/** 01 — O mně. Portrét, čtyři věty, jedna myšlenka. */
export function About() {
  return (
    <Section theme="paper" ariaLabelledby="about-title" className="border-t border-(--line)">
      <Reveal>
        <SectionMark index="01">O mně</SectionMark>
      </Reveal>

      <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="relative">
            <CornerOrnament className="absolute -left-3 -top-3 z-10 size-9" tone="gold" opacity={0.7} />
            <CornerOrnament className="absolute -bottom-3 -right-3 z-10 size-9" tone="gold" opacity={0.7} flipX flipY />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/adam-portrait.jpg"
                alt="Adam Pospíšil"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover object-[52%_18%]"
                priority
              />
            </div>
            <p className="microtype mt-3">Adam Pospíšil / Praha / {FACTS.ownPortfolioSince}</p>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={80}>
            <h2 id="about-title" className="display display-lg max-w-[13ch]">
              Rozumím bance. <span className="italic-accent text-burgundy">Počítám jako investor.</span>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-8 max-w-lg space-y-5 text-[1.05rem] leading-relaxed">
              <p>
                Ve financích jsem od roku {FACTS.sinceYear}, prvních osm let v bankách. Od roku{" "}
                {FACTS.specialisationSince} dělám jediné: financování investičních nemovitostí.
              </p>
              <p className="text-(--muted)">
                Vlastní portfolio nájemních nemovitostí stavím od roku {FACTS.ownPortfolioSince} stejnými strategiemi,
                které doporučuji klientům. Když řeknu, že struktura funguje, používám ji sám.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <figure className="mt-10 border-l border-burgundy pl-6">
              <blockquote className="display display-sm italic-accent max-w-md">
                „Hypotéka není finanční produkt. Je to nástroj, kterým se staví majetek.“
              </blockquote>
            </figure>
          </Reveal>

          <Reveal delay={260} className="mt-10">
            <Button href="/o-adamovi" variant="quiet">
              Celý příběh
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
