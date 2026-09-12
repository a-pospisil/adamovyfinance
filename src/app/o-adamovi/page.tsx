import type { Metadata } from "next";
import Image from "next/image";
import { Timeline } from "@/components/about/Timeline";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { CornerOrnament, MicroStrip } from "@/components/engraving/Engraving";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, PERSON_ID } from "@/lib/schema";
import { EGFIN, FACTS, SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "O Adamovi – finanční poradce, hypoteční specialista, investor",
  description:
    "Adam Pospíšil: 15+ let ve financích, zakladatel Evergreen Finance, specialista na financování investičních nemovitostí, investor od roku 2022 a lektor workshopů.",
  path: "/o-adamovi",
  image: "/images/adam-portrait.jpg",
});

const TIMELINE = [
  { year: "2010", title: "Začátek v bankách", text: "Osm let jako prémiový bankéř se specializací na investice. První škola toho, jak banka přemýšlí, počítá a rozhoduje." },
  { year: "2018", title: "Evergreen Finance", text: "Zakládám vlastní společnost. Investice, pojištění, úvěry. Rychle je jasné, kde je mezi potřebou klientů a nabídkou trhu největší díra." },
  { year: "2021", title: "Specializace", text: "Zúžení na financování a z něj úzká specializace, která v Česku chyběla: financování investičních nemovitostí." },
  { year: "2022", title: "Vlastní portfolio", text: "Kupuji první vlastní investiční nemovitost. Od té doby řeším stejná rozhodnutí jako klienti, se stejnými bankami." },
  { year: "2023", title: "Investoři", text: "Strategické spolupráce s předními českými investory. Portfolia o desítkách jednotek, bytové domy, struktury přes s.r.o." },
  { year: "2025", title: "Tým a objem", text: `Rozšíření týmu. Za rok ${FACTS.loans2025Mil} milionů korun sjednaných úvěrů, mimo jiné investorům se čtyřmi a více nemovitostmi.` },
  { year: "2026", title: "Workshopy", text: `Tým ${FACTS.teamSpecialists} specialistů, přes 100 milionů Kč úvěrů měsíčně a workshopy, na kterých učím investory přemýšlet o financování jako banka.` },
];

