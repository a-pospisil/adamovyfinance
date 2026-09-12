import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Numeral } from "@/components/engraving/Engraving";
import { SITE } from "@/lib/site";

/** 05 — Kontakt. Formulář jako tištěný arch: jen linky a prostor. */
export function Contact() {
  return (
    <Section theme="paper" id="kontakt" ariaLabelledby="contact-title" className="overflow-hidden border-t border-(--line)">
      <Numeral
        value="05"
        className="pointer-events-none absolute -right-6 bottom-0 text-[18rem] leading-none sm:text-[26rem]"
        tone="brown"
        opacity={0.04}
      />

      <div className="relative">
        <Reveal>
          <SectionMark index="05">Kontakt</SectionMark>
        </Reveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal delay={60}>
              <h2 id="contact-title" className="display display-lg max-w-[12ch]">
                Probrat <span className="italic-accent text-burgundy">financování.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="lead mt-7 max-w-md">
                Napište, kde dnes stojíte a co chcete koupit nebo změnit. Odpovím konkrétně: co je možné, za jakých
                podmínek a v jakém pořadí.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <dl className="mt-10 space-y-6 border-t border-(--line) pt-8">
                <div>
                  <dt className="label-xs">Telefon / WhatsApp</dt>
                  <dd className="display mt-1 text-2xl">
                    <a href={SITE.phoneHref}>{SITE.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">E-mail</dt>
                  <dd className="mt-1 text-[1.05rem]">
                    <a href={`mailto:${SITE.email}`} className="underline decoration-(--line-strong) underline-offset-4 hover:decoration-burgundy">
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">Kancelář</dt>
                  <dd className="mt-1 text-(--muted)">
                    {SITE.office.street}, {SITE.office.zip} {SITE.office.city}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-6 lg:col-start-7" delay={140}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
