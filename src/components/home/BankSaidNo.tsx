"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { getGsap, MOTION_OK } from "@/lib/motion";

const REASONS = ["Bonita", "LTV", "DTI", "DSTI", "Počet úvěrů", "Příjem", "S.r.o.", "Zástavy", "Metodika"];

/** "Banka řekla ne": the reasons, and why "no" is often a question of structure, not a verdict. */
export function BankSaidNo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q("[data-ne]"), {
          yPercent: 30,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
        gsap.from(q("[data-reason]"), {
          opacity: 0,
          x: -12,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-reasons]")[0], start: "top 80%", once: true },
        });
        gsap.from(q("[data-answer]"), {
          opacity: 0,
          y: 24,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: { trigger: q("[data-answer]")[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" aria-labelledby="no-title" className="themed section-y overflow-hidden">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <Eyebrow index="08">Když banka řekne ne</Eyebrow>
          <h2 id="no-title" className="display mt-6 text-[clamp(2.5rem,7vw,7rem)]">
            Banka řekla
            <span data-ne className="numeral block text-[clamp(7rem,24vw,22rem)] leading-[0.85] text-moss-300">
              Ne.
            </span>
          </h2>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
          <p className="mono-label text-sand">Proč?</p>
          <ul data-reasons className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3" aria-label="Nejčastější důvody zamítnutí">
            {REASONS.map((r, i) => (
              <li key={r} data-reason className="flex items-baseline gap-3 border-b border-(--line) py-3">
                <span className="font-mono text-[0.65rem] text-sand">{String(i + 1).padStart(2, "0")}</span>
                <span className="display display-sm text-[1.2rem] sm:text-[1.4rem]">{r}</span>
              </li>
            ))}
          </ul>

          <p data-answer className="display display-md mt-12">
            „Ne“ nemusí být <span className="serif-accent text-moss-300">konečná odpověď.</span>
          </p>
          <p data-answer className="mt-6 max-w-md text-sand">
            Neslibuji schválení a neobcházím pravidla. Rozumím ale tomu, jak čtrnáct bank posuzuje stejného klienta
            jinak: jak uznávají nájem, příjmy z podnikání, historii s.r.o. nebo další zástavy. Hledám strukturu,
            která odpovídá vaší situaci i jejich metodice. Někdy je to jiná banka. Někdy jiné pořadí kroků. A někdy
            poctivé „teď ne, ale za rok ano“.
          </p>
          <div data-answer className="mt-8">
            <Button href="/kontakt" magnetic>
              Probrat mé financování
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
