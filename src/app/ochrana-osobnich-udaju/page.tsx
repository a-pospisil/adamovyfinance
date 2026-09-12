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

export default function PrivacyPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Ochrana osobních údajů", path: "/ochrana-osobnich-udaju" }])} />
      <Section theme="dark" className="pt-32 md:pt-40 lg:pt-44">
        <div className="max-w-3xl">
          <p className="eyebrow">Ochrana osobních údajů</p>
          <h1 className="display display-md mt-6">Jak nakládám s vašimi údaji.</h1>
          <div className="mt-10 space-y-8 leading-relaxed text-sand [&_h2]:font-sans [&_h2]:text-[1.15rem] [&_h2]:font-semibold [&_h2]:text-ivory-100">
            <section>
              <h2>Správce</h2>
              <p className="mt-2">
                Správcem osobních údajů je společnost {EGFIN.legalName}, IČO {EGFIN.ico}, se sídlem Korunní 2569/108, 101 00
                Praha 10, jejímž jménem jedná Adam Pospíšil. Kontakt: {SITE.email}, {SITE.phone}.
              </p>
            </section>
            <section>
              <h2>Jaké údaje a proč</h2>
              <p className="mt-2">
                Přes kontaktní formulář zpracovávám jméno a příjmení, telefon, e-mail a obsah zprávy, kterou napíšete.
                Účelem je vyřízení vaší poptávky: posouzení situace, návrh financování a domluva konzultace. Právním
                základem je plnění smlouvy, respektive jednání o ní (čl. 6 odst. 1 písm. b) GDPR), a oprávněný zájem na
                komunikaci s vámi.
              </p>
            </section>
            <section>
              <h2>Jak dlouho</h2>
              <p className="mt-2">
                Poptávky uchovávám po dobu jednání a následně nejdéle 12 měsíců, pokud spolupráce nepokračuje. Pokud
                dojde ke zprostředkování úvěru, řídí se doba uchování zákonnými povinnostmi zprostředkovatele.
              </p>
            </section>
            <section>
              <h2>Komu údaje předávám</h2>
              <p className="mt-2">
                Údaje předávám pouze bankám a poskytovatelům úvěrů, u kterých pro vás financování sjednávám, a to až po
                vaší výslovné žádosti. Technicky mi s doručením zpráv pomáhá poskytovatel e-mailové služby, se kterým je
                uzavřena smlouva o zpracování. Údaje neprodávám ani nepředávám za marketingovými účely třetím stranám.
              </p>
            </section>
            <section>
              <h2>Cookies a měření</h2>
              <p className="mt-2">
                Tento web nepoužívá reklamní ani sledovací cookies. Formulář obsahuje jen technickou ochranu proti
                robotům bez ukládání údajů ve vašem prohlížeči.
              </p>
            </section>
            <section>
              <h2>Vaše práva</h2>
              <p className="mt-2">
                Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a právo vznést
                námitku. Stačí napsat na {SITE.email}. Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů
                (uoou.gov.cz).
              </p>
            </section>
            <section>
              <h2>Workshopy</h2>
              <p className="mt-2">
                Rezervace a platby workshopů probíhají na webu egfin.cz a zpracovává je pořadatel, Monopoly advisory
                s.r.o., IČO 23123575. Pro ně platí podmínky uvedené tam.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </main>
  );
}
