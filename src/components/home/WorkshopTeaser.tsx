import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Lines } from "@/components/ui/Lines";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { WorkshopTopics } from "@/components/workshops/WorkshopTopics";
import { FACTS } from "@/lib/site";
import { WORKSHOPS } from "@/lib/workshops";

/** Cinematic workshop block: the second main product of the brand. */
export function WorkshopTeaser({ now }: { now: Date }) {
  return (
    <section data-theme="dark" aria-labelledby="ws-title" className="themed section-y">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow index="10">Workshopy</Eyebrow>
            <Lines as="h2" className="display display-lg mt-6">
              Financování investičních nemovitostí
            </Lines>
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-sand">
              Workshop Adama Pospíšila · Praha · max. {FACTS.workshopCapacity} lidí · {FACTS.workshopAlumni}+ absolventů
            </p>
            <Reveal delay={0.1}>
              <p className="serif-accent mt-10 max-w-2xl text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.15]">
                „Naučím vás přemýšlet o financování tak, jak o něm přemýšlí banka.“
              </p>
              <p className="mt-6 max-w-xl text-sand">
                Žádné motivační řeči. Metodiky bank, bonita, LTV, DTI, zástavy a struktura, kterou používám na
                vlastním portfoliu i u klientů. Dvě úrovně podle toho, kde dnes stojí vaše portfolio.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <ParallaxImage
              src="/images/adam-seated.jpg"
              alt="Adam Pospíšil, lektor workshopů financování investičních nemovitostí"
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-[50%_15%]"
              caption="Lektor · Adam Pospíšil"
            />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {WORKSHOPS.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.1}>
              <WorkshopCard workshop={w} now={now} compact />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <p className="mono-label text-sand">Co na workshopu rozebíráme</p>
          <WorkshopTopics className="mt-6" />
        </Reveal>

        <Reveal className="mt-14 flex flex-wrap items-center gap-6">
          <Button href="/workshopy" size="lg" magnetic>
            Chci na workshop
          </Button>
          <p className="max-w-xs text-[0.9rem] text-sand">Program, pro koho workshop je a pro koho ne, ceny a rezervace míst.</p>
        </Reveal>
      </div>
    </section>
  );
}
