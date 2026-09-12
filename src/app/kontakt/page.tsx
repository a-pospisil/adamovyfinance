import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Guilloche, MicroStrip, Numeral } from "@/components/engraving/Engraving";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt – probrat financování",
  description:
    "Napište Adamu Pospíšilovi, kde s financováním stojíte a co chcete koupit nebo změnit. Konkrétní odpověď do 48 pracovních hodin. Praha 1.",
  path: "/kontakt",
});

const PREPARE = [
  "Kolik nemovitostí vlastníte a jaké na nich jsou úvěry: výše, sazba, konec fixace.",
  "Příjmy: zaměstnání, podnikání, nájmy. Stačí orientačně.",
  "Co chcete koupit, refinancovat nebo změnit. A kdy.",
  "Otázky, na které jste jinde nedostali odpověď.",
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Kontakt", path: "/kontakt" }])} />

      <section data-theme="paper" className="themed relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pt-36">
        <Guilloche className="pointer-events-none absolute -right-40 top-20 size-[34rem]" opacity={0.14} />
        <Numeral
          value="05"
          className="pointer-events-none absolute -right-4 bottom-10 text-[16rem] leading-none"
          tone="brown"
          opacity={0.05}
        />

        <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label-xs">Kontakt</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display display-lg mt-6 max-w-[11ch]">
                Probrat <span className="italic-accent text-burgundy">financování.</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead mt-8 max-w-md">
                Napište, kde dnes stojíte a co chcete koupit nebo změnit. Odpovím konkrétně: co je možné, za jakých
                podmínek a v jakém pořadí. Zdarma a bez závazku.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <dl className="mt-12 space-y-7 border-t border-(--line) pt-8">
                <div>
                  <dt className="label-xs">Telefon / WhatsApp</dt>
                  <dd className="display mt-1 text-3xl">
                    <a href={SITE.phoneHref} className="tap inline-block">{SITE.phone}</a>
                  </dd>
                  <dd className="mt-1">
                    <a
                      href={SITE.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-xs tap inline-block border-b border-(--line-strong) pb-0.5 hover:border-burgundy hover:text-burgundy"
                    >
                      Napsat na WhatsApp
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">E-mail</dt>
                  <dd className="mt-1 text-[1.05rem]">
                    <a href={`mailto:${SITE.email}`} className="tap inline-block underline decoration-(--line-strong) underline-offset-4 hover:decoration-burgundy">
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">Kancelář</dt>
                  <dd className="mt-1 text-(--muted)">
                    <a href={SITE.office.mapUrl} target="_blank" rel="noopener noreferrer" className="tap inline-block">
                      {SITE.office.street}, {SITE.office.zip} {SITE.office.city}
                    </a>
                    <span className="mt-0.5 block text-[0.9rem]">Osobně po domluvě, jinak Google Meet nebo telefon.</span>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={160}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <Section theme="ink" ariaLabelledby="prepare-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionMark index="01">Před první schůzkou</SectionMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 id="prepare-title" className="display display-md mt-10 max-w-[10ch]">
                Co si <span className="italic-accent text-gold-300">připravit.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-md text-(--muted)">
                Nic z toho není podmínkou. Čím víc čísel ale mám, tím konkrétnější bude odpověď.
              </p>
              <ol className="mt-8 border-t border-(--line)">
                {PREPARE.map((p, i) => (
                  <li key={p} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-(--line) py-3.5">
                    <span className="label-xs tabular pt-0.5">0{i + 1}</span>
                    <span className="text-[0.95rem]">{p}</span>
                  </li>
                ))}
              </ol>
              <MicroStrip text="Adam Pospíšil · Praha" repeat={3} className="mt-10" />
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={100}>
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src="/images/adam-phone.jpg"
                alt="Adam Pospíšil telefonuje s klientem"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[50%_18%]"
              />
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
