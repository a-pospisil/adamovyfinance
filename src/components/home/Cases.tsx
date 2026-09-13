import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";

/**
 * 08 — Případové studie jako tři věty, ne tabulky. Čísla i podrobnosti
 * zůstávají na /pripadove-studie; tady jde jen o důkaz, že to funguje.
 */
const CASES = [
  {
    slug: "refinancovani-portfolia",
    label: "3 byty → 4 byty",
    situation: "Investor se třemi byty narazil na strop bonity, konec levných fixací mu hrozil zastavit růst.",
    action: "Neřešili jsme další hypotéku. Přestavěli jsme celé financování k jedné bance a navýšili proti nárůstu hodnoty.",
    result: "Čtvrtý byt a cashflow +5 000 Kč měsíčně, s vlastní hotovostí jen 400 tisíc.",
  },
  {
    slug: "praha-capital-gain",
    label: "Dvě banky řekly ne",
    situation: "Pražský byt se záporným cashflow, dvě banky ho klientce rozmluvily jako ztrátový.",
    action: "Spočítali jsme celou rovnici: amortizaci jistiny i růst hodnoty, ne jen měsíční zůstatek.",
    result: "Výnos na vložený kapitál přes 12 % ročně a připravený druhý nákup.",
  },
  {
    slug: "bytovy-dum-sro",
    label: "Dům, který banka neviděla",
    situation: "Zanedbaný dům se šesti byty. Banka viděla nízké nájmy, ne potenciál po rekonstrukci.",
    action: "Žádost jsme postavili na stabilizovaném stavu a čerpání rozdělili na etapy.",
    result: "Hodnota +5,4 milionu za 14 měsíců a 2,7 milionu zpátky z refinancování.",
  },
];

export function Cases() {
  return (
    <Section theme="paper" ariaLabelledby="cases-title" className="border-t border-(--line)">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionMark index="08">Případové studie</SectionMark>
          <h2 id="cases-title" className="display display-md mt-8 max-w-[12ch]">
            Tři situace, <span className="italic-accent text-burgundy">tři jiné cesty.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="max-w-xs text-[0.9rem] text-(--muted) md:text-right">
            Anonymizované případy z praxe mého týmu. Čísla skutečná, zaokrouhlená.
          </p>
        </Reveal>
      </div>

      <ol className="mt-14 border-t border-(--line-strong)">
        {CASES.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 70} className="border-b border-(--line)">
            <Link
              href={`/pripadove-studie#${c.slug}`}
              className="group grid gap-4 py-8 lg:grid-cols-12 lg:gap-10"
            >
              <div className="lg:col-span-4">
                <span className="label-xs tabular text-(--accent)">0{i + 1}</span>
                <p className="display display-sm mt-3">{c.label}</p>
              </div>
              <div className="space-y-2 lg:col-span-7 lg:pt-6">
                <p className="text-[0.98rem] text-(--muted)">{c.situation}</p>
                <p className="text-[0.98rem] text-(--muted)">{c.action}</p>
                <p className="text-[1.02rem]">{c.result}</p>
              </div>
              <span
                aria-hidden="true"
                className="label-xs self-end text-(--accent) lg:col-span-1 lg:pt-6 lg:text-right"
              >
                Detail
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
