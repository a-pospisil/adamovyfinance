import { Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { FACTS } from "@/lib/site";

const PARAMETERS = [
  "Uznání nájmu",
  "Budoucí nájem z odhadu",
  "Příjmy OSVČ a paušály",
  "Historie s.r.o.",
  "DSCR",
  "DSTI",
  "Počet úvěrů",
  "Zástavy mimo bydlení",
  "Věk žadatele",
  "Refinancování",
  "Splatnost",
  "Fixace",
  "Rekonstrukční tranže",
  "Developerské projekty",
];

/** No logo wall: fourteen methodologies, one investor. */
export function Banks() {
  return (
    <section data-theme="light" aria-labelledby="banks-title" className="themed section-y">
      <div className="container-x">
        <Reveal>
          <Eyebrow index="09">Banky</Eyebrow>
          <h2 id="banks-title" className="display display-lg mt-6">
            {FACTS.bankPartners} bank. {FACTS.bankPartners} metodik.
            <br />
            <span className="serif-accent text-(--accent)">1 investor.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <p className="serif-accent text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.2]">
              „Neexistuje nejlepší banka. Existuje banka, která se hodí pro konkrétní situaci.“
            </p>
            <p className="mt-6 max-w-md text-(--muted)">
              Každá banka má vlastní metodiku a v každém z těchto parametrů se liší. Stejný klient se stejným
              bytem vyjde v jedné bance na úvěr o miliony vyšší než v jiné. Nejde o obcházení pravidel, jde o to,
              znát je dřív, než žádost podáte.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <ol className="grid grid-cols-2 border-t border-l border-(--line) sm:grid-cols-3 lg:grid-cols-4" aria-label="Parametry, ve kterých se metodiky bank liší">
              {PARAMETERS.map((p, i) => (
                <li key={p} className="flex min-h-24 flex-col justify-between border-b border-r border-(--line) p-4">
                  <span className="font-mono text-[0.65rem] tracking-[0.12em] text-(--muted)">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.9rem] leading-tight">{p}</span>
                </li>
              ))}
              <li className="col-span-2 flex min-h-24 items-center border-b border-r border-(--line) bg-(--fg) p-4 text-(--bg) sm:col-span-1 lg:col-span-2">
                <span className="display display-sm text-[1.25rem]">
                  Jedna situace. <span className="serif-accent">Jedna struktura.</span>
                </span>
              </li>
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
