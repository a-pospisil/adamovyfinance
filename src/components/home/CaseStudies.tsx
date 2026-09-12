import Link from "next/link";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CASE_STUDIES } from "@/lib/caseStudies";

/** "Čísla místo slibů": three anonymised cases, condensed. Full versions on /pripadove-studie. */
export function CaseStudies() {
  return (
    <section data-theme="light" aria-labelledby="cs-title" className="themed section-y">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="11">Případové studie</Eyebrow>
            <h2 id="cs-title" className="display display-lg mt-6">
              Čísla <span className="serif-accent text-(--accent)">místo slibů.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[0.9rem] text-(--muted)">
            Údaje anonymizované, čísla skutečná a zaokrouhlená. Případy z praxe mého týmu.
          </p>
        </Reveal>

        <ol className="mt-14 border-t border-(--line)">
          {CASE_STUDIES.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.05} className="grid gap-6 border-b border-(--line) py-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-4">
                <p className="mono-label text-(--muted)">{c.region}</p>
                <h3 className="display display-sm mt-3">{c.title}</h3>
              </div>
              <dl className="grid gap-y-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                {c.metrics.slice(0, 2).map((m) => (
                  <div key={m.label}>
                    <dt className="eyebrow">{m.label}</dt>
                    <dd className="numeral mt-2 whitespace-nowrap text-[clamp(1.3rem,1.9vw,1.7rem)]">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col justify-between gap-6 lg:col-span-4">
                <p className="text-[0.95rem] text-(--muted)">{c.decision}</p>
                <Link href={`/pripadove-studie#${c.slug}`} className="group inline-flex items-center gap-3 self-start text-[0.95rem] font-medium">
                  Problém, rozhodnutí, struktura, výsledek
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
