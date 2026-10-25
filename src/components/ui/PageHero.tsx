import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { BanknoteGround, BanknoteRosette } from "@/components/engraving/Engraving";

type Props = {
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  /** Fotka vpravo v zlatém rámu s rozetou přes roh (jako úvod titulní stránky). */
  image?: { src: string; alt: string; position?: string };
};

/** Úvod podstránky ve stylu titulní stránky: ochranná síť, rozeta bankovky, nadtitulek kapitálkami. */
export function PageHero({ label, title, lead, aside, image }: Props) {
  const side = aside ?? (image ? <FramedPhoto {...image} /> : null);
  return (
    <section data-theme="paper" className="themed relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
      <BanknoteGround border={false} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <BanknoteRosette className="absolute -left-[22rem] top-1/2 size-[40rem] -translate-y-1/2 lg:-left-[28rem] lg:size-[50rem]" opacity={0.14} />
      </div>

      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className={side ? "lg:col-span-7" : "lg:col-span-9"}>
          <Reveal>
            <p className="display text-[1.2rem] lowercase tracking-[0.08em] text-brown [font-variant:small-caps]">{label}</p>
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
        {side && (
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={120}>
            {side}
          </Reveal>
        )}
      </div>
    </section>
  );
}

function FramedPhoto({ src, alt, position = "50% 20%" }: { src: string; alt: string; position?: string }) {
  return (
    <figure className="relative">
      <div className="relative border border-gold/70 p-2">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image src={src} alt={alt} fill priority sizes="(max-width: 1024px) 88vw, 30vw" className="object-cover" style={{ objectPosition: position }} />
        </div>
        <BanknoteRosette
          className="pointer-events-none absolute -bottom-[8rem] -right-[8.5rem] size-[18rem] mix-blend-multiply lg:-bottom-[11rem] lg:-right-[12rem] lg:size-[26rem]"
          opacity={0.9}
        />
      </div>
    </figure>
  );
}
