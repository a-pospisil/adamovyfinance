import { Button } from "@/components/ui/Button";
import { CornerOrnament, Guilloche, MicroStrip, Numeral, WaveField } from "@/components/engraving/Engraving";

/** Otevření webu: papír, rytina, jedno velké tvrzení. Nic víc. */
export function Hero() {
  return (
    <section data-theme="paper" aria-labelledby="hero-title" className="themed relative overflow-hidden">
      {/* Rytinová vrstva — objeví se až při druhém pohledu. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[62%] max-w-[56rem]">
        <WaveField className="absolute inset-0 h-full w-full" tone="brown" opacity={0.08} />
        <Guilloche className="absolute -right-16 top-1/2 size-[38rem] -translate-y-1/2 sm:size-[46rem]" tone="gold" opacity={0.18} />
        <Numeral
          value="01"
          className="absolute right-[6%] top-1/2 -translate-y-1/2 text-[26rem] leading-none sm:text-[34rem]"
          tone="brown"
          opacity={0.055}
        />
      </div>

      <CornerOrnament className="pointer-events-none absolute left-5 top-24 size-12 sm:left-10" tone="brown" opacity={0.4} />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-center pb-16 pt-28 sm:pt-32">
        <p className="label-xs">Adam Pospíšil</p>

        <h1 id="hero-title" className="display display-xl mt-7 max-w-[15ch]">
          Banka vidí úvěr.
          <br />
          <span className="italic-accent text-burgundy">Já vidím portfolio.</span>
        </h1>

        <p className="lead mt-8 max-w-md">Financování investičních nemovitostí pro investory.</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/kontakt">Probrat financování</Button>
          <Button href="/workshopy" variant="outline">
            Workshop
          </Button>
        </div>

        <div className="mt-auto hidden items-baseline justify-between gap-8 border-t border-(--line) pt-5 lg:flex">
          <MicroStrip text="Investment · Financing · Real estate" repeat={4} className="max-w-[52%]" />
          <p className="microtype shrink-0">CZ / 2026 · A. P. / 01</p>
        </div>
      </div>
    </section>
  );
}
