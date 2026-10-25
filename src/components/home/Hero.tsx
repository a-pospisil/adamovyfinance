import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BanknoteGround, BanknoteRosette } from "@/components/engraving/Engraving";

/** Úvod — Adam. Nejdřív člověk: jméno, tvář, jedna věta o tom, co dělá. Rozeta v popředí přes fotku jako tisk na bankovce. */
export function Hero() {
  return (
    <section data-theme="paper" aria-labelledby="hero-title" className="themed relative isolate overflow-hidden">
      <BanknoteGround border={false} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <BanknoteRosette className="absolute -left-[20rem] top-1/2 size-[40rem] -translate-y-1/2 lg:-left-[27rem] lg:size-[54rem]" opacity={0.16} />
        {/* Iridiscentní pruh jako u pravého okraje bankovky. */}
        <div className="absolute inset-y-0 right-[3.5%] hidden w-16 bg-[linear-gradient(180deg,rgb(212_182_134/0)_0%,rgb(212_182_134/0.38)_18%,rgb(102_80_107/0.22)_42%,rgb(83_107_88/0.2)_62%,rgb(212_182_134/0.36)_82%,rgb(212_182_134/0)_100%)] md:block" />
      </div>

      <div className="container-x relative grid min-h-[100svh] items-end gap-12 pb-20 pt-28 sm:pt-32 lg:grid-cols-12 lg:gap-14 lg:pb-24 lg:pt-36">
        <div className="flex flex-col gap-8 lg:col-span-7 lg:pb-10">
          <p className="display text-[1.25rem] tracking-[0.08em] text-brown [font-variant:small-caps]">
            financování investičních nemovitostí · praha
          </p>

          <h1 id="hero-title" className="display text-[clamp(3rem,7.2vw,7rem)] leading-[0.98] tracking-[-0.02em]">
            Banka vidí úvěr.
            <br />
            <span className="italic-accent text-burgundy">Já vidím portfolio.</span>
          </h1>

          <p className="max-w-md text-[1.2rem] leading-relaxed text-(--muted)">
            Pomáhám investorům financovat nemovitosti tak, aby první úvěr nezablokoval ten další.
          </p>

          <div className="flex flex-wrap items-center gap-7">
            <Button href="/kontakt">Probrat financování</Button>
            <Link
              href="/workshopy"
              className="tap border-b border-(--line-strong) pb-0.5 text-[0.95rem] transition-colors hover:border-(--accent) hover:text-(--accent)"
            >
              Workshop pro investory
            </Link>
          </div>
        </div>

        <figure className="relative flex flex-col gap-3 lg:col-span-5">
          <div className="relative border border-gold/70 p-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/adam-hero.jpg"
                alt="Adam Pospíšil"
                fill
                priority
                sizes="(max-width: 1024px) 88vw, 38vw"
                className="object-cover object-[50%_14%]"
              />
            </div>
            {/* Rozeta v popředí přes pravý dolní roh fotografie. */}
            <BanknoteRosette
              className="pointer-events-none absolute -bottom-[9.5rem] -right-[10rem] size-[22rem] mix-blend-multiply lg:-bottom-[16.9rem] lg:-right-[17.5rem] lg:size-[39.4rem]"
              opacity={0.95}
            />
          </div>
          <figcaption className="flex justify-between gap-4 text-[0.75rem] text-(--muted)">
            <span>Adam Pospíšil, zakladatel Evergreen Finance</span>
            <span>Praha</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
