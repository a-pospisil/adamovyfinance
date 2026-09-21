import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CornerOrnament, Guilloche, MicroStrip, Numeral, WaveField } from "@/components/engraving/Engraving";

/** 01 — Adam. Nejdřív člověk: jméno, tvář, jedna věta o tom, co dělá. */
export function Hero() {
  return (
    <section data-theme="paper" aria-labelledby="hero-title" className="themed relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <WaveField className="absolute inset-0 h-full w-full" tone="brown" opacity={0.07} />
        <Guilloche className="absolute -left-40 top-1/2 size-[34rem] -translate-y-1/2 lg:-left-52 lg:size-[44rem]" opacity={0.16} />
        <Numeral value="01" className="absolute -left-4 bottom-8 text-[16rem] leading-none lg:text-[22rem]" tone="brown" opacity={0.05} />
      </div>

      <div className="container-x relative grid min-h-[100svh] items-center gap-12 pb-16 pt-24 sm:pt-28 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-28">
        <div className="lg:col-span-7">
          <p className="label-xs">Adamovy finance · Adam Pospíšil</p>

          <h1 id="hero-title" className="display display-xl mt-6 max-w-[13ch]">
            Banka vidí úvěr.
            <br />
            <span className="italic-accent text-burgundy">Já vidím portfolio.</span>
          </h1>

          <p className="lead mt-7 max-w-md">Financování investičních nemovitostí pro investory.</p>

          <p className="label-sm mt-6 text-(--accent)">Investor · Hypoteční specialista · Lektor</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/kontakt">Probrat financování</Button>
            <Button href="/workshopy" variant="outline">
              Workshop
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-sm lg:ml-auto lg:mr-0 lg:max-w-none">
            <CornerOrnament className="absolute -left-3 -top-3 z-10 size-10" opacity={0.75} />
            <CornerOrnament className="absolute -bottom-3 -right-3 z-10 size-10" opacity={0.75} flipX flipY />
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/adam-hero.jpg"
                alt="Adam Pospíšil"
                fill
                priority
                sizes="(max-width: 1024px) 88vw, 38vw"
                className="object-cover object-[50%_12%]"
              />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <p className="microtype">Adam Pospíšil / Praha</p>
              <p className="microtype shrink-0">CZ / 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x relative hidden border-t border-(--line) py-4 lg:block">
        <MicroStrip text="Adamovy finance · Investice · Hypotéky · Portfolio" repeat={5} />
      </div>
    </section>
  );
}
