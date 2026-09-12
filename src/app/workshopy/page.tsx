import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { CornerOrnament, MicroStrip } from "@/components/engraving/Engraving";
import { WorkshopTopics } from "@/components/workshops/WorkshopTopics";
import { formatCzk } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, ORG_ID, PERSON_ID } from "@/lib/schema";
import { CNB_2026, EGFIN, FACTS, SITE_URL } from "@/lib/site";
import { formatDayMonth, formatWorkshopDate, workshopStatus, WORKSHOPS } from "@/lib/workshops";

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
        address: {
          "@type": "PostalAddress",
          streetAddress: w.place.street,
          addressLocality: "Praha",
          postalCode: w.place.zip,
          addressCountry: "CZ",
        },
      },
      image: `${SITE_URL}/images/adam-suit.jpg`,
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
        label={`Workshop Adama Pospíšila · Praha · max. ${FACTS.workshopCapacity} lidí`}
        numeral="04"
        title={
          <>
            Financování investičních <span className="italic-accent text-burgundy">nemovitostí.</span>
          </>
        }
        lead={
          <p>
            Naučím vás přemýšlet o financování tak, jak o něm přemýšlí banka. Metodiky, bonita, struktura. Dvě úrovně
            podle toho, kde dnes stojí vaše portfolio.
          </p>
        }
        aside={
          <div className="relative">
            <CornerOrnament className="absolute -left-3 -top-3 z-10 size-9" tone="gold" opacity={0.7} />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/adam-suit.jpg"
                alt="Adam Pospíšil"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-[50%_12%]"
              />
            </div>
            <p className="microtype mt-3">
              {FACTS.yearsInFinance}+ let / {FACTS.loans2025Mil} mil. Kč v roce 2025
            </p>
          </div>
        }
      />

      <Section theme="paper" ariaLabelledby="terms-title" className="border-t border-(--line)">
        <Reveal>
          <SectionMark index="01">Termíny</SectionMark>
        </Reveal>
        <h2 id="terms-title" className="sr-only">
          Termíny workshopů
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {WORKSHOPS.map((w, i) => {
            const status = workshopStatus(w, now);
            const when = formatWorkshopDate(w);
            return (
              <Reveal as="article" key={w.slug} delay={i * 80} className="border-t border-(--line-strong) pt-7">
                <p className="label-xs text-(--accent)">{w.level}</p>
                <h3 className="display display-md mt-3">{w.title}</h3>
                <p className="mt-4 max-w-md text-(--muted)">{w.claim}</p>

                <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <dt className="label-xs">Termín</dt>
                    <dd className="display mt-1 text-xl">
                      {status.phase === "past" ? "Připravuji" : when.date}
                      {status.phase !== "past" && (
                        <span className="mt-0.5 block text-[0.85rem] font-sans text-(--muted)">
                          {when.weekday}, {when.time}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-xs">Místo</dt>
                    <dd className="display mt-1 text-xl">
                      {w.place.name}
                      <span className="mt-0.5 block text-[0.85rem] font-sans text-(--muted)">
                        {w.place.street}, {w.place.city}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="label-xs">Cena</dt>
                    <dd className="nominal mt-1 text-3xl">
                      {formatCzk(status.priceNow)}
                      {status.phase === "early" && status.earlyUntil && (
                        <span className="label-xs mt-1.5 block">
                          early bird do {formatDayMonth(status.earlyUntil)}, poté {formatCzk(status.regularPrice)}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-xs">Kapacita</dt>
                    <dd className="nominal mt-1 text-3xl">
                      {w.capacity}
                      <span className="label-xs mt-1.5 block">míst, záměrně malá skupina</span>
                    </dd>
                  </div>
                </dl>

                <ul className="mt-8 border-t border-(--line)">
                  {w.audience.map((a) => (
                    <li key={a} className="border-b border-(--line) py-2.5 text-[0.95rem] text-(--muted)">
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    href={status.phase === "past" ? "/kontakt" : w.url}
                    external={status.phase !== "past"}
                    variant={i === 0 ? "solid" : "outline"}
                  >
                    {status.phase === "past" ? "Chci vědět o termínu" : "Chci na workshop"}
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-10 max-w-3xl text-[0.85rem] text-(--muted)">
          Rezervace míst a platba probíhá přes stránky workshopů Evergreen Finance. Pořadatelem je Monopoly advisory
          s.r.o. Nejčastěji lidé berou obě úrovně za sebou.
        </p>
      </Section>

      <Section theme="cocoa" ariaLabelledby="cnb-title" className="overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionMark index="02">Nová pravidla</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="cnb-title" className="display display-md mt-10 max-w-[12ch]">
                Co se změnilo <span className="italic-accent text-gold-300">od {CNB_2026.effectiveFrom}</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-md text-(--muted)">
                Doporučení ČNB pro hypotéky na investiční nemovitost, tedy na třetí a další obytnou nemovitost nebo na
                nemovitost k pronájmu. Počítá se i družstevní podíl a nemovitost v zahraničí. Přísnější limity platí
                jen pro úvěr na nákup a netýkají se právnických osob.
              </p>
              <p className="mt-4 max-w-md text-(--muted)">
                Neučím obcházet pravidla. Učím jim rozumět natolik, abyste věděli, jaké možnosti dávají.
              </p>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={100}>
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Doporučení ČNB: vlastní bydlení versus investiční nemovitost</caption>
              <thead>
                <tr className="label-xs">
                  <th scope="col" className="border-b border-(--line) py-3 pr-4 font-medium">Ukazatel</th>
                  <th scope="col" className="border-b border-(--line) py-3 pr-4 font-medium">Vlastní bydlení</th>
                  <th scope="col" className="border-b border-(--line) py-3 font-medium text-(--accent)">Investiční</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="border-b border-(--line) py-5 pr-4 text-[0.95rem] font-normal">LTV</th>
                  <td className="border-b border-(--line) py-5 pr-4 text-[0.95rem] text-(--muted)">
                    {CNB_2026.ownHomeLtv} % ({CNB_2026.ownHomeLtvUnder36} % do 36 let)
                  </td>
                  <td className="nominal border-b border-(--line) py-5 text-3xl text-(--accent)">{CNB_2026.investmentLtv} %</td>
                </tr>
                <tr>
                  <th scope="row" className="border-b border-(--line) py-5 pr-4 text-[0.95rem] font-normal">DTI</th>
                  <td className="border-b border-(--line) py-5 pr-4 text-[0.95rem] text-(--muted)">podle metodiky banky</td>
                  <td className="nominal border-b border-(--line) py-5 text-3xl text-(--accent)">{CNB_2026.investmentDti}×</td>
                </tr>
                <tr>
                  <th scope="row" className="border-b border-(--line) py-5 pr-4 text-[0.95rem] font-normal">Účel</th>
                  <td className="border-b border-(--line) py-5 pr-4 text-[0.95rem] text-(--muted)">nákup i jiné účely</td>
                  <td className="border-b border-(--line) py-5 text-[0.95rem] text-(--muted)">
                    jen nákup; refinancování a rekonstrukce mimo
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="microtype mt-5">Zdroj: doporučení ČNB účinné od {CNB_2026.effectiveFrom}</p>
          </Reveal>
        </div>
      </Section>

      <Section theme="paper" ariaLabelledby="program-title">
        <Reveal>
          <SectionMark index="03">Program a témata</SectionMark>
        </Reveal>
        <Reveal delay={60}>
          <h2 id="program-title" className="display display-md mt-10 max-w-[14ch]">
            Dva večery, <span className="italic-accent text-burgundy">dvě úrovně.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-14">
          {WORKSHOPS.map((w, i) => (
            <Reveal key={w.slug} delay={i * 80}>
              <p className="label-xs text-(--accent)">{w.level}</p>
              <ol className="mt-5 border-t border-(--line)">
                {w.program.map((p) => (
                  <li key={p.time + p.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-b border-(--line) py-3 text-[0.95rem]">
                    <span className="label-xs tabular pt-0.5">{p.time}</span>
                    <span>{p.title}</span>
                  </li>
                ))}
              </ol>
              <p className="label-xs mt-8">Co si odnesete</p>
              <ul className="mt-3 space-y-2.5">
                {w.takeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[0.95rem] text-(--muted)">
                    <span aria-hidden="true" className="mt-[0.85em] h-px w-3 shrink-0 bg-(--accent)" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-20">
          <p className="label-xs">Co na workshopu rozebíráme</p>
          <WorkshopTopics className="mt-8" />
        </Reveal>
      </Section>

      <Section theme="ink" ariaLabelledby="ws-faq-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionMark index="05">Otázky</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="ws-faq-title" className="display display-md mt-10 max-w-[11ch]">
                Než si <span className="italic-accent text-gold-300">zarezervujete místo.</span>
              </h2>
            </Reveal>
            <Reveal delay={120} className="mt-10 flex flex-wrap gap-4">
              {WORKSHOPS.map((w, i) => (
                <Button key={w.slug} href={w.url} external variant={i === 0 ? "solid" : "outline"}>
                  {w.level}
                </Button>
              ))}
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={100}>
            <dl className="border-t border-(--line)">
              {FAQ.map((f) => (
                <div key={f.q} className="border-b border-(--line) py-6">
                  <dt className="display display-sm">{f.q}</dt>
                  <dd className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-(--muted)">{f.a}</dd>
                </div>
              ))}
            </dl>
            <MicroStrip text="Praha · Baťův palác · Investment financing" repeat={3} className="mt-10" />
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
