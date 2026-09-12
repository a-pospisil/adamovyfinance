import Link from "next/link";
import { EGFIN, NAV, SITE } from "@/lib/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer data-theme="dark" className="themed border-t border-(--line)">
      <div className="container-x py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display display-sm max-w-md">
              Banka vidí úvěr. <span className="serif-accent text-moss-300">Já vidím portfolio.</span>
            </p>
            <p className="mt-6 max-w-md text-sand">
              Adam Pospíšil – finanční poradce, hypoteční specialista, investor a lektor. Financování
              investičních nemovitostí plánované v kontextu toho, co přijde dál.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="eyebrow mb-5">Web</h2>
              <ul className="space-y-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-moss-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5">Evergreen Finance</h2>
              <ul className="space-y-3">
                <li>
                  <a href={EGFIN.url} className="transition-colors hover:text-moss-300" rel="noopener">
                    egfin.cz
                  </a>
                </li>
                <li>
                  <a href={EGFIN.calculators} className="transition-colors hover:text-moss-300" rel="noopener">
                    Kalkulačky
                  </a>
                </li>
                <li>
                  <a href={EGFIN.portfolioAnalysis} className="transition-colors hover:text-moss-300" rel="noopener">
                    Analýza portfolia zdarma
                  </a>
                </li>
                <li>
                  <a href={EGFIN.caseStudies} className="transition-colors hover:text-moss-300" rel="noopener">
                    Případové studie
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5">Kontakt</h2>
              <ul className="space-y-3">
                <li>
                  <a href={SITE.phoneHref} className="transition-colors hover:text-moss-300">
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className="break-all transition-colors hover:text-moss-300">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.instagram} className="transition-colors hover:text-moss-300" target="_blank" rel="noopener noreferrer">
                    Instagram {SITE.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={SITE.linkedin} className="transition-colors hover:text-moss-300" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li className="pt-2 text-sand">
                  {SITE.office.street}
                  <br />
                  {SITE.office.zip} {SITE.office.city}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-(--line) pt-8 text-[0.8rem] leading-relaxed text-sand lg:grid-cols-12">
          <p className="lg:col-span-5">
            © {year} Adam Pospíšil ·{" "}
            <Link href="/ochrana-osobnich-udaju" className="underline decoration-(--line-strong) underline-offset-4 hover:text-ivory-100">
              Ochrana osobních údajů
            </Link>
          </p>
          <p className="lg:col-span-7">
            Adam Pospíšil působí jako zakladatel a jednatel společnosti {EGFIN.legalName}, IČO {EGFIN.ico}, vázaného
            zástupce společnosti Broker Trust, a.s. (IČO 26439719), která je v registru ČNB vedena jako samostatný
            zprostředkovatel. Workshopy pořádá Monopoly advisory s.r.o., IČO 23123575. Informace na tomto webu jsou obecné
            a nenahrazují individuální posouzení; schválení úvěru je vždy rozhodnutím banky.
          </p>
        </div>
      </div>
    </footer>
  );
}
