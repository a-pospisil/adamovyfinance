"use client";

import { useId, useState } from "react";
import { annuity, formatCzk, formatPct, formatRatio, formatSigned } from "@/lib/format";
import { CNB_2026 } from "@/lib/site";

type Field = { key: keyof State; label: string; min: number; max: number; step: number; unit: string; hint?: string };

type State = { price: number; ltv: number; rate: number; years: number; rent: number; costs: number };

const FIELDS: Field[] = [
  { key: "price", label: "Kupní cena", min: 500_000, max: 30_000_000, step: 50_000, unit: "Kč" },
  { key: "ltv", label: "LTV", min: 30, max: 90, step: 5, unit: "%", hint: `ČNB doporučuje pro investiční nemovitost max. ${CNB_2026.investmentLtv} %` },
  { key: "rate", label: "Úroková sazba", min: 2, max: 9, step: 0.1, unit: "% p.a." },
  { key: "years", label: "Splatnost", min: 5, max: 30, step: 1, unit: "let" },
  { key: "rent", label: "Měsíční nájem", min: 0, max: 200_000, step: 500, unit: "Kč" },
  { key: "costs", label: "Měsíční náklady", min: 0, max: 50_000, step: 250, unit: "Kč", hint: "fond oprav, správa, pojištění, rezerva" },
];

const INITIAL: State = { price: 4_000_000, ltv: CNB_2026.investmentLtv, rate: 5.2, years: 30, rent: 18_000, costs: 2_500 };

/** Live investment mortgage calculator: loan, equity, payment, cashflow, DSCR, yields. */
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
  const reserve = payment * 6;

  const update = (key: keyof State, value: number) => setS((prev) => ({ ...prev, [key]: value }));

  const rows = [
    { label: "Úvěr", value: formatCzk(loan) },
    { label: "Vlastní zdroje", value: formatCzk(equity), note: formatPct(1 - s.ltv / 100) },
    { label: "Splátka", value: `${formatCzk(payment)} / měs.` },
    { label: "Cashflow", value: `${formatSigned(cashflow)} / měs.`, note: "po nákladech, před daní", accent: true },
    { label: "DSCR", value: formatRatio(dscr), note: "nájem / splátka", accent: true },
    { label: "Hrubý výnos", value: formatPct(grossYield, 1) },
    { label: "Výnos na vlastní kapitál", value: formatPct(cashOnCash, 1), note: "cash-on-cash" },
    { label: "Rezerva", value: formatCzk(reserve), note: "6 splátek" },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <form className="grid gap-6 sm:grid-cols-2 lg:col-span-6" onSubmit={(e) => e.preventDefault()} aria-label="Parametry investice">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label htmlFor={`${id}-${f.key}`} className="eyebrow flex justify-between">
              <span>{f.label}</span>
              <span className="text-(--fg)">
                {f.key === "price" || f.key === "rent" || f.key === "costs" ? formatCzk(s[f.key], "") : String(s[f.key]).replace(".", ",")} {f.unit}
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
              className="field mt-2 py-2 text-[0.9rem]"
            />
            {f.hint && <p className="mt-1.5 text-[0.75rem] text-(--muted)">{f.hint}</p>}
          </div>
        ))}
      </form>

      <div data-theme="dark" className="themed border border-(--line) p-5 sm:p-7 lg:col-span-6 lg:p-8">
        <p className="mb-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-sand">
          <span>Výsledek</span>
          <span>{String(s.rate).replace(".", ",")} % · {s.years} let · LTV {s.ltv} %</span>
        </p>
        <dl aria-live="polite">
          {rows.map((r) => (
            <div key={r.label} className="term-row">
              <dt className={r.accent ? "text-moss-300" : "text-sand"}>
                {r.label}
                {r.note && <span className="ml-2 normal-case tracking-normal text-sand/70">{r.note}</span>}
              </dt>
              <dd className={`tabular text-right font-sans text-[1rem] font-semibold normal-case tracking-[-0.02em] sm:text-[1.1rem] ${r.accent ? "text-moss-300" : ""}`}>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[0.8rem] leading-relaxed text-sand">
          Orientační výpočet anuitní splátky bez daně z příjmu, neobsazenosti a bez vazby na bonitu. Jestli úvěr
          projde, rozhoduje metodika konkrétní banky: uznání nájmu, DTI, DSTI a další zástavy. Přesně to je předmět
          konzultace.
        </p>
      </div>
    </div>
  );
}
