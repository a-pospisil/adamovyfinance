import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Guilloche } from "@/components/engraving/Engraving";
import { CNB_2026 } from "@/lib/site";

const ITEMS = [
  {
    title: "Investiční hypotéka",
    text: `Jiný produkt s jinými pravidly. Od ${CNB_2026.effectiveFrom} doporučené LTV ${CNB_2026.investmentLtv} % a DTI ${CNB_2026.investmentDti}. Rozhoduje, kolik z nájmu banka uzná.`,
  },
  {
    title: "Portfolio a zástavy",
    text: "Od druhé nemovitosti nejde o hypotéky, ale o systém: která nemovitost nese kterou zástavu a kde zůstává volná bonita.",
  },
  {
    title: "Refinancování",
    text: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět. Přecenění, delší splatnost, uvolněný kapitál.",
  },
  {
    title: "Financování přes s.r.o.",
    text: "DSCR, výkazy a vlastní zdroje místo bonity fyzické osoby. Bod zlomu počítám na číslech, ne podle dogmatu.",
  },
];

/** 02 — Specializace. Čtyři řádky, žádné karty a žádné ikony. */
export function Specialisation() {
  return (
    <Section theme="ink" ariaLabelledby="spec-title" className="overflow-hidden">
      <Guilloche
        className="pointer-events-none absolute -left-40 top-1/2 size-[34rem] -translate-y-1/2"
        tone="gold"
        opacity={0.12}
      />

      <div className="relative">
        <Reveal>
          <SectionMark index="02">Specializace</SectionMark>
        </Reveal>

        <Reveal delay={60}>
          <h2 id="spec-title" className="display display-lg mt-12 max-w-[16ch]">
            Jedna disciplína, <span className="italic-accent text-gold-300">čtyři situace.</span>
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-(--line)">
          {ITEMS.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 70}
              className="grid gap-3 border-b border-(--line) py-8 md:grid-cols-12 md:gap-8 md:py-10"
            >
              <span className="label-sm tabular text-(--accent) md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display display-sm md:col-span-4">{item.title}</h3>
              <p className="max-w-xl text-[0.98rem] text-(--muted) md:col-span-7">{item.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="mt-12">
          <Button href="/financovani" variant="outline">
            Jak o financování přemýšlím
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}
