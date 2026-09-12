import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Eyebrow, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Lines } from "@/components/ui/Lines";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt – probrat mé financování",
  description:
    "Napište Adamu Pospíšilovi, kde s financováním stojíte a co chcete koupit nebo změnit. Konkrétní odpověď do 48 pracovních hodin. Telefon, WhatsApp, e-mail, kancelář v Praze 1.",
  path: "/kontakt",
});

const PREPARE = [
  "Kolik nemovitostí vlastníte a jaké na nich jsou úvěry (výše, sazba, konec fixace).",
  "Příjmy: zaměstnání, podnikání, nájmy. Stačí orientačně.",
  "Co chcete koupit, refinancovat nebo změnit. A kdy.",
  "Otázky, na které jste jinde nedostali odpověď.",
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Kontakt", path: "/kontakt" }])} />

      <section data-theme="dark" className="themed pt-32 pb-20 md:pt-40 lg:pt-44 lg:pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="eyebrow">Kontakt</p>
            <Lines as="h1" className="display display-md mt-6" delay={0.1}>
              Probrat mé financování.
            </Lines>
            <Reveal delay={0.3}>
              <p className="lead mt-8 max-w-md text-sand">
                Napište, kde dnes stojíte a co chcete koupit nebo změnit. Odpovím konkrétně: co je možné, za jakých
                podmínek a v jakém pořadí. Zdarma a bez závazku.
              </p>
              <ul className="mt-10 space-y-5 border-t border-(--line) pt-8">
                <li>
                  <span className="eyebrow block">Telefon / WhatsApp</span>
                  <a href={SITE.phoneHref} className="mt-1 block text-[1.5rem] font-medium tracking-[-0.01em]">{SITE.phone}</a>
                  <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[0.9rem] text-sand underline underline-offset-4 hover:text-ivory-100">
                    Napsat na WhatsApp ↗
                  </a>
                </li>
                <li>
                  <span className="eyebrow block">E-mail</span>
                  <a href={`mailto:${SITE.email}`} className="mt-1 block text-[1.15rem] font-medium">{SITE.email}</a>
                </li>
                <li>
                  <span className="eyebrow block">Kancelář</span>
                  <a href={SITE.office.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sand hover:text-ivory-100">
                    {SITE.office.street}, {SITE.office.zip} {SITE.office.city} · osobně po domluvě
                  </a>
                </li>
                <li>
                  <span className="eyebrow block">Online</span>
                  <p className="mt-1 text-sand">Google Meet nebo telefon. Většinu financování řeším na dálku.</p>
                </li>
              </ul>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.2}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <Section theme="light" ariaLabelledby="prepare-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Eyebrow index="01">Před první schůzkou</Eyebrow>
            <h2 id="prepare-title" className="display display-md mt-6">
              Co si <span className="serif-accent text-(--accent)">připravit.</span>
            </h2>
            <p className="mt-6 max-w-md text-(--muted)">Nic z toho není podmínkou. Čím víc čísel ale mám, tím konkrétnější bude odpověď.</p>
            <ol className="mt-8 space-y-3">
              {PREPARE.map((p, i) => (
                <li key={p} className="flex gap-4 border-t border-(--line) pt-3">
                  <span className="font-mono text-[0.7rem] text-(--muted)">0{i + 1}</span>
                  <span className="text-[0.95rem]">{p}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <ParallaxImage
              src="/images/adam-phone.jpg"
              alt="Adam Pospíšil telefonuje s klientem"
              sizes="(max-width: 1024px) 100vw, 45vw"
              frameClassName="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5]"
              className="object-[50%_20%]"
            />
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
