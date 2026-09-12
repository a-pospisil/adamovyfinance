"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { formatCzk, formatPct } from "@/lib/format";
import { MODEL, MODEL_UNIT } from "@/lib/model";
import { FACTS } from "@/lib/site";
import { getGsap, MOTION_OK, splitWords } from "@/lib/motion";

const SECOND = 3_600_000;

type RowProps = {
  label: string;
  value: string;
  note?: string;
  accent?: boolean;
  bar?: number;
  countTo?: number;
};

function Row({ label, value, note, accent, bar, countTo }: RowProps) {
  return (
    <div
      data-row
      className="relative grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-(--line) py-3 pl-6"
    >
      <span
        aria-hidden="true"
        data-node
        className={`absolute left-[-3.5px] top-1/2 size-2 -translate-y-1/2 rounded-full ${accent ? "bg-moss-300" : "bg-ivory-100"}`}
      />
      <span className={`mono-label ${accent ? "text-moss-300" : "text-sand"}`}>
        {label}
      </span>
      <span
        data-value={countTo ?? undefined}
        className={`tabular text-right text-[1.05rem] font-semibold tracking-[-0.02em] ${accent ? "text-moss-300" : ""}`}
      >
        {value}
      </span>
      {note && (
        <span className="col-span-2 font-mono text-[0.65rem] tracking-[0.08em] text-sand/80">
          {note}
        </span>
      )}
      {bar !== undefined && (
        <span
          aria-hidden="true"
          className="col-span-2 mt-1 block h-px w-full bg-(--line)"
        >
          <span
            data-bar
            className="block h-px bg-moss-300"
            style={{ width: `${bar * 100}%` }}
          />
        </span>
      )}
    </div>
  );
}

