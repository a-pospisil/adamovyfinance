"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/ui/Section";
import { formatCzk, formatPct, formatRatio, formatSigned } from "@/lib/format";
import { MODEL, MODEL_UNIT } from "@/lib/model";
import { getGsap, MOTION_OK } from "@/lib/motion";

const ROWS = [
  { label: "Kupní cena", value: formatCzk(MODEL_UNIT.price), num: MODEL_UNIT.price },
  { label: "Vlastní kapitál", value: formatCzk(MODEL_UNIT.equity), num: MODEL_UNIT.equity, note: formatPct(1 - MODEL.ltv) },
  { label: "Úvěr", value: formatCzk(MODEL_UNIT.loan), num: MODEL_UNIT.loan },
  { label: "LTV", value: formatPct(MODEL.ltv) },
  { label: "Nájem", value: `${formatCzk(MODEL_UNIT.rent)} / měs.`, num: MODEL_UNIT.rent },
  { label: "Splátka", value: `${formatCzk(MODEL_UNIT.payment)} / měs.`, num: MODEL_UNIT.payment, note: `${MODEL.ratePct.toString().replace(".", ",")} % · ${MODEL.years} let` },
  { label: "Cashflow", value: `${formatSigned(MODEL_UNIT.cashflow)} / měs.`, note: "před náklady a daní", accent: true },
  { label: "DSCR", value: formatRatio(MODEL_UNIT.dscr), accent: true },
  { label: "Rezerva", value: formatCzk(MODEL_UNIT.reserve), num: MODEL_UNIT.reserve, note: `${MODEL.reserveMonths} splátek` },
];

/** "Investiční nemovitost se nekupuje jen za cenu bytu": the full equation, one row at a time. */
export function InvestmentProperty() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = q<HTMLElement>("[data-row]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-panel]")[0], start: "top 75%", once: true } });
        tl.from(rows, { opacity: 0, x: 24, duration: 0.7, stagger: 0.16, ease: "power3.out" }, 0);
        rows.forEach((row, i) => {
          const target = row.querySelector<HTMLElement>("[data-num]");
          if (!target) return;
          const to = Number(target.dataset.num);
          const template = target.dataset.template ?? "{n}";
          const state = { n: 0 };
          tl.to(
            state,
            { n: to, duration: 0.9, ease: "power2.out", onUpdate: () => { target.textContent = template.replace("{n}", formatCzk(state.n)); } },
            0.1 + i * 0.16,
          );
        });
        tl.from(q("[data-outcome]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.15 }, ">-0.2");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" aria-labelledby="ip-title" className="themed section-y">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Eyebrow index="04">Investiční nemovitost</Eyebrow>
          <h2 id="ip-title" className="display display-md mt-6 max-w-xl">
            Investiční nemovitost se nekupuje <span className="serif-accent text-moss-300">jen za cenu bytu.</span>
          </h2>
          <p className="lead mt-8 max-w-lg text-sand">
            Byt za čtyři miliony není investice za čtyři miliony. Je to 1,2 milionu vlastního kapitálu, 2,8 milionu
            cizího, nájem, který musí unést splátku, a rezerva na měsíce, kdy v něm nikdo nebydlí.
          </p>
          <p className="mt-5 max-w-lg text-sand">
            Teprve z těchto čísel vzniká strategie. Stejný byt může být cashflow investicí v regionu a capital
            gain investicí v Praze. Rozdíl není v bytě, ale ve struktuře a v tom, co má přijít po něm.
          </p>
        </div>

        <div className="lg:col-span-6 lg:pl-8 xl:pl-16">
          <div data-panel className="border border-(--line) bg-ink-900/60 p-5 sm:p-7">
            <p className="mb-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-sand">
              <span>Modelový příklad</span>
              <span>1 jednotka</span>
            </p>
            <dl>
              {ROWS.map((r) => (
                <div key={r.label} data-row className="term-row">
                  <dt className={r.accent ? "text-moss-300" : "text-sand"}>
                    {r.label}
                    {r.note && <span className="ml-2 normal-case tracking-normal text-sand/70">{r.note}</span>}
                  </dt>
                  <dd className={`tabular text-right font-sans text-[1rem] font-semibold normal-case tracking-[-0.02em] sm:text-[1.1rem] ${r.accent ? "text-moss-300" : ""}`}>
                    {r.num ? (
                      <span data-num={r.num} data-template={r.value.replace(formatCzk(r.num), "{n}")}>
                        {r.value}
                      </span>
                    ) : (
                      r.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div data-outcome className="border-l border-moss-300 pl-4">
                <p className="mono-label text-moss-300">Cashflow strategie</p>
                <p className="mt-2 text-[0.9rem] text-sand">Regiony, vyšší výnos, nájem platí splátku i rezervu. Portfolio roste z přebytku.</p>
              </div>
              <div data-outcome className="border-l border-(--line-strong) pl-4">
                <p className="mono-label text-ivory-100">Capital gain strategie</p>
                <p className="mt-2 text-[0.9rem] text-sand">Praha, Brno. Dotace z příjmu jako cena za růst hodnoty a amortizaci. Vyžaduje rezervu.</p>
              </div>
            </div>
            <p data-outcome className="mt-6 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-sand">
              <span aria-hidden="true">↓</span> Investiční strategie
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
