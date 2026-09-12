import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Section";
import { EGFIN, FACTS } from "@/lib/site";

const ITEMS = [
  { value: FACTS.yearsInFinance, suffix: "+", label: "let zkušeností ve financích", note: `od roku ${FACTS.sinceYear}` },
  { value: FACTS.loans2025Mil, suffix: "+", unit: "mil. Kč", label: "úvěrů sjednaných v roce 2025", note: "s týmem Evergreen Finance" },
  { value: FACTS.loansTotalBil, suffix: "+", unit: "mld. Kč", label: "celkově sjednaných úvěrů" },
  { value: FACTS.clients, suffix: "+", label: "klientů" },
  { value: FACTS.bankPartners, label: "bankovních a nebankovních partnerů" },
  { value: FACTS.teamSpecialists, label: "specialistů v týmu" },
];

/** Editorial data wall: big numerals, hairlines, no cards. */
export function DataWall() {
  return (
    <section data-theme="light" aria-labelledby="data-title" className="themed section-y">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow index="07">Důkazy místo přívlastků</Eyebrow>
            <h2 id="data-title" className="display display-md mt-6">
              Čísla, která <span className="serif-accent text-(--accent)">se dají ověřit.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[0.9rem] text-(--muted)">
            Hodnocení {FACTS.googleRating} z {FACTS.googleReviews} recenzí na Google pro tým {EGFIN.name}.
          </p>
        </div>

        <dl className="mt-14 grid grid-cols-2 border-t border-l border-(--line) lg:grid-cols-3">
          {ITEMS.map((it) => (
            <div key={it.label} className="flex flex-col justify-between gap-8 border-b border-r border-(--line) p-5 sm:p-8 lg:min-h-[16rem] lg:p-10">
              <dd className="numeral text-[clamp(3rem,7vw,6.5rem)] text-(--fg)">
                <Counter value={it.value} suffix={it.suffix} />
                {it.unit && <span className="ml-2 align-baseline text-[0.32em] font-medium tracking-[-0.02em] text-(--muted)">{it.unit}</span>}
              </dd>
              <dt className="text-[0.95rem] text-(--fg)">
                {it.label}
                {it.note && <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-(--muted)">{it.note}</span>}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
