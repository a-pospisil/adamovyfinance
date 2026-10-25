import Link from "next/link";
import { CornerOrnament, Guilloche, MicroStrip } from "@/components/engraving/Engraving";
import { DEEP_PAGES, EGFIN, NAV, SITE } from "@/lib/site";

/** Ikony sociálních sítí (Simple Icons, CC0). Facebook vede na stránku Evergreen Finance. */
const SOCIALS = [
  {
    label: "Facebook Evergreen Finance",
    href: EGFIN.facebook,
    icon: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    label: "Instagram",
    href: SITE.instagram,
    icon: "M7.03.084c-1.277.06-2.149.264-2.91.563a5.874 5.874 0 0 0-2.124 1.388 5.878 5.878 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076.008 8.354-.005 8.764.001 12.023c.007 3.259.021 3.667.083 4.947.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.872 5.872 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063 3.257-.007 3.668-.021 4.947-.082 1.28-.06 2.147-.265 2.91-.563a5.881 5.881 0 0 0 2.123-1.388 5.881 5.881 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.892 5.892 0 0 0-1.387-2.123 5.857 5.857 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0 8.718.008 8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.736 3.736 0 0 1-1.382-.895 3.695 3.695 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.705 3.705 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895.421.42.681.817.9 1.378.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.705 3.705 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008",
  },
  {
    label: "LinkedIn",
    href: SITE.linkedin,
    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-theme="ink" className="themed relative overflow-hidden">
      <Guilloche className="pointer-events-none absolute -right-24 -top-32 size-[26rem]" opacity={0.1} />
      <CornerOrnament className="pointer-events-none absolute left-6 top-6 size-10" opacity={0.35} />

      <div className="container-x relative py-16 lg:py-20">
        <MicroStrip text="Hypotéky · Investice · Pojištění · Nemovitosti · Financování · Strategie · Portfolio" repeat={3} className="mb-12 hidden sm:block" />

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display display-md max-w-sm">
              Banka vidí úvěr.
              <br />
              <span className="italic-accent text-gold-300">Já vidím portfolio.</span>
            </p>
            <p className="mt-6 max-w-sm text-[0.95rem] text-(--muted)">
              <strong className="font-normal text-paper">Adamovy finance</strong> je osobní web Adama Pospíšila —
              financování investičních nemovitostí pro investory. Praha. Financování řeším ve společnosti{" "}
              <a href={EGFIN.url} className="tap text-paper underline decoration-(--line-strong) underline-offset-4 hover:decoration-gold-300" target="_blank" rel="noopener noreferrer">
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
                    Adamovy finance
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
                  <a href={EGFIN.url} className="tap text-[0.95rem] transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
                    egfin.cz
                  </a>
                </li>
                <li>
                  <a href={EGFIN.calculators} className="tap text-[0.95rem] transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
                    Kalkulačky
                  </a>
                </li>
                <li>
                  <a href={EGFIN.portfolioAnalysis} className="tap text-[0.95rem] transition-colors hover:text-gold-300" target="_blank" rel="noopener noreferrer">
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
                <li className="pt-1">
                  <ul aria-label="Sociální sítě" className="-ml-2.5 flex items-center gap-1">
                    {SOCIALS.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          aria-label={s.label}
                          title={s.label}
                          className="grid size-11 place-items-center text-paper/80 transition-colors hover:text-gold-300"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[1.15rem]" fill="currentColor">
                            <path d={s.icon} />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
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
          <p className="microtype">Adamovy finance · {SITE.domain}</p>
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
