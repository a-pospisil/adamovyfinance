"use client";

import { useId, useState } from "react";
import { annuity, formatCzk, formatPct, formatRatio, formatSigned } from "@/lib/format";
import { CNB_2026 } from "@/lib/site";

type State = { price: number; ltv: number; rate: number; years: number; rent: number; costs: number };
type Field = { key: keyof State; label: string; min: number; max: number; step: number; unit: string; hint?: string };

const FIELDS: Field[] = [
  { key: "price", label: "Kupní cena", min: 500_000, max: 30_000_000, step: 50_000, unit: "Kč" },
  { key: "ltv", label: "LTV", min: 30, max: 90, step: 5, unit: "%", hint: `ČNB doporučuje u investiční nemovitosti max. ${CNB_2026.investmentLtv} %` },
  { key: "rate", label: "Úroková sazba", min: 2, max: 9, step: 0.1, unit: "% p.a." },
  { key: "years", label: "Splatnost", min: 5, max: 30, step: 1, unit: "let" },
  { key: "rent", label: "Měsíční nájem", min: 0, max: 200_000, step: 500, unit: "Kč" },
  { key: "costs", label: "Měsíční náklady", min: 0, max: 50_000, step: 250, unit: "Kč", hint: "fond oprav, správa, pojištění, rezerva" },
];

const INITIAL: State = { price: 4_000_000, ltv: CNB_2026.investmentLtv, rate: 5.2, years: 30, rent: 18_000, costs: 2_500 };

/** Kalkulačka investiční hypotéky: úvěr, splátka, cashflow, DSCR a výnos na kapitál. */
export function InvestmentCalculator() {
  const id = useId();
  const [s, setS] = useState<State>(INITIAL);

  const loan = Math.round(s.price * (s.ltv / 100));
  const equity = s.price - loan;
  const payment = annuity(loan, s.rate, s.years);
  const cashflow = s.rent - payment - s.costs;
  const dscr = payment > 0 ? s.rent / payment : 0;
  const grossYield = s.price > 0 ? (s.rent * 12) / s.price : 0;
  const cashOnCash = equity > 0 ? (cashflow * 12) / equity : 0;

  const update = (key: keyof State, value: number) => setS((prev) => ({ ...prev, [key]: value }));

  const rows = [
    { label: "Úvěr", value: formatCzk(loan) },
    { label: "Vlastní zdroje", value: formatCzk(equity), note: formatPct(1 - s.ltv / 100) },
    { label: "Splátka", value: `${formatCzk(payment)} / měs.` },
    { label: "Cashflow", value: `${formatSigned(cashflow)} / měs.`, note: "po nákladech, před daní", accent: true },
    { label: "DSCR", value: formatRatio(dscr), note: "nájem / splátka", accent: true },
    { label: "Hrubý výnos", value: formatPct(grossYield, 1) },
    { label: "Výnos na vlastní kapitál", value: formatPct(cashOnCash, 1), note: "cash-on-cash" },
    { label: "Rezerva na 6 splátek", value: formatCzk(payment * 6) },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <form className="grid gap-7 sm:grid-cols-2 lg:col-span-6" onSubmit={(e) => e.preventDefault()} aria-label="Parametry investice">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={`${id}-${f.key}`} className="label-xs flex items-baseline justify-between gap-3">
              <span>{f.label}</span>
              <span className="nominal text-base text-(--fg)">
                {f.key === "price" || f.key === "rent" || f.key === "costs"
                  ? formatCzk(s[f.key], "")
                  : String(s[f.key]).replace(".", ",")}{" "}
                {f.unit}
              </span>
            </label>
            <input
              id={`${id}-${f.key}`}
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={s[f.key]}
              onChange={(e) => update(f.key, Number(e.target.value))}
              className="range mt-3"
            />
            <input
              type="number"
              aria-label={`${f.label} (přesná hodnota)`}
              min={f.min}
              max={f.max}
              step={f.step}
              value={s[f.key]}
              onChange={(e) => update(f.key, Number(e.target.value))}
              className="field mt-1 py-1.5 text-[0.9rem]"
            />
            {f.hint && <p className="mt-2 text-[0.75rem] text-(--muted)">{f.hint}</p>}
          </div>
        ))}
      </form>

      <div className="lg:col-span-6">
        <p className="label-xs flex items-baseline justify-between gap-4">
          <span>Výsledek</span>
          <span>
            {String(s.rate).replace(".", ",")} % · {s.years} let · LTV {s.ltv} %
          </span>
        </p>
        <dl aria-live="polite" className="mt-5 border-t border-(--line-strong)">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-6 border-b border-(--line) py-3.5">
              <dt className={`text-[0.95rem] ${r.accent ? "text-(--accent)" : "text-(--muted)"}`}>
                {r.label}
                {r.note && <span className="ml-2 text-[0.8rem] text-(--muted)">{r.note}</span>}
              </dt>
              <dd className={`nominal text-xl sm:text-2xl ${r.accent ? "text-(--accent)" : ""}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[0.8rem] leading-relaxed text-(--muted)">
          Orientační výpočet anuitní splátky bez daně z příjmu a neobsazenosti, bez vazby na bonitu. Jestli úvěr projde,
          rozhoduje metodika konkrétní banky: uznání nájmu, DTI, DSTI a další zástavy.
        </p>
      </div>
    </div>
  );
}
