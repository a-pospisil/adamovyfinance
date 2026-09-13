import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { FEATURED_CASE } from "@/lib/caseStudies";

/** 08 — Jedna případová studie z workshopů: problém, co se změnilo, výsledek. */
export function Cases() {
  const c = FEATURED_CASE;
  return (
    <Section theme="paper" ariaLabelledby="cases-title" className="border-t border-(--line)">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionMark index="08">Případová studie</SectionMark>
          <h2 id="cases-title" className="display display-md mt-8 max-w-[14ch]">
            Stejný klient, stejná banka, <span className="italic-accent text-burgundy">jiná struktura.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-xs text-[0.9rem] text-(--muted) md:text-right">
            Případ z workshopu. Jméno změněné, čísla skutečná.
          </p>
        </Reveal>
      </div>

      <Reveal delay={100} className="mt-14 grid gap-10 border-t border-(--line-strong) pt-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className="label-xs">{c.who}</p>
          <h3 className="display display-sm mt-3">{c.title}</h3>
          <dl className="mt-8 grid grid-cols-3 gap-x-6 gap-y-6 border-t border-(--line) pt-6">
            {c.metrics.map((m) => (
              <div key={m.label}>
                <dd className="nominal text-2xl sm:text-3xl">{m.value}</dd>
                <dt className="label-xs mt-2">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <dl className="space-y-6">
            <div>
              <dt className="label-xs">Výchozí situace</dt>
              <dd className="mt-2 text-[0.98rem] text-(--muted)">{c.problem}</dd>
            </div>
            <div>
              <dt className="label-xs">Co se změnilo</dt>
              <dd className="mt-2 text-[0.98rem] text-(--muted)">{c.change}</dd>
            </div>
            <div>
              <dt className="label-xs">Výsledek</dt>
              <dd className="mt-2 text-[1.02rem]">{c.result}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <Button href="/workshopy" variant="quiet">
              Rozebíráme na workshopu
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
