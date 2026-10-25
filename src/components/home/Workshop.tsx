import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SoldOutStamp } from "@/components/engraving/Engraving";
import { formatCzk } from "@/lib/format";
import { FACTS } from "@/lib/site";
import { bundleStatus, formatDayMonth, formatWorkshopDate, workshopStatus, WORKSHOPS } from "@/lib/workshops";

/** 6) Workshop. Pokračování příběhu, ne další služba; vpravo fotka. */
export function Workshop({ now }: { now: Date }) {
  const bundle = bundleStatus(now);
  return (
    <Section theme="paper" ariaLabelledby="ws-title" className="border-t border-(--line)">
      {/* Razítko přes celou sekci, otištěné našikmo jako rukou. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <SoldOutStamp className="w-[96%] max-w-none translate-y-[16%] -rotate-[8deg] opacity-85 mix-blend-multiply" />
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Reveal delay={60}>
            <h2 id="ws-title" className="display display-lg max-w-[14ch]">
              To, co používám u klientů, <span className="italic-accent text-burgundy">učím i investory.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead mt-8 max-w-md">
              Dva večery v Praze pro {FACTS.workshopCapacity} lidí. Začínajícím: jak financovat první čtyři nemovitosti
              bez čekání, až naspoříte. Pokročilým: jak zvednout strop, když banka řekla ne. Přes{" "}
              {FACTS.workshopAlumni} absolventů.
            </p>
          </Reveal>

          <ol className="mt-10 border-t border-(--line-strong)">
            {WORKSHOPS.map((w, i) => {
              const status = workshopStatus(w, now);
              const when = formatWorkshopDate(w);
              return (
                <Reveal as="li" key={w.slug} delay={i * 70} className="border-b border-(--line) py-5">
                  <div className="flex items-baseline justify-between gap-5">
                    <p className="label-xs tabular text-(--accent)">
                      {status.phase === "past" ? "Nový termín" : when.date}
                    </p>
                    <p className="nominal text-xl">{formatCzk(status.priceNow)}</p>
                  </div>
                  <p className="display display-sm mt-2">{w.title}</p>
                  <p className="mt-1 text-[0.85rem] text-(--muted)">{w.level}</p>
                </Reveal>
              );
            })}
          </ol>
          {bundle.phase !== "past" && (
            <Reveal delay={120} className="mt-5">
              <p className="text-[0.9rem] text-(--muted)">
                Obě úrovně + nástroje pro investora: <span className="text-(--fg)">{formatCzk(bundle.priceNow)}</span>
                {bundle.phase === "early" && bundle.earlyUntil ? <> do {formatDayMonth(bundle.earlyUntil)}</> : "."}
              </p>
            </Reveal>
          )}
          <Reveal delay={140} className="mt-8">
            <Button href="/workshopy">Chci na workshop</Button>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8 lg:self-center" delay={100}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/adam-seated.jpg"
              alt="Adam Pospíšil sedí v křesle"
              fill
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
