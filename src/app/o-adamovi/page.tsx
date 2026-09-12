import type { Metadata } from "next";
import Image from "next/image";
import { Timeline } from "@/components/about/Timeline";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, PERSON_ID } from "@/lib/schema";
import { EGFIN, FACTS, SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "O Adamovi – finanční poradce, hypoteční specialista, investor",
  description:
    "Adam Pospíšil: 15+ let ve financích, zakladatel Evergreen Finance, specialista na financování investičních nemovitostí, investor do nájemních nemovitostí od roku 2022 a lektor workshopů.",
  path: "/o-adamovi",
  image: "/images/adam-suit.jpg",
});

const TIMELINE = [
  { year: "2010", title: "Začátek. Banky.", text: "Nástup do bankovnictví. Osm let jako prémiový bankéř se specializací na investice: první škola toho, jak banka přemýšlí, počítá a rozhoduje." },
  { year: "2018", title: "Evergreen Finance", text: "Zakládám vlastní společnost. Investice, pojištění, úvěry. Rychle je jasné, kde je největší rozdíl mezi tím, co klienti potřebují, a tím, co trh nabízí." },
  { year: "2021", title: "Specializace", text: "Zúžení na financování. A z něj úzká specializace, která v Česku chyběla: financování investičních nemovitostí. Metodiky bank, bonita, struktura." },
  { year: "2022", title: "Vlastní portfolio", text: "Kupuji první vlastní investiční nemovitost. Od té doby řeším stejná rozhodnutí jako moji klienti, se stejnými bankami a stejnými pravidly." },
  { year: "2023", title: "Investoři", text: "Strategické spolupráce s předními českými investory do nemovitostí. Financování portfolií o desítkách jednotek, bytové domy, struktury přes s.r.o." },
  { year: "2025", title: "Tým a objem", text: `Rozšíření týmu o další specialisty. Za rok ${FACTS.loans2025Mil} milionů korun sjednaných úvěrů, mimo jiné investorům se čtyřmi a více nemovitostmi.` },
  { year: "2026", title: "Workshopy", text: `Tým ${FACTS.teamSpecialists} specialistů, přes 100 milionů Kč úvěrů měsíčně, pobočky v Praze a Kutné Hoře. A workshopy, na kterých učím investory přemýšlet o financování jako banka.` },
];

const PRINCIPLES = [
  { title: "Čísla před názory", text: "Každé doporučení má za sebou výpočet: splátku, cashflow, DSCR, celkové náklady. Když čísla nevycházejí, řeknu to, i kdyby to znamenalo žádný obchod." },
  { title: "Struktura před produktem", text: "Neprodávám hypotéky. Stavím struktury financování, ve kterých má každý úvěr, zástava i fixace svou roli v dlouhodobém plánu." },
  { title: "Dlouhodobost před provizí", text: "Klient, jehož portfolio roste deset let, je pro mě víc než rychlý podpis. Proto hlídám fixace a příležitosti i roky po podpisu." },
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
        eyebrow="Adam Pospíšil · Praha"
        title={
          <>
            Vím, jak přemýšlí banka. <span className="serif-accent text-moss-300">Přemýšlím jako investor.</span>
          </>
        }
        lead={
          <p>
            Finanční poradce, hypoteční specialista, specialista na financování investičních nemovitostí, investor a
            lektor. Ne pět rolí, ale jeden úhel pohledu: financování jako nástroj pro růst realitního portfolia.
          </p>
        }
        aside={
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/adam-suit.jpg" alt="Adam Pospíšil, portrét" fill priority sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-[50%_10%]" />
          </div>
        }
      />

      <Section theme="light" ariaLabelledby="story-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="01">Příběh</Eyebrow>
            <h2 id="story-title" className="display display-md mt-6">
              Od hypoték ke specializaci, <span className="serif-accent text-(--accent)">která v Česku chyběla.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <div className="space-y-5 text-[1.05rem] leading-relaxed">
              <p>
                Ve financích jsem od roku {FACTS.sinceYear}. Prvních osm let v bankách, jako prémiový bankéř se
                specializací na investice. Tam jsem pochopil, že banka není protivník ani kamarád. Je to systém
                s vlastní logikou, který posuzuje jednu žádost, jeden odhad a jedno rozhodnutí.
              </p>
              <p>
                V roce 2018 jsem založil {EGFIN.name}. Místo rozšiřování nabídky o pojištění a spoření jsem šel
                opačným směrem: zužoval jsem, až zůstalo jediné. Financování investičních nemovitostí. To, co většina
                lidí u hypotéky neřeší: cashflow, návratnost, LTV a DSCR, dlouhodobá udržitelnost celého portfolia.
              </p>
              <p>
                Od roku {FACTS.ownPortfolioSince} stavím vlastní portfolio nájemních nemovitostí stejnými principy, které
                doporučuji klientům. Dnes vedu tým {FACTS.teamSpecialists} specialistů, ročně sjednáváme úvěry v řádu
                stovek milionů korun a na workshopech učím investory přemýšlet o financování tak, jak o něm přemýšlí
                banka.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section theme="dark" ariaLabelledby="timeline-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="02">Timeline</Eyebrow>
            <h2 id="timeline-title" className="display display-md mt-6">
              Začátek <span className="serif-accent text-moss-300">→ portfolio.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sand">Sedm kroků od bankovní přepážky k vlastnímu portfoliu a workshopům.</p>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <Timeline items={TIMELINE} />
          </div>
        </div>
      </Section>

      <Section theme="light" ariaLabelledby="principles-title">
        <Reveal>
          <Eyebrow index="03">Tři pravidla, která neporušuji</Eyebrow>
          <h2 id="principles-title" className="display display-md mt-6">
            Jak <span className="serif-accent text-(--accent)">pracuji.</span>
          </h2>
        </Reveal>
        <ol className="mt-12 grid border-t border-(--line) md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.1} className="border-b border-(--line) py-8 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8">
              <span className="numeral text-[1.5rem] text-(--muted)">0{i + 1}</span>
              <h3 className="display display-sm mt-4">{p.title}</h3>
              <p className="mt-4 text-(--muted)">{p.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section theme="dark" ariaLabelledby="personal-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="order-2 lg:order-1 lg:col-span-5">
            <ParallaxImage
              src="/images/adam-laptop.jpg"
              alt="Adam Pospíšil při telefonátu u notebooku"
              sizes="(max-width: 1024px) 100vw, 40vw"
              frameClassName="aspect-[3/2] lg:aspect-[4/5]"
              className="object-[60%_50%]"
            />
          </Reveal>
          <Reveal className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7" delay={0.1}>
            <Eyebrow index="04">Mimo čísla</Eyebrow>
            <h2 id="personal-title" className="display display-md mt-6">
              Praha, rodina, <span className="serif-accent text-moss-300">technologie.</span>
            </h2>
            <p className="mt-8 max-w-lg text-sand">
              Žiji v Praze, jsem manžel a otec malé dcery. Zajímají mě technologie, automatizace, AI nástroje a
              produktivita. A pořád stejná otázka, kterou řeším pro klienty i pro sebe: jak z financování udělat
              nástroj pro dlouhodobý růst majetku, ne jen měsíční splátku.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/kontakt" magnetic>Probrat mé financování</Button>
              <Button href={SITE.instagram} external variant="outline" magnetic>Instagram {SITE.instagramHandle}</Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
