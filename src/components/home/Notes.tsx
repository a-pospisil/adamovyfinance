import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CNB_2026, SITE } from "@/lib/site";

const NOTES = [
  {
    title: `Doporučení ČNB od ${CNB_2026.effectiveFrom}`,
    text: `LTV ${CNB_2026.investmentLtv} % a DTI ${CNB_2026.investmentDti} pro hypotéky na investiční nemovitost. Co všechno se počítá jako „třetí a další nemovitost“, včetně družstevního podílu nebo bytu v zahraničí, a proč se doporučení netýká úvěrů pro s.r.o.`,
  },
  {
    title: "Kolik nájmu banka uzná",
    text: "Od nuly po celý nájem, z odhadu nebo z daňového přiznání. Proč stejný byt vychází v každé bance na jinou bonitu a kdy banka počítá náklady dvakrát.",
  },
  {
    title: "Konec fixací z éry levných peněz",
    text: "Pasivní refix, nebo přestavba portfolia. Prodloužení splatnosti jako nejúčinnější tlumič vyšších sazeb a účelové navýšení jako nejlevnější kapitál na další nákup.",
  },
  {
    title: "Financování přes s.r.o.",
    text: "DSCR, výkazy a vlastní zdroje místo bonity fyzické osoby. Kdy se přechod vyplatí, kdy portfolio prodražuje a jak banka čte firmu bez historie.",
  },
  {
    title: "Bonita podnikatelů a OSVČ",
    text: "Paušál, optimalizace, krátká historie podnikání. Které metodiky umí uznat reálné příjmy a jak žádost postavit tak, aby je banka viděla.",
  },
  {
    title: "Zástavy a křížové zajištění",
    text: "Druhá nemovitost v zástavě umí snížit sazbu a zvýšit úvěr. Křížové zástavy ale mohou celé portfolio zamknout. Kdy je použít a kdy ne.",
  },
];

/** Editorial "what I'm working on now" + Instagram call to action. */
export function Notes() {
  return (
    <section data-theme="dark" aria-labelledby="notes-title" className="themed section-y">
      <div className="container-x">
        <Reveal>
          <Eyebrow index="12">Co právě řeším</Eyebrow>
          <h2 id="notes-title" className="display display-lg mt-6">
            Témata, která se <span className="serif-accent text-moss-300">vracejí.</span>
          </h2>
        </Reveal>

        <ol className="mt-12 grid border-t border-(--line) md:grid-cols-2 lg:grid-cols-3">
          {NOTES.map((n, i) => (
            <Reveal as="li" key={n.title} delay={(i % 3) * 0.08} className="flex flex-col gap-4 border-b border-(--line) py-8 md:pr-10 md:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:not(:nth-child(3n+1))]:pl-8">
              <span className="font-mono text-[0.65rem] tracking-[0.14em] text-sand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display display-sm text-[1.35rem] sm:text-[1.5rem]">{n.title}</h3>
              <p className="text-[0.95rem] text-sand">{n.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 grid gap-8 border border-(--line) p-8 md:grid-cols-12 md:items-center lg:p-12">
          <div className="md:col-span-8">
            <p className="mono-label text-moss-300">Instagram</p>
            <p className="display display-md mt-4">
              Sledujte Adama <span className="serif-accent text-moss-300">{SITE.instagramHandle}</span>
            </p>
            <p className="mt-4 max-w-lg text-sand">
              Hypotéky, investiční nemovitosti, bankovní metodiky a příklady z praxe. Krátce, konkrétně, bez omáčky.
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-14 items-center gap-3 border border-(--line-strong) px-7 font-medium transition-colors hover:border-ivory-100"
            >
              Otevřít Instagram
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
