import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Rosette } from "@/components/engraving/Engraving";
import { EGFIN, FACTS } from "@/lib/site";

const TIMELINE = [
  { year: "2010", title: "Začátek ve financích", text: "Osm let v bankách jako prémiový bankéř. Tam jsem se naučil, jak banka počítá a podle čeho rozhoduje." },
  { year: "2018", title: "Vlastní firma", text: "Zakládám Evergreen Finance. Investice, pojištění, úvěry — zatím všechno." },
  { year: "2021", title: "Jediná specializace", text: "Místo rozšiřování nabídky zužuji, až zbude jedno: financování investičních nemovitostí." },
  { year: "2022", title: "Vlastní portfolio", text: "Kupuji první investiční nemovitost. Od té doby řeším stejná rozhodnutí jako moji klienti." },
  { year: "Dnes", title: "Investoři a workshopy", text: "Stavím financování investorům, kteří nechtějí jednu nemovitost, ale portfolio. A učím je to i na workshopech." },
];

/** 02 — Cesta. Od hypoték k investičním portfoliím, vyprávěné v první osobě. */
export function Story() {
  return (
    <Section theme="paper" ariaLabelledby="story-title" className="border-t border-(--line)">
      <Reveal>
        <SectionMark index="02">Cesta</SectionMark>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal delay={60}>
            <h2 id="story-title" className="display display-lg max-w-[12ch]">
              Od hypoték <span className="italic-accent text-burgundy">k portfoliím.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8 max-w-md space-y-5 text-[1.05rem] leading-relaxed">
              <p>
                Nezačínal jsem u investičních nemovitostí. Začínal jsem u hypoték, osm let v bankách. Naučil jsem se
                tam jednu věc: každá banka vidí stejného klienta jinak.
              </p>
              <p className="text-(--muted)">
                Časem mi došlo, že u investora není nejtěžší získat jeden úvěr. Těžké je vědět, co ten první úvěr
                udělá s druhým, třetím a čtvrtým. Většina lidí to zjistí až ve chvíli, kdy jim banka podruhé řekne ne.
              </p>
              <p className="text-(--muted)">
                Proto jsem od roku {FACTS.specialisationSince} nechal všechno ostatní být a dělám jen financování
                investičních nemovitostí. Od roku {FACTS.ownPortfolioSince} i pro sebe: stejné banky, stejná pravidla,
                stejná rozhodnutí. Pracuji ve společnosti{" "}
                <a
                  href={EGFIN.url}
                  className="text-(--fg) underline decoration-(--line-strong) underline-offset-4 transition-colors hover:decoration-burgundy"
                >
                  Evergreen Finance
                </a>
                , kterou jsem v roce 2018 založil.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="border-t border-(--line-strong)">
            {TIMELINE.map((it, i) => (
              <Reveal
                as="li"
                key={it.year}
                delay={i * 70}
                className="grid gap-2 border-b border-(--line) py-6 sm:grid-cols-12 sm:gap-6"
              >
                <span className="nominal text-2xl text-(--accent) sm:col-span-3">{it.year}</span>
                <div className="sm:col-span-9">
                  <h3 className="display display-sm">{it.title}</h3>
                  <p className="mt-1.5 max-w-lg text-[0.95rem] text-(--muted)">{it.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120} className="mt-6 flex justify-end">
            <Rosette className="size-9" opacity={0.35} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
