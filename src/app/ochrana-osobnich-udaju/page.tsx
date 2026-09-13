import type { Metadata } from "next";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { EGFIN, SITE } from "@/lib/site";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Ochrana osobních údajů",
    description: "Jak nakládám s osobními údaji, které mi pošlete přes web adamovyfinance.cz.",
    path: "/ochrana-osobnich-udaju",
  }),
  robots: { index: false, follow: true },
};

const SECTIONS = [
  {
    title: "Správce",
    text: `Správcem osobních údajů je společnost ${EGFIN.legalName}, IČO ${EGFIN.ico}, se sídlem Korunní 2569/108, 101 00 Praha 10, jejímž jménem jedná Adam Pospíšil. Kontakt: ${SITE.email}, ${SITE.phone}.`,
  },
  {
    title: "Jaké údaje a proč",
    text: "Přes kontaktní formulář zpracovávám jméno a příjmení, telefon, e-mail a obsah zprávy. Účelem je vyřízení poptávky: posouzení situace, návrh financování a domluva konzultace. Právním základem je plnění smlouvy, respektive jednání o ní (čl. 6 odst. 1 písm. b) GDPR), a oprávněný zájem na komunikaci s vámi.",
  },
  {
    title: "Jak dlouho",
    text: "Poptávky uchovávám po dobu jednání a následně nejdéle 12 měsíců, pokud spolupráce nepokračuje. Při zprostředkování úvěru se doba uchování řídí zákonnými povinnostmi zprostředkovatele.",
  },
  {
    title: "Komu údaje předávám",
    text: "Údaje předávám pouze bankám a poskytovatelům úvěrů, u kterých pro vás financování sjednávám, a to až po vaší výslovné žádosti. S doručením zpráv technicky pomáhá poskytovatel e-mailové služby a poptávky eviduji v CRM systému RAYNET; s oběma provozovateli je uzavřena smlouva o zpracování. Údaje neprodávám ani nepředávám za marketingovými účely.",
  },
  {
    title: "Cookies a měření",
    text: "Tento web nepoužívá reklamní ani sledovací cookies. Formulář obsahuje jen technickou ochranu proti robotům bez ukládání údajů ve vašem prohlížeči.",
  },
  {
    title: "Vaše práva",
    text: `Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Stačí napsat na ${SITE.email}. Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz).`,
  },
  {
    title: "Workshopy",
    text: "Rezervace a platby workshopů probíhají na webu egfin.cz a zpracovává je pořadatel, Monopoly advisory s.r.o., IČO 23123575. Pro ně platí podmínky uvedené tam.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Ochrana osobních údajů", path: "/ochrana-osobnich-udaju" }])} />
      <Section theme="paper" className="pt-28 sm:pt-32 lg:pt-36">
        <div className="max-w-3xl">
          <p className="label-xs">Ochrana osobních údajů</p>
          <h1 className="display display-md mt-6">Jak nakládám s vašimi údaji.</h1>
          <div className="mt-12 border-t border-(--line)">
            {SECTIONS.map((s) => (
              <section key={s.title} className="grid gap-3 border-b border-(--line) py-7 sm:grid-cols-12 sm:gap-8">
                <h2 className="display display-sm sm:col-span-4">{s.title}</h2>
                <p className="text-[0.98rem] leading-relaxed text-(--muted) sm:col-span-8">{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
