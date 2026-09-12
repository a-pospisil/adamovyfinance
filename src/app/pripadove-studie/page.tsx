import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CASE_STUDIES, WORKSHOP_CASES } from "@/lib/caseStudies";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, ORG_ID, PERSON_ID } from "@/lib/schema";
import { EGFIN, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Případové studie – čísla místo slibů",
  description:
    "Anonymizované případy z praxe: investiční byt v Praze s vědomě záporným cashflow, refinancování portfolia tří bytů a bytový dům přes s.r.o. Problém, rozhodnutí, struktura, výsledek.",
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
        eyebrow="Případové studie"
        title={
          <>
            Čísla <span className="serif-accent text-moss-300">místo slibů.</span>
          </>
        }
        lead={
          <p>
            Tři případy z praxe mého týmu. Údaje jsou anonymizované, čísla skutečná a zaokrouhlená. U každého
            případu stejná struktura: problém, rozhodnutí, struktura financování, výsledek. A jedna věc, kterou si
            z něj odnést.
          </p>
        }
      />

      {CASE_STUDIES.map((c, i) => (
        <Section key={c.slug} id={c.slug} theme={i % 2 === 0 ? "light" : "dark"} as="article" ariaLabelledby={`${c.slug}-title`}>
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Eyebrow index={`0${i + 1}`}>{c.region}</Eyebrow>
              <h2 id={`${c.slug}-title`} className="display display-md mt-6">
                {c.title}
              </h2>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6 lg:col-span-6 lg:col-start-7">
              {c.metrics.map((m) => (
                <div key={m.label} className="border-t border-(--line) pt-4">
                  <dt className="eyebrow">{m.label}</dt>
                  <dd className="numeral mt-2 text-[clamp(1.4rem,2.2vw,2rem)]">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <ol className="mt-14 grid border-t border-(--line) md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, j) => (
              <Reveal as="li" key={s.key} delay={j * 0.08} className="border-b border-(--line) py-7 md:pr-8 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:[&:not(:first-child)]:pl-8">
                <span className="font-mono text-[0.65rem] tracking-[0.14em] text-(--muted)">0{j + 1}</span>
                <h3 className="display display-sm mt-3 text-[1.2rem]">{s.label}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed">{c[s.key]}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-10 grid gap-6 border-t border-(--line) pt-8 lg:grid-cols-12">
            <p className="serif-accent text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.25] lg:col-span-8">„{c.lesson}“</p>
            <div className="lg:col-span-4 lg:text-right">
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-[0.9rem] text-(--muted) transition-colors hover:text-(--fg)">
                Podrobná verze včetně bank na egfin.cz
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </Reveal>
        </Section>
      ))}

      <Section theme="dark" ariaLabelledby="ws-cases-title">
        <Reveal>
          <Eyebrow index="04">Z workshopů</Eyebrow>
          <h2 id="ws-cases-title" className="display display-md mt-6">
            Stejný klient, stejná banka, <span className="serif-accent text-moss-300">jiná struktura.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {WORKSHOP_CASES.map((c, i) => (
            <Reveal key={c.title} as="article" delay={i * 0.1} className="border border-(--line) p-6 sm:p-8">
              <p className="mono-label text-sand">{c.who}</p>
              <h3 className="display display-sm mt-3">{c.title}</h3>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-(--line) py-5">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className="numeral text-[clamp(1.2rem,2vw,1.8rem)]">{m.value}</dd>
                    <dt className="mt-1 text-[0.75rem] text-sand">{m.label}</dt>
                  </div>
                ))}
              </dl>
              <dl className="mt-6 space-y-4 text-[0.95rem]">
                <div><dt className="eyebrow">Výchozí situace</dt><dd className="mt-1">{c.problem}</dd></div>
                <div><dt className="eyebrow">Co se změnilo</dt><dd className="mt-1">{c.change}</dd></div>
                <div><dt className="eyebrow">Výsledek</dt><dd className="mt-1 font-medium">{c.result}</dd></div>
              </dl>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section theme="light" ariaLabelledby="cs-cta-title">
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="cs-cta-title" className="display display-md">
              Chcete vědět, <span className="serif-accent text-(--accent)">co je možné u vás?</span>
            </h2>
            <p className="mt-6 max-w-xl text-(--muted)">
              Popište mi, kde stojíte. Odpovím konkrétně: kolik, kde, za jakých podmínek a v jakém pořadí. Zdarma
              a bez závazku.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <Button href="/kontakt" magnetic>Probrat mé financování</Button>
            <Button href={EGFIN.portfolioAnalysis} external variant="outline" magnetic>Analýza portfolia</Button>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}
