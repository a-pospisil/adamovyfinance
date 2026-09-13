import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Guilloche, Numeral, WaveField } from "@/components/engraving/Engraving";

type Props = {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  numeral?: string;
};

/** Záhlaví podstránky: papír, jemná rytina, jedno velké tvrzení. */
export function PageHero({ label, title, lead, aside, numeral }: Props) {
  return (
    <section data-theme="paper" className="themed relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-1/2 max-w-3xl">
        <WaveField className="absolute inset-0 h-full w-full" tone="brown" opacity={0.06} />
        <Guilloche className="absolute -right-24 top-1/2 size-[30rem] -translate-y-1/2" opacity={0.14} />
        {numeral && (
          <Numeral
            value={numeral}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 text-[16rem] leading-none"
            tone="brown"
            opacity={0.06}
          />
        )}
      </div>

      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-9"}>
          <Reveal>
            <p className="label-xs">{label}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display display-lg mt-6 max-w-[14ch]">{title}</h1>
          </Reveal>
          {lead && (
            <Reveal delay={140}>
              <div className="lead mt-8 max-w-xl">{lead}</div>
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={120}>
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}
