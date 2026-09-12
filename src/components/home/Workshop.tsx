import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { MicroStrip } from "@/components/engraving/Engraving";
import { formatCzk } from "@/lib/format";
import { FACTS } from "@/lib/site";
import { formatDayMonth, formatWorkshopDate, workshopStatus, WORKSHOPS } from "@/lib/workshops";

/** 04 — Workshop. Dva termíny jako řádky v programu, ne jako karty. */
export function Workshop({ now }: { now: Date }) {
  return (
    <Section theme="cocoa" ariaLabelledby="ws-title" className="overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionMark index="04">Workshop</SectionMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="ws-title" className="display display-lg mt-12 max-w-[14ch]">
              Naučím vás číst žádost <span className="italic-accent text-gold-300">očima banky.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead mt-8 max-w-lg">
              Večerní workshop v Praze pro investory. Metodiky, bonita, LTV, DTI, zástavy. Žádné motivační řeči, jen
              čísla. Kapacita {FACTS.workshopCapacity} lidí.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-4 lg:col-start-9" delay={100}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/adam-seated.jpg"
              alt="Adam Pospíšil, lektor workshopů financování investičních nemovitostí"
              fill
              sizes="(max-width: 1024px) 100vw, 30vw"
              className="object-cover object-[50%_12%]"
            />
          </div>
          <p className="microtype mt-3">Lektor / A. P.</p>
        </Reveal>
      </div>

      <ol className="mt-16 border-t border-(--line)">
        {WORKSHOPS.map((w, i) => {
          const status = workshopStatus(w, now);
          const when = formatWorkshopDate(w);
          return (
            <Reveal
              as="li"
              key={w.slug}
              delay={i * 80}
              className="grid gap-4 border-b border-(--line) py-8 md:grid-cols-12 md:items-baseline md:gap-8"
            >
              <p className="label-sm tabular text-(--accent) md:col-span-2">
                {status.phase === "past" ? "Nový termín" : when.date}
              </p>
              <h3 className="display display-sm md:col-span-4">{w.level}</h3>
              <p className="text-[0.95rem] text-(--muted) md:col-span-3">
                {status.phase === "past" ? "Termín připravuji" : `${w.place.name}, ${when.time}`}
              </p>
              <p className="md:col-span-2 md:text-right">
                <span className="nominal text-2xl">{formatCzk(status.priceNow)}</span>
                {status.phase === "early" && status.earlyUntil && (
                  <span className="label-xs mt-1 block md:text-right">do {formatDayMonth(status.earlyUntil)}</span>
                )}
              </p>
              <p className="md:col-span-1 md:text-right">
                <a
                  href={status.phase === "past" ? "/kontakt" : w.url}
                  className="label-sm border-b border-(--line-strong) pb-0.5 transition-colors hover:border-(--accent) hover:text-(--accent)"
                  {...(status.phase === "past" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                >
                  Detail
                </a>
              </p>
            </Reveal>
          );
        })}
      </ol>

      <Reveal delay={120} className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <Button href="/workshopy" variant="outline">
          Program workshopu
        </Button>
        <MicroStrip text="Praha · Investment financing" repeat={3} className="hidden max-w-[40%] sm:block" />
      </Reveal>
    </Section>
  );
}
