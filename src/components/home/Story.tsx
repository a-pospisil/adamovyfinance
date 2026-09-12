"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Eyebrow, Section } from "@/components/ui/Section";
import { MODEL_UNIT } from "@/lib/model";
import { getGsap, MOTION_OK } from "@/lib/motion";

const TERMS = ["LTV", "DTI", "DSTI", "DSCR", "bonita", "příjmy", "zástavy", "nájem", "cashflow", "fixace", "bankovní metodiky"];

/** Homepage narrative 01–05: from the bank's single "yes" to a growing portfolio. */
export function Story() {
  const root = useRef<HTMLDivElement>(null);
  const loanMil = (MODEL_UNIT.loan / 1_000_000).toFixed(1).replace(".", ",");

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Progress line follows the reader.
        gsap.fromTo(
          q("[data-progress]"),
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: el, start: "top 60%", end: "bottom 70%", scrub: 0.6 } },
        );
        q("[data-step]").forEach((step) => {
          gsap.from(step.querySelectorAll("[data-in]"), {
            opacity: 0,
            y: 26,
            duration: 1,
            stagger: 0.08,
            scrollTrigger: { trigger: step, start: "top 80%", once: true },
          });
        });
        gsap.from(q("[data-term]"), {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.06,
          scrollTrigger: { trigger: q("[data-terms]")[0], start: "top 82%", once: true },
        });
        gsap.from(q("[data-structure] rect, [data-structure] line"), {
          strokeDashoffset: 1,
          duration: 1.6,
          stagger: 0.15,
          ease: "power2.inOut",
          scrollTrigger: { trigger: q("[data-structure]")[0], start: "top 80%", once: true },
        });
        gsap.from(q("[data-growth] polyline"), {
          strokeDashoffset: 1,
          duration: 2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: q("[data-growth]")[0], start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <Section theme="light" id="pribeh" ariaLabelledby="story-title">
      <div ref={root}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow index="01">Jeden příběh, ne seznam služeb</Eyebrow>
            <h2 id="story-title" className="display display-md mt-6">
              Kde končí <span className="serif-accent text-(--accent)">hypotéka</span> a začíná financování
            </h2>
            <p className="mt-6 max-w-sm text-(--muted)">
              Banka posuzuje jednu žádost. Investor plánuje další nákup. Mezi těmi dvěma pohledy vzniká práce,
              kterou dělám.
            </p>
          </div>

          <ol className="relative lg:col-span-8 lg:pl-10">
            <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-(--line) lg:block">
              <span data-progress className="block h-full w-px bg-(--accent)" />
            </span>

            <li data-step className="border-t border-(--line) py-10 md:py-12">
              <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:gap-8">
                <span data-in className="numeral text-[1.75rem] text-(--muted)">01</span>
                <div>
                  <p data-in className="mono-label text-(--muted)">Banka řekne</p>
                  <p data-in className="display display-md mt-3">
                    <span className="serif-accent">„Půjčíme vám {loanMil} milionu.“</span>
                  </p>
                  <p data-in className="mt-4 max-w-xl text-(--muted)">
                    Jedna žádost, jeden odhad, jedno rozhodnutí. Pro banku je to hotová transakce.
                  </p>
                </div>
              </div>
            </li>

            <li data-step className="border-t border-(--line) py-10 md:py-12">
              <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:gap-8">
                <span data-in className="numeral text-[1.75rem] text-(--muted)">02</span>
                <div>
                  <p data-in className="mono-label text-(--muted)">Investor se ptá</p>
                  <p data-in className="display display-md mt-3">
                    <span className="serif-accent">„A co další nemovitost?“</span>
                  </p>
                  <p data-in className="mt-4 max-w-xl text-(--muted)">
                    Kolik bonity zůstane po prvním úvěru. Která zástava ponese druhý. Kdy se z nárůstu hodnoty
                    stanou vlastní zdroje.
                  </p>
                </div>
              </div>
            </li>

            <li data-step className="border-t border-(--line) py-10 md:py-12">
              <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:gap-8">
                <span data-in className="numeral text-[1.75rem] text-(--muted)">03</span>
                <div>
                  <p data-in className="mono-label text-(--muted)">Začíná skutečné financování</p>
                  <ul data-terms className="mt-5 flex flex-wrap gap-2">
                    {TERMS.map((t) => (
                      <li
                        key={t}
                        data-term
                        className="mono-label border border-(--line-strong) px-3 py-2 text-(--fg)"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p data-in className="mt-5 max-w-xl text-(--muted)">
                    Každý z těch pojmů má ve čtrnácti bankách jinou váhu. Jejich kombinace rozhodne, jestli
                    druhý nákup přijde za rok, nebo nikdy.
                  </p>
                </div>
              </div>
            </li>

            <li data-step className="border-t border-(--line) py-10 md:py-12">
              <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:gap-8">
                <span data-in className="numeral text-[1.75rem] text-(--muted)">04</span>
                <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
                  <div>
                    <p data-in className="mono-label text-(--muted)">Vzniká</p>
                    <p data-in className="display display-md mt-3">Struktura.</p>
                    <p data-in className="mt-4 max-w-xl text-(--muted)">
                      Který úvěr u které banky, s jakou fixací, s jakou zástavou a v jakém pořadí. Fyzická osoba,
                      nebo s.r.o.
                    </p>
                  </div>
                  <svg
                    data-structure
                    aria-hidden="true"
                    viewBox="0 0 220 96"
                    className="h-24 w-56 text-(--fg)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  >
                    {[0, 82, 164].map((x, i) => (
                      <rect key={x} x={x + 1} y={i === 1 ? 1 : 30} width="54" height="64" pathLength={1} strokeDasharray={1} />
                    ))}
                    <line x1="55" y1="62" x2="83" y2="62" pathLength={1} strokeDasharray={1} />
                    <line x1="137" y1="62" x2="165" y2="62" pathLength={1} strokeDasharray={1} />
                    <line x1="110" y1="1" x2="110" y2="30" pathLength={1} strokeDasharray={1} stroke="var(--accent)" />
                  </svg>
                </div>
              </div>
            </li>

            <li data-step className="border-t border-b border-(--line) py-10 md:py-12">
              <div className="grid gap-4 md:grid-cols-[4rem_1fr] md:gap-8">
                <span data-in className="numeral text-[1.75rem] text-(--muted)">05</span>
                <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
                  <div>
                    <p data-in className="mono-label text-(--muted)">Portfolio</p>
                    <p data-in className="display display-md mt-3">Roste.</p>
                    <p data-in className="mt-4 max-w-xl text-(--muted)">
                      Ne proto, že by banka půjčila víc. Proto, že každý další krok byl připravený už v tom
                      prvním.
                    </p>
                  </div>
                  <svg
                    data-growth
                    aria-hidden="true"
                    viewBox="0 0 220 96"
                    className="h-24 w-56 text-(--accent)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polyline
                      points="2,94 40,94 40,70 80,70 80,52 120,52 120,34 160,34 160,16 218,16"
                      pathLength={1}
                      strokeDasharray={1}
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Section>
  );
}
