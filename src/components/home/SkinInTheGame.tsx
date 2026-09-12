"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/ui/Section";
import { FACTS } from "@/lib/site";
import { getGsap, MOTION_OK } from "@/lib/motion";

const CHAIN = ["Vlastní portfolio", "Vlastní úvěry", "Vlastní cashflow", "Vlastní rozhodnutí"];

/** "Radím s tím, co sám dělám": sticky editorial portrait and the chain of own decisions. */
export function SkinInTheGame() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(q("[data-img] img"), {
          scale: 1.18,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: q("[data-img]")[0], start: "top 80%", once: true },
        });
        gsap.from(q("[data-img]"), {
          clipPath: "inset(12% 0 12% 0)",
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-img]")[0], start: "top 80%", once: true },
        });
        gsap.from(q("[data-chain]"), {
          opacity: 0,
          x: -18,
          duration: 0.8,
          stagger: 0.14,
          scrollTrigger: { trigger: q("[data-chain]")[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" aria-labelledby="skin-title" className="themed section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div data-img className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28">
            <Image
              src="/images/adam-vest-window.jpg"
              alt="Adam Pospíšil u okna, portrét"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[50%_20%]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ivory-100/90">
              Adam Pospíšil · investor od roku {FACTS.ownPortfolioSince}
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Eyebrow index="06">Skin in the game</Eyebrow>
          <h2 id="skin-title" className="display display-lg mt-6">
            Radím s tím, <span className="serif-accent text-moss-300">co sám dělám.</span>
          </h2>
          <p className="lead mt-8 max-w-lg text-sand">
            Když mluvím o financování investičních nemovitostí, nemluvím pouze z bankovní metodiky. Stejná
            rozhodnutí řeším i jako investor.
          </p>

          <ol className="mt-10 border-t border-(--line)">
            {CHAIN.map((c, i) => (
              <li key={c} data-chain className="flex items-baseline gap-5 border-b border-(--line) py-5">
                <span className="numeral text-[0.9rem] text-sand">0{i + 1}</span>
                <span className="display display-sm">{c}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-lg text-sand">
            Vlastní portfolio nájemních nemovitostí stavím od roku {FACTS.ownPortfolioSince} stejnými principy, které
            doporučuji klientům: struktura před produktem, čísla před názory, dlouhodobost před rychlým podpisem.
            Když řeknu, že struktura funguje, je to proto, že ji sám používám.
          </p>
        </div>
      </div>
    </section>
  );
}
