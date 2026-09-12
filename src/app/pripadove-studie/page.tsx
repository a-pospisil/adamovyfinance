import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Numeral } from "@/components/engraving/Engraving";
import { CASE_STUDIES, WORKSHOP_CASES } from "@/lib/caseStudies";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, ORG_ID, PERSON_ID } from "@/lib/schema";
import { EGFIN, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Případové studie – čísla místo slibů",
  description:
    "Tři anonymizované případy z praxe: investiční byt se záporným cashflow, refinancování portfolia tří bytů a bytový dům přes s.r.o. Čísla, ne sliby.",
  path: "/pripadove-studie",
});

const STEPS: { key: "problem" | "decision" | "structure" | "result"; label: string }[] = [
  { key: "problem", label: "Problém" },
  { key: "decision", label: "Rozhodnutí" },
  { key: "structure", label: "Struktura" },
  { key: "result", label: "Výsledek" },
];

export default function CaseStudiesPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Případové studie", path: "/pripadove-studie" }]),
          ...CASE_STUDIES.map((c) => ({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: c.title,
            about: c.region,
            description: c.problem,
            inLanguage: "cs",
            author: { "@id": PERSON_ID },
            publisher: { "@id": ORG_ID },
            mainEntityOfPage: `${SITE_URL}/pripadove-studie#${c.slug}`,
            url: `${SITE_URL}/pripadove-studie#${c.slug}`,
            isBasedOn: c.sourceUrl,
          })),
        ]}
      />

      <PageHero
        label="Případové studie"
        numeral="03"
        title={
          <>
            Čísla <span className="italic-accent text-burgundy">místo slibů.</span>
          </>
        }
        lead={
          <p>
            Tři případy z praxe mého týmu. Údaje jsou anonymizované, čísla skutečná a zaokrouhlená. U každého stejná
            osnova: problém, rozhodnutí, struktura, výsledek.
          </p>
        }
      />

      {CASE_STUDIES.map((c, i) => (
        <Section
          key={c.slug}
          id={c.slug}
          theme={i % 2 === 0 ? "paper" : "ink"}
          as="article"
          ariaLabelledby={`${c.slug}-title`}
          className="overflow-hidden border-t border-(--line)"
        >
          <Numeral
            value={`0${i + 1}`}
            className="pointer-events-none absolute -right-4 top-10 text-[14rem] leading-none sm:text-[20rem]"
            tone={i % 2 === 0 ? "brown" : "gold"}
            opacity={0.06}
          />

          <div className="relative">
            <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="label-xs text-(--accent)">{c.region}</p>
                <h2 id={`${c.slug}-title`} className="display display-md mt-4 max-w-[16ch]">
                  {c.title}
                </h2>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-7 lg:col-span-6 lg:col-start-7">
                {c.metrics.map((m) => (
                  <div key={m.label} className="border-t border-(--line) pt-4">
                    <dt className="label-xs">{m.label}</dt>
                    <dd className="nominal mt-2 text-[clamp(1.5rem,2.6vw,2.4rem)]">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <ol className="mt-14 grid border-t border-(--line) md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, j) => (
                <Reveal
                  as="li"
                  key={s.key}
                  delay={j * 60}
                  className="border-b border-(--line) py-7 md:pr-8 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-8"
                >
                  <span className="label-xs tabular text-(--accent)">0{j + 1}</span>
                  <h3 className="display display-sm mt-3">{s.label}</h3>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-(--muted)">{c[s.key]}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-10 grid gap-6 border-t border-(--line) pt-8 lg:grid-cols-12">
              <p className="display display-sm italic-accent lg:col-span-8">„{c.lesson}“</p>
              <div className="lg:col-span-4 lg:text-right">
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-xs tap inline-block border-b border-(--line-strong) pb-0.5 transition-colors hover:border-(--accent) hover:text-(--accent)"
                >
                  Podrobná verze na egfin.cz
                </a>
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      <Section theme="paper" ariaLabelledby="ws-cases-title" className="border-t border-(--line)">
        <Reveal>
          <SectionMark index="04">Z workshopů</SectionMark>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="ws-cases-title" className="display display-md mt-10 max-w-[18ch]">
            Stejný klient, stejná banka, <span className="italic-accent text-burgundy">jiná struktura.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {WORKSHOP_CASES.map((c, i) => (
            <Reveal as="article" key={c.title} delay={i * 80} className="border-t border-(--line-strong) pt-7">
              <p className="label-xs">{c.who}</p>
              <h3 className="display display-sm mt-3">{c.title}</h3>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-(--line) py-5">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className="nominal text-[clamp(1.2rem,2vw,1.75rem)]">{m.value}</dd>
                    <dt className="label-xs mt-1.5">{m.label}</dt>
                  </div>
                ))}
              </dl>
              <dl className="mt-6 space-y-4 text-[0.95rem]">
                <div>
                  <dt className="label-xs">Výchozí situace</dt>
                  <dd className="mt-1 text-(--muted)">{c.problem}</dd>
                </div>
                <div>
                  <dt className="label-xs">Co se změnilo</dt>
                  <dd className="mt-1 text-(--muted)">{c.change}</dd>
                </div>
                <div>
                  <dt className="label-xs">Výsledek</dt>
                  <dd className="mt-1">{c.result}</dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 grid gap-8 border-t border-(--line) pt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="display display-md max-w-[14ch]">
              Chcete vědět, <span className="italic-accent text-burgundy">co je možné u vás?</span>
            </h2>
            <p className="mt-5 max-w-xl text-(--muted)">
              Popište mi, kde stojíte. Odpovím konkrétně: kolik, kde, za jakých podmínek a v jakém pořadí.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <Button href="/kontakt">Probrat financování</Button>
            <Button href={EGFIN.portfolioAnalysis} external variant="outline">
              Analýza portfolia
            </Button>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