/** Cinematic opening: the headline and a portfolio diagram that builds itself on load. */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1) Diagram: rail grows, rows and nodes arrive, numbers count, bar draws.
        tl.from(
          q("[data-rail]"),
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 2.2,
            ease: "power2.inOut",
          },
          0.15,
        );
        tl.from(
          q("[data-row]"),
          { opacity: 0, x: 18, duration: 0.7, stagger: 0.32 },
          0.25,
        );
        tl.from(
          q("[data-node]"),
          { scale: 0, duration: 0.4, stagger: 0.32 },
          0.3,
        );
        tl.from(
          q("[data-bar]"),
          { scaleX: 0, transformOrigin: "left", duration: 0.9 },
          0.9,
        );

        q("[data-value]").forEach((node, i) => {
          const to = Number(node.getAttribute("data-value"));
          if (!to) return;
          const state = { n: 0 };
          tl.to(
            state,
            {
              n: to,
              duration: 1.1,
              ease: "power2.out",
              onUpdate: () => {
                node.textContent = formatCzk(state.n);
              },
            },
            0.35 + i * 0.32,
          );
        });

        // 2) Frame draws around the structure and "PORTFOLIO" appears.
        tl.from(
          q("[data-frame]"),
          { strokeDashoffset: 1, duration: 1.4, ease: "power2.inOut" },
          2.3,
        );
        tl.from(
          q("[data-portfolio]"),
          { opacity: 0, y: 8, duration: 0.7 },
          3.2,
        );

        // 3) Headline words rise while the diagram is still building.
        const words = q<HTMLElement>("[data-line]").flatMap((line) =>
          splitWords(line),
        );
        tl.from(
          words,
          { yPercent: 130, duration: 1.1, stagger: 0.05, ease: "power4.out" },
          0.4,
        );
        tl.from(
          q("[data-sub]"),
          { opacity: 0, y: 16, duration: 0.9, stagger: 0.12 },
          1.4,
        );
        tl.from(q("[data-cue]"), { opacity: 0, y: 10, duration: 1 }, 1.7);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const second = Math.round(SECOND);
  const totalValue = MODEL_UNIT.price + second;
  const totalDebt = MODEL_UNIT.loan + Math.round(second * MODEL.ltv);

  return (
    <section
      ref={root}
      data-theme="dark"
      aria-labelledby="hero-title"
      className="themed relative overflow-hidden pt-28 pb-16 md:pt-36 lg:pt-36 lg:pb-14"
    >
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="eyebrow">
            <span className="text-(--fg)">Adam Pospíšil</span>
            <span aria-hidden="true" className="mx-3">
              —
            </span>
            Finanční poradce · hypoteční specialista · investor · lektor
          </p>

          <h1
            id="hero-title"
            className="display mt-7 text-[clamp(2.75rem,7.1vw,7.5rem)]"
          >
            <span data-line className="block">
              Banka vidí
            </span>
            <span data-line className="block">
              jeden úvěr.
            </span>
            <span
              data-line
              className="serif-accent block text-[0.96em] text-moss-300"
            >
              Já vidím
            </span>
            <span
              data-line
              className="serif-accent block text-[0.96em] text-moss-300"
            >
              celé portfolio.
            </span>
          </h1>

          <p data-sub className="lead mt-8 max-w-xl text-sand">
            Financování nemovitostí, které počítá s tím, co chcete koupit za
            rok, za tři i za deset let.
          </p>

          <div data-sub className="mt-10 flex flex-wrap gap-4">
            <Button href="/kontakt" size="lg" magnetic>
              Probrat mé financování
            </Button>
            <Button href="/workshopy" variant="outline" size="lg" magnetic>
              Workshopy
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-8 xl:pl-16">
          <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-0">
            <p className="mb-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.16em] text-sand">
              <span>Modelový příklad</span>
              <span>
                {MODEL.ratePct.toString().replace(".", ",")} % p.a. ·{" "}
                {MODEL.years} let
              </span>
            </p>

            <div className="relative px-1 py-2">
              <span
                aria-hidden="true"
                data-rail
                className="absolute left-[4px] top-0 h-full w-px bg-(--line-strong)"
              />
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <rect
                  data-frame
                  x="0.3"
                  y="0.3"
                  width="99.4"
                  height="99.4"
                  fill="none"
                  stroke="var(--color-moss-300)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray={1}
                />
              </svg>

              <Row
                label="Nemovitost #01"
                value={formatCzk(MODEL_UNIT.price)}
                note="kupní cena"
                countTo={MODEL_UNIT.price}
              />
              <Row
                label={`LTV ${formatPct(MODEL.ltv)}`}
                value={formatCzk(MODEL_UNIT.equity)}
                note="vlastní zdroje"
                bar={MODEL.ltv}
                countTo={MODEL_UNIT.equity}
              />
              <Row
                label="Úvěr"
                value={formatCzk(MODEL_UNIT.loan)}
                countTo={MODEL_UNIT.loan}
              />
              <Row
                label="Nájem"
                value={`${formatCzk(MODEL_UNIT.rent, "")} Kč / měs.`}
                note={`DSCR ${MODEL_UNIT.dscr.toFixed(2).replace(".", ",")}×`}
              />
              <Row
                label="Refinancování"
                value="po přecenění"
                note="nárůst hodnoty → vlastní zdroje"
                accent
              />
              <Row
                label="Nemovitost #02"
                value={formatCzk(second)}
                countTo={second}
              />
            </div>

            <div
              data-portfolio
              className="mt-5 flex items-end justify-between gap-4 pl-1"
            >
              <div>
                <p className="mono-label text-moss-300">Portfolio</p>
                <p className="mt-1 font-mono text-[0.7rem] tracking-[0.06em] text-sand">
                  HODNOTA {formatCzk(totalValue)} · DLUH {formatCzk(totalDebt)}{" "}
                  · LTV {formatPct(totalDebt / totalValue)}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="numeral text-[2.5rem] text-ivory-100/90"
              >
                02
              </span>
            </div>
          </div>
        </div>
      </div>

      <dl
        data-cue
        className="container-x mt-16 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-(--line) pt-6 lg:mt-14 lg:grid-cols-4"
      >
        {[
          [`${FACTS.yearsInFinance}+`, "let ve financích"],
          [`${FACTS.loans2025Mil}+ mil. Kč`, "úvěrů sjednaných v roce 2025"],
          [`${FACTS.bankPartners}`, "bank a metodik"],
          [
            `od ${FACTS.ownPortfolioSince}`,
            "vlastní portfolio nájemních nemovitostí",
          ],
        ].map(([value, label]) => (
          <div key={label}>
            <dd className="numeral text-[1.5rem] text-ivory-100 sm:text-[1.75rem]">
              {value}
            </dd>
            <dt className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-sand">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
