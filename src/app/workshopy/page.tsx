import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WorkshopCard } from "@/components/workshops/WorkshopCard";
import { WorkshopTopics } from "@/components/workshops/WorkshopTopics";
import { WORKSHOP_CASES } from "@/lib/caseStudies";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, ORG_ID, PERSON_ID } from "@/lib/schema";
import { CNB_2026, EGFIN, FACTS, SITE_URL } from "@/lib/site";
import { WORKSHOPS, workshopStatus } from "@/lib/workshops";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Workshop financování investičních nemovitostí",
  description:
    "Workshop Adama Pospíšila v Praze: bonita, LTV, DTI, zástavy, refinancování, s.r.o. a metodiky bank. Dvě úrovně pro začínající i pokročilé investory, max. 30 lidí.",
  path: "/workshopy",
});

const FAQ = [
  {
    q: "Je workshop pro úplného začátečníka?",
    a: "Ano, workshop pro začínající investory nepředpokládá žádné znalosti. Vysvětluji vše od základu a bez bankovního žargonu. Investorům se čtyřmi a více nemovitostmi je určený workshop pro pokročilé.",
  },
  {
    q: "Bude se řešit můj konkrétní případ?",
    a: "Na workshopu probíráme postupy a rámce, aby si každý uměl poradit sám. Konkrétní propočet a osobní situaci řeším v rámci individuální konzultace.",
  },
  {
    q: "Co když mě banka už jednou odmítla?",
    a: "Přesně na to se díváme: na co se banky při posouzení dívají, proč běžně odmítají a co se s tím dá v rámci metodik dělat. Bez slibů, s čísly.",
  },
  {
    q: "Proč je kapacita omezená na 30 lidí?",
    a: "Aby měl každý účastník prostor na svůj dotaz a odešel s odpovědí platnou pro svou situaci. Není to masová akce.",
  },
  {
    q: "Jak dlouho workshop trvá a kde se koná?",
    a: "Oficiální program trvá od 18:00 do 20:30 v Baťově paláci na Václavském náměstí v Praze. Kdo chce, zůstává na neformální networking.",
  },
];

