import { ContactForm } from "@/components/forms/ContactForm";
import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/lib/site";

/** Closing call to action with the lead form and direct channels. */
export function ContactCta() {
  return (
    <section data-theme="light" id="kontakt" aria-labelledby="cta-title" className="themed section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <Eyebrow index="13">Další krok</Eyebrow>
          <h2 id="cta-title" className="display display-md mt-6">
            Probrat <span className="serif-accent text-(--accent)">mé financování.</span>
          </h2>
          <p className="lead mt-8 max-w-md text-(--muted)">
            Napište, kde dnes stojíte a co chcete koupit nebo změnit. Odpovím konkrétně: co je možné, za jakých
            podmínek a v jakém pořadí.
          </p>
          <ul className="mt-10 space-y-4 border-t border-(--line) pt-8">
            <li>
              <span className="eyebrow block">Telefon / WhatsApp</span>
              <a href={SITE.phoneHref} className="mt-1 block text-[1.35rem] font-medium tracking-[-0.01em]">{SITE.phone}</a>
            </li>
            <li>
              <span className="eyebrow block">E-mail</span>
              <a href={`mailto:${SITE.email}`} className="mt-1 block text-[1.1rem] font-medium">{SITE.email}</a>
            </li>
            <li>
              <span className="eyebrow block">Kancelář</span>
              <a href={SITE.office.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-(--muted)">
                {SITE.office.street}, {SITE.office.zip} {SITE.office.city}
              </a>
            </li>
          </ul>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
