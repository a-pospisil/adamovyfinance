import Link from "next/link";
import { CornerOrnament, Guilloche, MicroStrip } from "@/components/engraving/Engraving";
import { DEEP_PAGES, EGFIN, NAV, SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="ink" className="themed relative overflow-hidden">
      <Guilloche className="pointer-events-none absolute -right-24 -top-32 size-[26rem]" opacity={0.1} />
      <CornerOrnament className="pointer-events-none absolute left-6 top-6 size-10" opacity={0.35} />

      <div className="container-x relative py-16 lg:py-20">
        <MicroStrip text="Adam Pospíšil · Investiční nemovitosti · Praha" repeat={6} className="mb-12 hidden sm:block" />

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display display-md max-w-sm">
              Banka vidí úvěr.
              <br />
              <span className="italic-accent text-gold-300">Já vidím portfolio.</span>
            </p>
            <p className="mt-6 max-w-sm text-[0.95rem] text-(--muted)">
              Adam Pospíšil — financování investičních nemovitostí pro investory. Praha. Financování řeším ve
              společnosti{" "}
              <a href={EGFIN.url} className="tap text-paper underline decoration-(--line-strong) underline-offset-4 hover:decoration-gold-300">
                Evergreen Finance
              </a>
              .
            </p>
          </div>

          <nav aria-label="Patička" className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="label-xs mb-5">Web</h2>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/" className="tap text-[0.95rem] transition-colors hover:text-gold-300">
                    Adam Pospíšil
                  </Link>
                </li>
                {[...NAV, ...DEEP_PAGES].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="tap text-[0.95rem] transition-colors hover:text-gold-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="label-xs mb-5">Evergreen Finance</h2>
              <ul className="space-y-2.5">
                <li>
                  <a href={EGFIN.url} className="tap text-[0.95rem] transition-colors hover:text-gold-300" rel="noopener">
                    egfin.cz
                  </a>
                </li>
                <li>
                  <a href={EGFIN.calculators} className="tap text-[0.95rem] transition-colors hover:text-gold-300" rel="noopener">
                    Kalkulačky
                  </a>
                </li>
                <li>
                  <a href={EGFIN.portfolioAnalysis} className="tap text-[0.95rem] transition-colors hover:text-gold-300" rel="noopener">
                    Analýza portfolia
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="label-xs mb-5">Kontakt</h2>
              <ul className="space-y-2.5 text-[0.95rem]">
                <li>
                  <a href={SITE.phoneHref} className="tap transition-colors hover:text-gold-300">
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="tap break-all transition-colors hover:text-gold-300">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.instagram} className="tap transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
                    Instagram {SITE.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={SITE.linkedin} className="tap transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li className="pt-2 text-(--muted)">
                  {SITE.office.street}, {SITE.office.zip} {SITE.office.city}
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-baseline justify-between gap-4 border-t border-(--line) pt-6">
          <p className="microtype">A. P. / 01 · CZ / {year}</p>
          <p className="microtype">Adamovy finance</p>
        </div>

        <div className="mt-6 grid gap-5 text-[0.78rem] leading-relaxed text-(--muted) lg:grid-cols-12">
          <p className="lg:col-span-4">
            © {year} Adam Pospíšil ·{" "}
            <Link href="/ochrana-osobnich-udaju" className="underline decoration-(--line-strong) underline-offset-4 hover:text-paper">
              Ochrana osobních údajů
            </Link>
          </p>
          <p className="lg:col-span-8">
            Adam Pospíšil působí jako zakladatel a jednatel společnosti {EGFIN.legalName}, IČO {EGFIN.ico}, vázaného
            zástupce společnosti Broker Trust, a.s. (IČO 26439719), která je v registru ČNB vedena jako samostatný
            zprostředkovatel. Workshopy pořádá Monopoly advisory s.r.o., IČO 23123575. Informace na tomto webu jsou
            obecné a nenahrazují individuální posouzení; schválení úvěru je vždy rozhodnutím banky.
          </p>
        </div>
      </div>
    </footer>
  );
}
