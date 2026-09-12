"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/ui/Section";
import { CNB_2026 } from "@/lib/site";
import { getGsap, MOTION_OK } from "@/lib/motion";

const STEPS = [
  {
    title: "První bydlení",
    text: `Hypotéka na vlastní bydlení. LTV až ${CNB_2026.ownHomeLtv} %, do 36 let až ${CNB_2026.ownHomeLtvUnder36} %. První úvěr, který bude banka počítat do všech dalších.`,
  },
  {
    title: "První investice",
    text: `Investiční hypotéka. Od ${CNB_2026.effectiveFrom} doporučeno LTV ${CNB_2026.investmentLtv} % a DTI ${CNB_2026.investmentDti}. Banka uznává jen část nájmu a každá jinou.`,
  },
  {
    title: "Další úvěr",
    text: "Rozhoduje zbývající bonita a to, která nemovitost ponese kterou zástavu. Ne nadšení.",
  },
  {
    title: "Refinancování",
    text: "Konec fixace je jediný moment, kdy jde portfolio levně přestavět: splatnost, sazba, přecenění.",
  },
  {
    title: "Uvolnění kapitálu",
    text: "Nárůst hodnoty se účelovým navýšením mění na vlastní zdroje. Nejlevnější kapitál, jaký na trhu je.",
  },
  {
    title: "Další nemovitost",
    text: "Kupujete z toho, co v portfoliu už je. Bez nového spoření, bez čekání.",
  },
  {
    title: "Portfolio",
    text: "Jednotlivé úvěry přestávají být transakcemi. Stávají se systémem s vlastní logikou.",
  },
];

/** "Hypotéka není jen hypotéka": horizontal pinned chain on desktop, vertical rail on mobile. */
export function MortgageChain() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const rail = q<HTMLElement>("[data-rail]")[0];
        const track = q<HTMLElement>("[data-track]")[0];
        const distance = () => rail.scrollWidth - track.clientWidth;
        const steps = q<HTMLElement>("[data-step]");

        gsap.set(steps, { opacity: 0.35 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(
                steps.length - 1,
                Math.floor(self.progress * steps.length * 1.05),
              );
              steps.forEach((s, i) =>
                s.classList.toggle("is-active", i <= active),
              );
            },
          },
        });
        tl.to(rail, { x: () => -distance(), ease: "none", duration: 1 }, 0);
        tl.to(
          steps,
          {
            opacity: 1,
            stagger: 1 / steps.length,
            ease: "none",
            duration: 0.9,
          },
          0,
        );
        tl.fromTo(
          q("[data-line]"),
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left", ease: "none", duration: 1 },
          0,
        );
        tl.fromTo(
          q("[data-pointa]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.85,
        );
      });

      mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
        gsap.fromTo(
          q("[data-vline]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: q("[data-rail]")[0],
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          },
        );
        q("[data-step]").forEach((s) => {
          gsap.from(s, {
            opacity: 0,
            x: -14,
            duration: 0.8,
            scrollTrigger: { trigger: s, start: "top 85%", once: true },
          });
        });
        gsap.from(q("[data-pointa]"), {
          opacity: 0,
          y: 20,
          duration: 0.9,
          scrollTrigger: {
            trigger: q("[data-pointa]")[0],
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-theme="light"
      aria-labelledby="chain-title"
      className="themed relative overflow-hidden"
    >
      <div className="container-x flex flex-col justify-center py-24 lg:h-[100svh] lg:min-h-[640px] lg:py-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow index="03" className="mb-6">
              Hypotéka není jen hypotéka
            </Eyebrow>
            <h2 id="chain-title" className="display display-lg">
              Hypotéka
              <br />
              není jen
              <br />
              <span className="serif-accent text-(--accent)">hypotéka.</span>
            </h2>
          </div>
          <p className="max-w-sm text-(--muted) lg:pb-3">
            Každý úvěr mění podmínky toho dalšího. Proto se vyplatí znát celou
            řadu dřív, než podepíšete první.
          </p>
        </div>

        <div data-track className="relative mt-12 lg:mt-16">
          <span
            aria-hidden="true"
            className="absolute left-[11px] top-0 h-full w-px bg-(--line) lg:hidden"
          >
            <span data-vline className="block h-full w-px bg-(--accent)" />
          </span>
          <span
            aria-hidden="true"
            className="absolute left-0 top-[2.05rem] hidden h-px w-full bg-(--line) lg:block"
          >
            <span data-line className="block h-px w-full bg-(--accent)" />
          </span>

          <ol
            data-rail
            className="flex flex-col gap-8 pl-9 lg:flex-row lg:gap-0 lg:pl-0"
          >
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-step
                className="group relative lg:w-[clamp(18rem,26vw,24rem)] lg:shrink-0 lg:pr-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-[-1.75rem] top-[0.55rem] size-2 rounded-full bg-(--fg) transition-colors group-[.is-active]:bg-(--accent) lg:left-0 lg:top-[1.85rem]"
                />
                <span className="numeral block text-[0.95rem] text-(--muted) lg:mb-9">
                  0{i + 1}
                </span>
                <h3 className="display display-sm mt-2">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[0.95rem] text-(--muted)">
                  {s.text}
                </p>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mt-4 block font-mono text-(--muted) lg:hidden"
                  >
                    ↓
                  </span>
                )}
              </li>
            ))}
            <li
              data-pointa
              className="flex items-center lg:w-[clamp(20rem,30vw,28rem)] lg:shrink-0"
            >
              <p className="serif-accent text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15] text-(--fg)">
                „Proto financování plánuji v kontextu toho, co přijde dál.“
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
