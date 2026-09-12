"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK } from "@/lib/motion";

const TERMS = ["Excel", "E-mail", "Úvěr", "Nájem", "LTV", "DTI", "DSTI", "DSCR", "Zástava", "Banka", "Refinancování", "Bonita"];
const METRICS = new Set(["LTV", "DTI", "DSTI", "DSCR"]);

/** Pinned scroll scene: scattered financing terms organise into a connected grid. */
export function ChaosSystem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const stage = q<HTMLElement>("[data-stage]")[0];
        const grid = q<HTMLElement>("[data-grid]")[0];
        const chips = q<HTMLElement>("[data-chip]");
        const svg = q<SVGSVGElement>("[data-lines]")[0];
        const path = q<SVGPathElement>("[data-path]")[0];
        const frame = q<SVGRectElement>("[data-frame]")[0];

        // Connector path through chip centres (offset* ignores transforms, so this is the settled layout).
        const layoutLines = () => {
          const w = stage.clientWidth;
          const h = stage.clientHeight;
          svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
          // Chips and the grid share the stage as offsetParent (the list itself is not positioned).
          const pts = chips.map((c) => {
            const cx = c.offsetLeft + c.offsetWidth / 2;
            const cy = c.offsetTop + c.offsetHeight / 2;
            return `${cx.toFixed(1)} ${cy.toFixed(1)}`;
          });
          path.setAttribute("d", `M ${pts.join(" L ")}`);
          const pad = 18;
          frame.setAttribute("x", String(grid.offsetLeft - pad));
          frame.setAttribute("y", String(grid.offsetTop - pad));
          frame.setAttribute("width", String(grid.offsetWidth + pad * 2));
          frame.setAttribute("height", String(grid.offsetHeight + pad * 2));
        };
        layoutLines();

        const rnd = gsap.utils.random;
        const scatter = chips.map(() => ({
          x: rnd(-0.42, 0.42) * stage.clientWidth,
          y: rnd(-0.38, 0.38) * stage.clientHeight,
          r: rnd(-26, 26),
        }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=190%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onRefresh: layoutLines,
          },
        });

        tl.fromTo(
          chips,
          { x: (i: number) => scatter[i].x, y: (i: number) => scatter[i].y, rotation: (i: number) => scatter[i].r, opacity: 0.5 },
          { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1, ease: "power2.inOut", stagger: { each: 0.025, from: "random" } },
          0,
        );
        tl.to(q("[data-chaos]"), { opacity: 0, y: -20, duration: 0.35 }, 0.05);
        tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "none" }, 0.7);
        tl.to(
          chips.filter((c) => METRICS.has(c.dataset.chip ?? "")),
          { color: "var(--color-moss-300)", borderColor: "var(--color-moss-300)", duration: 0.3 },
          0.95,
        );
        tl.fromTo(frame, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "none" }, 1.15);
        tl.fromTo(q("[data-system]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 1.35);
        tl.to({}, { duration: 0.3 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="dark"
      aria-labelledby="system-title"
      className="themed relative overflow-hidden"
    >
      <div data-stage className="container-x relative flex h-[100svh] min-h-[560px] flex-col justify-center py-24">
        <svg data-lines aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path data-path d="" fill="none" stroke="var(--line-strong)" strokeWidth="1" pathLength={1} strokeDasharray={1} />
          <rect data-frame fill="none" stroke="var(--color-moss-300)" strokeWidth="1" pathLength={1} strokeDasharray={1} />
        </svg>

        <div data-chaos className="absolute left-[clamp(1.25rem,4vw,4.5rem)] top-[clamp(6rem,14vh,9rem)] max-w-sm">
          <p className="eyebrow">
            <span className="text-(--fg)">02</span>
            <span aria-hidden="true" className="mx-3">—</span>
            Chaos
          </p>
          <p className="mt-4 text-sand">
            Tabulky, e-maily, deset pojmů, které si každá banka vykládá po svém. Takhle vypadá financování,
            když se řeší úvěr po úvěru.
          </p>
        </div>

        <ul data-grid className="mx-auto flex max-w-[40rem] flex-wrap justify-center gap-2.5 sm:gap-3" aria-label="Prvky financování">
          {TERMS.map((t) => (
            <li
              key={t}
              data-chip={t}
              className="mono-label border border-(--line-strong) bg-ink-950 px-3.5 py-2.5 text-[0.72rem] text-ivory-100 sm:px-5 sm:py-3 sm:text-[0.8rem]"
            >
              {t}
            </li>
          ))}
        </ul>

        <div data-system className="absolute inset-x-0 bottom-[clamp(3rem,9vh,6rem)]">
          <div className="container-x flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="system-title" className="display display-lg">
              Financování
              <br />
              jako <span className="serif-accent text-moss-300">systém.</span>
            </h2>
            <p className="max-w-xs text-sand md:text-right">
              Stejné prvky. Jiné pořadí, jiné vazby. Rozdíl mezi jedním schváleným úvěrem a portfoliem, které
              může růst.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
