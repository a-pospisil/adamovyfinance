import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { Guilloche } from "@/components/engraving/Engraving";
import { EGFIN, SITE } from "@/lib/site";

/** 09 — Kontakt. Otázka místo výzvy k akci a přirozený odkaz na Evergreen Finance. */
export function Contact() {
  return (
    <Section theme="cocoa" id="kontakt" ariaLabelledby="contact-title" className="overflow-hidden">
      <Guilloche className="pointer-events-none absolute -left-48 bottom-0 size-[34rem]" opacity={0.12} />

      <div className="relative">
        <Reveal>
          <SectionMark index="09">Kontakt</SectionMark>
        </Reveal>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal delay={60}>
              <h2 id="contact-title" className="display display-lg max-w-[12ch]">
                Kde jste dnes <span className="italic-accent text-gold-300">a kam chcete dojít?</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="lead mt-8 max-w-md">
                Napište mi to v pár větách. Odpovím konkrétně: co je ve vaší situaci možné, za jakých podmínek
                a v jakém pořadí.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <dl className="mt-10 space-y-6 border-t border-(--line) pt-8">
                <div>
                  <dt className="label-xs">Telefon / WhatsApp</dt>
                  <dd className="display mt-1 text-2xl">
                    <a href={SITE.phoneHref} className="tap">
                      {SITE.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">E-mail</dt>
                  <dd className="mt-1 text-[1.05rem]">
                    <a href={`mailto:${SITE.email}`} className="tap underline decoration-(--line-strong) underline-offset-4 hover:decoration-(--accent)">
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">Kde mě najdete</dt>
                  <dd className="mt-1 max-w-sm text-(--muted)">
                    Financování řeším ve společnosti{" "}
                    <a href={EGFIN.url} className="tap text-(--fg) underline decoration-(--line-strong) underline-offset-4 hover:decoration-(--accent)" target="_blank" rel="noopener noreferrer">
                      Evergreen Finance
                    </a>
                    , {SITE.office.street}, {SITE.office.zip} {SITE.office.city}.
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
