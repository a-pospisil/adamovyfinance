"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/ui/Section";
import { formatCzk, formatPct, formatSigned } from "@/lib/format";
import { MODEL, MODEL_PORTFOLIO, MODEL_PORTFOLIO_STEPS } from "@/lib/model";
import { getGsap, MOTION_OK } from "@/lib/motion";

const FINAL = MODEL_PORTFOLIO_STEPS[MODEL_PORTFOLIO_STEPS.length - 1];
const MAX_VALUE = FINAL.value;

/** Pinned scene: five units join a portfolio while value, debt, LTV, rent and cashflow update. */
export function PortfolioBuilder() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const units = q<HTMLElement>("[data-unit]");
        const bars = q<HTMLElement>("[data-bar]");
        const out = {
          value: q<HTMLElement>("[data-out=value]")[0],
          debt: q<HTMLElement>("[data-out=debt]")[0],
          ltv: q<HTMLElement>("[data-out=ltv]")[0],
          rent: q<HTMLElement>("[data-out=rent]")[0],
          cashflow: q<HTMLElement>("[data-out=cashflow]")[0],
          count: q<HTMLElement>("[data-out=count]")[0],
        };
        const state = { value: 0, debt: 0, rent: 0, cashflow: 0, count: 0 };
        const render = () => {
          out.value.textContent = formatCzk(state.value);
          out.debt.textContent = formatCzk(state.debt);
          out.ltv.textContent = state.value ? formatPct(state.debt / state.value, 1) : "—";
          out.rent.textContent = `${formatCzk(state.rent)} / měs.`;
          out.cashflow.textContent = `${formatSigned(state.cashflow)} / měs.`;
          out.count.textContent = String(Math.round(state.count)).padStart(2, "0");
        };

        gsap.set(units, { opacity: 0.28 });
        gsap.set(bars, { scaleY: 0, transformOrigin: "bottom" });
        gsap.set(q("[data-final]"), { opacity: 0, y: 24 });
        render();

        // Desktop pins the scene; on smaller screens the panel sits below the list,
        // so the timeline simply follows the natural scroll of the section.
        const pinned = window.matchMedia("(min-width: 1024px)").matches;
        const tl = gsap.timeline({
          scrollTrigger: pinned
            ? { trigger: el, start: "top top", end: "+=260%", pin: true, scrub: 0.8, anticipatePin: 1 }
            : { trigger: q("[data-panel]")[0], start: "top 85%", end: "bottom 60%", scrub: 0.6 },
        });

        MODEL_PORTFOLIO_STEPS.forEach((step, i) => {
          const at = i * 1;
          tl.to(units[i], { opacity: 1, duration: 0.5 }, at);
          tl.to(bars[i], { scaleY: 1, duration: 0.6, ease: "power2.out" }, at);
          tl.to(
            state,
            { value: step.value, debt: step.debt, rent: step.rent, cashflow: step.cashflow, count: step.index, duration: 0.7, ease: "power1.inOut", onUpdate: render },
            at,
          );
        });
        tl.to(q("[data-final]"), { opacity: 1, y: 0, duration: 0.6 }, MODEL_PORTFOLIO_STEPS.length);
        tl.to({}, { duration: 0.4 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="light" aria-labelledby="pb-title" className="themed relative overflow-hidden">
      <div className="container-x flex flex-col justify-center py-20 lg:h-[100svh] lg:min-h-[680px] lg:py-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow index="05">Portfolio builder</Eyebrow>
            <h2 id="pb-title" className="display display-md mt-6">
              Pět nemovitostí. <span className="serif-accent text-(--accent)">Jeden systém.</span>
            </h2>
            <ol className="mt-8 divide-y divide-(--line) border-y border-(--line)">
              {MODEL_PORTFOLIO.map((u) => (
                <li key={u.id} data-unit className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 py-3">
                  <span className="numeral text-[0.9rem] text-(--muted)">{u.id}</span>
                  <span>
                    <span className="block text-[0.95rem] font-medium">Nemovitost {u.id}</span>
                    <span className="block text-[0.8rem] text-(--muted)">{u.note}</span>
                  </span>
                  <span className="tabular text-right font-mono text-[0.75rem] tracking-[0.04em] text-(--muted)">
                    {formatCzk(u.price)}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-(--muted)">
              Modelové portfolio · LTV {formatPct(MODEL.ltv)} · {MODEL.ratePct.toString().replace(".", ",")} % p.a. · {MODEL.years} let
            </p>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <div data-theme="dark" data-panel className="themed relative border border-(--line) p-5 sm:p-7 lg:p-8">
              <div className="flex items-end justify-between">
                <p className="mono-label text-sand">Portfolio</p>
                <p className="numeral text-[3rem] leading-none text-ivory-100 sm:text-[4rem]">
                  <span data-out="count">00</span>
                  <span className="text-[0.4em] text-sand"> / 05</span>
                </p>
              </div>

              <div aria-hidden="true" className="mt-6 flex h-28 items-end gap-2 border-b border-(--line) sm:h-36">
                {MODEL_PORTFOLIO_STEPS.map((s) => (
                  <span key={s.index} data-bar className="block flex-1 bg-moss-300/80" style={{ height: `${(s.value / MAX_VALUE) * 100}%` }} />
                ))}
              </div>

              <dl className="mt-4">
                <div className="term-row"><dt className="text-sand">Hodnota</dt><dd data-out="value" className="tabular font-sans text-[1.05rem] font-semibold normal-case tracking-[-0.02em]">{formatCzk(FINAL.value)}</dd></div>
                <div className="term-row"><dt className="text-sand">Dluh</dt><dd data-out="debt" className="tabular font-sans text-[1.05rem] font-semibold normal-case tracking-[-0.02em]">{formatCzk(FINAL.debt)}</dd></div>
                <div className="term-row"><dt className="text-sand">LTV</dt><dd data-out="ltv" className="tabular font-sans text-[1.05rem] font-semibold normal-case tracking-[-0.02em]">{formatPct(FINAL.ltv, 1)}</dd></div>
                <div className="term-row"><dt className="text-sand">Nájem</dt><dd data-out="rent" className="tabular font-sans text-[1.05rem] font-semibold normal-case tracking-[-0.02em]">{formatCzk(FINAL.rent)} / měs.</dd></div>
                <div className="term-row border-b-0"><dt className="text-moss-300">Cashflow <span className="normal-case tracking-normal text-sand/70">před náklady</span></dt><dd data-out="cashflow" className="tabular font-sans text-[1.05rem] font-semibold normal-case tracking-[-0.02em] text-moss-300">{formatSigned(FINAL.cashflow)} / měs.</dd></div>
              </dl>

              <p data-final className="display display-sm mt-8 border-t border-(--line) pt-6">
                Jeden úvěr je transakce.
                <br />
                <span className="serif-accent text-moss-300">Portfolio je strategie.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