export default function WorkshopsPage() {
  const now = new Date();
  const events = WORKSHOPS.map((w) => {
    const s = workshopStatus(w, now);
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${w.title} – workshop ${w.level.toLowerCase()}`,
      description: w.description,
      startDate: w.start,
      endDate: w.end,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: w.place.name,
        address: { "@type": "PostalAddress", streetAddress: w.place.street, addressLocality: "Praha", postalCode: w.place.zip, addressCountry: "CZ" },
      },
      image: `${SITE_URL}/images/adam-seated.jpg`,
      performer: { "@id": PERSON_ID },
      organizer: { "@type": "Organization", name: "Monopoly advisory s.r.o.", url: EGFIN.workshops },
      offers: {
        "@type": "Offer",
        url: w.url,
        price: s.priceNow,
        priceCurrency: "CZK",
        availability: s.phase === "past" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        ...(s.earlyUntil ? { priceValidUntil: s.earlyUntil.slice(0, 10) } : {}),
      },
      maximumAttendeeCapacity: w.capacity,
      inLanguage: "cs",
      isAccessibleForFree: false,
      about: { "@id": ORG_ID },
    };
  });

  return (
    <main>
      <JsonLd data={[...events, breadcrumbSchema([{ name: "Workshopy", path: "/workshopy" }]), faqSchema(FAQ)]} />

      <PageHero
        eyebrow="Workshopy Adama Pospíšila · Praha"
        title={
          <>
            Financování investičních <span className="serif-accent text-moss-300">nemovitostí.</span>
          </>
        }
        lead={
          <p>
            Naučím vás přemýšlet o financování tak, jak o něm přemýšlí banka. Metodiky, bonita, struktura. Dvě
            úrovně podle toho, kde dnes stojí vaše portfolio. Max. {FACTS.workshopCapacity} lidí, {FACTS.workshopAlumni}+
            absolventů.
          </p>
        }
        aside={
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/adam-standing-wall.jpg" alt="Adam Pospíšil" fill priority sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-[50%_20%]" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ivory-100/90">
              {FACTS.yearsInFinance}+ let ve financích · {FACTS.loans2025Mil} mil. Kč úvěrů v roce 2025
            </p>
          </div>
        }
      />

      <Section theme="dark" padded={false} className="pb-20 lg:pb-28">
        <div className="grid gap-5 lg:grid-cols-2">
          {WORKSHOPS.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.1}>
              <WorkshopCard workshop={w} now={now} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-[0.85rem] text-sand">
          Rezervace míst a platba probíhá přes stránky workshopů Evergreen Finance. Pořadatelem je Monopoly advisory s.r.o.
          Nejčastěji lidé berou obě úrovně za sebou: základ ve středu, pokročilé strategie ve čtvrtek.
        </p>
      </Section>

      <Section theme="light" ariaLabelledby="cnb-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Eyebrow index="01">Nová pravidla</Eyebrow>
            <h2 id="cnb-title" className="display display-md mt-6">
              Co se změnilo <span className="serif-accent text-(--accent)">od {CNB_2026.effectiveFrom}</span>
            </h2>
            <p className="mt-6 max-w-md text-(--muted)">
              Doporučení ČNB pro hypotéky na investiční nemovitost: úvěr na třetí a další obytnou nemovitost nebo na
              nemovitost k pronájmu. Počítá se i družstevní podíl a nemovitost v zahraničí. Přísnější limity platí jen
              pro úvěr na nákup, netýkají se právnických osob.
            </p>
            <p className="mt-4 max-w-md text-(--muted)">
              Neučím obcházet pravidla. Učím jim rozumět natolik, abyste věděli, jaké možnosti vám dávají.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Doporučení ČNB: vlastní bydlení versus investiční nemovitost</caption>
              <thead>
                <tr className="eyebrow">
                  <th scope="col" className="border-b border-(--line) py-3 pr-4 font-medium">Ukazatel</th>
                  <th scope="col" className="border-b border-(--line) py-3 pr-4 font-medium">Vlastní bydlení</th>
                  <th scope="col" className="border-b border-(--line) py-3 font-medium text-(--accent)">Investiční nemovitost</th>
                </tr>
              </thead>
              <tbody className="text-[0.95rem]">
                <tr>
                  <th scope="row" className="border-b border-(--line) py-4 pr-4 font-medium">LTV</th>
                  <td className="border-b border-(--line) py-4 pr-4">{CNB_2026.ownHomeLtv} % <span className="text-(--muted)">({CNB_2026.ownHomeLtvUnder36} % do 36 let)</span></td>
                  <td className="numeral border-b border-(--line) py-4 text-[1.6rem] text-(--accent)">{CNB_2026.investmentLtv} %</td>
                </tr>
                <tr>
                  <th scope="row" className="border-b border-(--line) py-4 pr-4 font-medium">DTI</th>
                  <td className="border-b border-(--line) py-4 pr-4">podle metodiky banky</td>
                  <td className="numeral border-b border-(--line) py-4 text-[1.6rem] text-(--accent)">max. {CNB_2026.investmentDti}×</td>
                </tr>
                <tr>
                  <th scope="row" className="border-b border-(--line) py-4 pr-4 font-medium">Účel</th>
                  <td className="border-b border-(--line) py-4 pr-4">nákup i jiné účely</td>
                  <td className="border-b border-(--line) py-4">jen nákup; refinancování a rekonstrukce mimo doporučení</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-(--muted)">
              Zdroj: doporučení ČNB účinné od {CNB_2026.effectiveFrom}
            </p>
          </Reveal>
        </div>
      </Section>

      <Section theme="dark" ariaLabelledby="topics-title">
        <Reveal>
          <Eyebrow index="02">Mapa témat</Eyebrow>
          <h2 id="topics-title" className="display display-md mt-6">
            Deset pojmů, <span className="serif-accent text-moss-300">jedna struktura.</span>
          </h2>
        </Reveal>
        <Reveal className="mt-10" delay={0.1}>
          <WorkshopTopics />
        </Reveal>
      </Section>

      <Section theme="light" ariaLabelledby="program-title">
        <Reveal>
          <Eyebrow index="03">Program večera</Eyebrow>
          <h2 id="program-title" className="display display-md mt-6">
            Dva večery, <span className="serif-accent text-(--accent)">dvě úrovně.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-8">
          {WORKSHOPS.map((w, i) => (
            <Reveal key={w.slug} delay={i * 0.1}>
              <p className="mono-label text-(--accent)">{w.level}</p>
              <ol className="mt-4 border-t border-(--line)">
                {w.program.map((p) => (
                  <li key={p.time + p.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-(--line) py-3.5 text-[0.95rem]">
                    <span className="font-mono text-[0.8rem] text-(--muted)">{p.time}</span>
                    <span>{p.title}</span>
                  </li>
                ))}
              </ol>
              <p className="mono-label mt-8 text-(--muted)">Co si odnesete</p>
              <ul className="mt-3 space-y-2">
                {w.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[0.95rem]">
                    <span aria-hidden="true" className="mt-[0.65em] size-1.5 shrink-0 bg-(--accent)" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section theme="dark" ariaLabelledby="notfor-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Eyebrow index="04">Pro koho workshop není</Eyebrow>
            <h2 id="notfor-title" className="display display-md mt-6">
              Rychlé zbohatnutí <span className="serif-accent text-moss-300">tu nenajdete.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <ul className="divide-y divide-(--line) border-y border-(--line)">
              {[
                ["Hledáte realitní poradenství", "Neřešíme konkrétní nemovitosti k nákupu. Řešíme dlouhodobě udržitelné financování."],
                ["Chcete kouzelný trik na hypotéku", "Neučím obcházet pravidla bank. Učím jim rozumět a využít je ve svůj prospěch."],
                ["Chcete osobní propočet na místě", "Váš případ a vaše čísla řešíme v individuální konzultaci, ne před třiceti lidmi."],
                ["Nejste připraveni jednat", "Bez úmyslu informace použít v praxi bude mít večer malou hodnotu."],
              ].map(([t, d]) => (
                <li key={t} className="grid gap-2 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <span className="font-medium">{t}</span>
                  <span className="text-[0.95rem] text-sand">{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section theme="light" ariaLabelledby="wcases-title">
        <Reveal>
          <Eyebrow index="05">Z praxe</Eyebrow>
          <h2 id="wcases-title" className="display display-md mt-6">
            Co na workshopu <span className="serif-accent text-(--accent)">rozebíráme krok za krokem.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {WORKSHOP_CASES.map((c, i) => (
            <Reveal key={c.title} as="article" delay={i * 0.1} className="border border-(--line) p-6 sm:p-8">
              <p className="mono-label text-(--muted)">{c.who}</p>
              <h3 className="display display-sm mt-3">{c.title}</h3>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-(--line) py-5">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <dd className="numeral text-[clamp(1.2rem,2vw,1.8rem)]">{m.value}</dd>
                    <dt className="mt-1 text-[0.75rem] text-(--muted)">{m.label}</dt>
                  </div>
                ))}
              </dl>
              <dl className="mt-6 space-y-4 text-[0.95rem]">
                <div><dt className="eyebrow">Výchozí situace</dt><dd className="mt-1">{c.problem}</dd></div>
                <div><dt className="eyebrow">Co se změnilo</dt><dd className="mt-1">{c.change}</dd></div>
                <div><dt className="eyebrow">Výsledek</dt><dd className="mt-1 font-medium">{c.result}</dd></div>
              </dl>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-[0.85rem] text-(--muted)">
          Identity změněné, čísla podle skutečných případů. Výsledky závisí na konkrétní situaci a rozhodnutí banky.
        </p>
      </Section>

      <Section theme="dark" ariaLabelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <Eyebrow index="06">Otázky</Eyebrow>
            <h2 id="faq-title" className="display display-md mt-6">
              Na co se <span className="serif-accent text-moss-300">ptáte nejčastěji.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <dl className="divide-y divide-(--line) border-y border-(--line)">
              {FAQ.map((f) => (
                <div key={f.q} className="py-6">
                  <dt className="text-[1.1rem] font-medium">{f.q}</dt>
                  <dd className="mt-2 max-w-2xl text-sand">{f.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-4">
              {WORKSHOPS.map((w) => (
                <Button key={w.slug} href={w.url} external variant={w.slug === "zacatecnici" ? "primary" : "outline"} magnetic>
                  {w.level}
                </Button>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