const PRINCIPLES = [
  { title: "Čísla před názory", text: "Každé doporučení má za sebou výpočet: splátku, cashflow, DSCR, celkové náklady. Když čísla nevycházejí, řeknu to." },
  { title: "Struktura před produktem", text: "Neprodávám hypotéky. Stavím struktury, ve kterých má každý úvěr, zástava i fixace roli v dlouhodobém plánu." },
  { title: "Dlouhodobost před provizí", text: "Klient, jehož portfolio roste deset let, je pro mě víc než rychlý podpis. Proto hlídám fixace i roky po podpisu." },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${SITE_URL}/o-adamovi`,
            name: "O Adamovi Pospíšilovi",
            mainEntity: { "@id": PERSON_ID },
          },
          breadcrumbSchema([{ name: "O Adamovi", path: "/o-adamovi" }]),
        ]}
      />

      <PageHero
        label="Adam Pospíšil · Praha"
        numeral="01"
        title={
          <>
            Vím, jak přemýšlí banka. <span className="italic-accent text-burgundy">Počítám jako investor.</span>
          </>
        }
        lead={
          <p>
            Finanční poradce, hypoteční specialista, investor a lektor. Ne čtyři role, ale jeden úhel pohledu:
            financování jako nástroj pro růst realitního portfolia.
          </p>
        }
        aside={
          <div className="relative">
            <CornerOrnament className="absolute -left-3 -top-3 z-10 size-9" tone="gold" opacity={0.7} />
            <CornerOrnament className="absolute -bottom-3 -right-3 z-10 size-9" tone="gold" opacity={0.7} flipX flipY />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/adam-portrait.jpg"
                alt="Adam Pospíšil, portrét"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-[52%_16%]"
              />
            </div>
            <p className="microtype mt-3">A. P. / Praha / CZ</p>
          </div>
        }
      />

      <Section theme="paper" ariaLabelledby="story-title" className="border-t border-(--line)">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="01">Příběh</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="story-title" className="display display-md mt-10 max-w-[12ch]">
                Od hypoték ke specializaci, <span className="italic-accent text-burgundy">která chyběla.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={100}>
            <div className="max-w-2xl space-y-5 text-[1.05rem] leading-relaxed">
              <p>
                Ve financích jsem od roku {FACTS.sinceYear}. Prvních osm let v bankách jako prémiový bankéř se
                specializací na investice. Tam jsem pochopil, že banka není protivník ani kamarád. Je to systém
                s vlastní logikou, který posuzuje jednu žádost, jeden odhad a jedno rozhodnutí.
              </p>
              <p className="text-(--muted)">
                V roce 2018 jsem založil {EGFIN.name}. Místo rozšiřování nabídky o pojištění a spoření jsem šel opačným
                směrem: zužoval jsem, až zůstalo jediné. Financování investičních nemovitostí. To, co většina lidí
                u hypotéky neřeší: cashflow, návratnost, LTV a DSCR, dlouhodobá udržitelnost celého portfolia.
              </p>
              <p className="text-(--muted)">
                Od roku {FACTS.ownPortfolioSince} stavím vlastní portfolio nájemních nemovitostí stejnými principy, které
                doporučuji klientům. Dnes vedu tým {FACTS.teamSpecialists} specialistů a na workshopech učím investory
                přemýšlet o financování tak, jak o něm přemýšlí banka.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section theme="ink" ariaLabelledby="timeline-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="02">Timeline</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="timeline-title" className="display display-md mt-10">
                Začátek <span className="italic-accent text-gold-300">→ portfolio.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <MicroStrip text="CZ / 2010–2026" repeat={3} className="mt-10 hidden lg:block" />
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Timeline items={TIMELINE} />
          </div>
        </div>
      </Section>

      <Section theme="paper" ariaLabelledby="principles-title">
        <Reveal>
          <SectionMark index="03">Tři pravidla</SectionMark>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="principles-title" className="display display-md mt-10 max-w-[10ch]">
            Jak <span className="italic-accent text-burgundy">pracuji.</span>
          </h2>
        </Reveal>
        <ol className="mt-12 border-t border-(--line-strong)">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 70}
              className="grid gap-3 border-b border-(--line) py-8 md:grid-cols-12 md:gap-8"
            >
              <span className="label-sm tabular text-(--accent) md:col-span-1">0{i + 1}</span>
              <h3 className="display display-sm md:col-span-4">{p.title}</h3>
              <p className="max-w-xl text-[0.98rem] text-(--muted) md:col-span-7">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section theme="cocoa" ariaLabelledby="personal-title" className="overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <div className="relative aspect-[3/2] overflow-hidden lg:aspect-[4/5]">
              <Image
                src="/images/adam-desk.jpg"
                alt="Adam Pospíšil u pracovního stolu"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover object-[58%_45%]"
              />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7" delay={80}>
            <SectionMark index="04">Mimo čísla</SectionMark>
            <h2 id="personal-title" className="display display-md mt-10 max-w-[12ch]">
              Praha, rodina, <span className="italic-accent text-gold-300">technologie.</span>
            </h2>
            <p className="mt-7 max-w-lg text-(--muted)">
              Žiji v Praze, jsem manžel a otec malé dcery. Zajímají mě technologie, automatizace a produktivita.
              A pořád stejná otázka, kterou řeším pro klienty i pro sebe: jak z financování udělat nástroj pro
              dlouhodobý růst majetku, ne jen měsíční splátku.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/kontakt">Probrat financování</Button>
              <Button href={SITE.instagram} external variant="outline">
                Instagram {SITE.instagramHandle}
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
