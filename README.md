# adamovyfinance.cz

Osobní web Adama Pospíšila – finanční poradce, hypoteční specialista, specialista na financování investičních
nemovitostí, investor a lektor. Pozice webu: **„Banka vidí úvěr. Já vidím portfolio.“**

Účel je záměrně úzký: krátká osobní prezentace, osobní značka a SEO na jméno **Adam Pospíšil**, s přirozeným
odkazem na [Evergreen Finance](https://www.egfin.cz). Není to prodejní web ani odborný portál — méně obsahu je
tady cíl, ne kompromis.

## Stack

- **Next.js 16** (App Router, Turbopack), React 19, TypeScript
- **Tailwind CSS 4** — design tokens v `src/app/globals.css` (`@theme`); sekce přepínají paletu přes
  `data-theme="paper | ink | cocoa"`
- `next/font` — **Cormorant Garamond** (display, rytinové nadpisy) a **Inter** (text), subsety `latin` + `latin-ext`
- `next/image` — AVIF/WebP; portréty jsou převedené do teplého duotónu (kakao → papír)
- Animace: jediný `IntersectionObserver` (`RevealObserver`) + CSS přechody, žádná animační knihovna

Žádné UI knihovny, žádná analytika, žádné cookies.

## Vizuální identita

Old money × české bankovky × editorial. Palety vychází z tiskových barev bankovek:

| Token | Hodnota | Použití |
| --- | --- | --- |
| `paper` | `#F1E7D0` | hlavní podklad |
| `ink` | `#211D1A` | text, tmavé sekce |
| `cocoa` | `#3A2924` | druhá tmavá sekce |
| `brown` | `#80533F` | rytina, nominály |
| `burgundy` | `#633C48` | akcent na papíru |
| `gold` | `#B08A50` | guilloché, akcent na tmavém |
| `violet`, `banknote-green` | `#66506B`, `#536B58` | jen drobné detaily |

V jedné sekci se používají nejvýš tři až čtyři barvy. Rytinu (guilloché, rozety, vlnová pole) generuje
matematicky — hypotrochoida a epitrochoida — skript `scripts/build-engraving.mjs`:

```bash
npm run engraving   # přegeneruje public/engraving/*.svg
```

Výsledek jsou statické SVG v `public/engraving/`, které komponenty v `src/components/engraving` vykreslují jako
`<img>`. Dřív se tisíce cest vypisovaly přímo do HTML (homepage měla 633 kB); takhle má homepage 113 kB
(≈ 20 kB po gzipu) a kresba zůstává ostrá v každém rozlišení. Opacita 5–20 %, papír má jemné zrno přes
`body::before`.

Mikrotypografie (`ADAM POSPÍŠIL · INVESTIČNÍ NEMOVITOSTI · PRAHA`, `A. P. / 01`, `CZ / 2026`) i velké nominály
jsou čistě dekorativní, označené `aria-hidden` (číslice se kreslí přes `::before`, takže nevzniká textový uzel),
a nikdy nepředstírají bankovní nebo právní údaje.

## Struktura

```
src/app              stránky (/, /financovani, /workshopy, /nastroje, /kontakt,
                     /ochrana-osobnich-udaju), sitemap.ts, robots.ts, not-found.tsx, api/kontakt
src/components/home  devět sekcí homepage: Hero, Story, SkinInTheGame, Philosophy, Figures, Reviews,
                     Workshop, Cases, Contact
src/components/engraving  rytina: guilloché, rozeta, vlnové pole, rohy, nominály, mikrotypografie
src/components/ui    Button, Section/SectionMark, Reveal, RevealObserver, PageHero, JsonLd
src/lib              site.ts (kontakty, ověřená čísla, ČNB limity), reviews.ts, workshops.ts, caseStudies.ts,
                     model.ts, schema.ts, format.ts, metadata.ts, raynet.ts (lead + telefonát v CRM),
                     workingHours.ts (pracovní hodiny, volné sloty)
scripts              build-engraving.mjs (generátor SVG rytin)
```

### Navigace a homepage

Menu má **Financování · Workshopy · Kontakt** plus CTA „Probrat financování“. Homepage **je**
stránka o Adamovi, proto v menu žádná taková položka není a `/o-adamovi` se trvale přesměrovává na `/`
(`next.config.ts`). `/financovani` je záměrně krátký rozcestník — drží klíčová slova a odkazy na podrobné stránky
Evergreen Finance, ne vlastní odborný obsah. `/nastroje` je dostupná z obsahu, z patičky a z mobilního menu —
`DEEP_PAGES` v `src/lib/site.ts`.

Homepage vede jeden příběh v pořadí osobnost → příběh → investor → expert → důkazy → EGFIN:

| # | Sekce | Obsah |
| --- | --- | --- |
| 01 | Hero | jméno, pozice, portrét |
| 02 | Cesta | „Od hypoték k portfoliím“ + časová osa 2010 → dnes |
| 03 | Vlastní investice | „Neučím investory něco, co sám nedělám.“ |
| 04 | Jak přemýšlím | čtyři principy financování |
| 05 | Zkušenost | ověřená čísla |
| 06 | Co říkají klienti | skutečné Google recenze |
| 07 | Workshop | nejbližší termíny |
| 08 | Případová studie | Petr H.: stejná banka, o 4 miliony víc |
| 09 | Kontakt | otázka + formulář |

Všechna čísla, termíny a ceny se mění na jednom místě:

- `src/lib/site.ts` – `FACTS` (roky praxe, objemy úvěrů, klienti, partneři), `CNB_2026`, kontakty
- `src/lib/workshops.ts` – termíny, místo, ceny, early bird (stránky s workshopy se přegenerují každou hodinu
  a samy přepnou early bird → běžná cena → „další termín připravuji“)
- `src/lib/caseStudies.ts` – jediná případová studie (Petr H.) na homepage
- `src/lib/model.ts` – modelový příklad (cena, LTV, sazba, nájem) pro kalkulačku a ukázky
- `src/lib/reviews.ts` – recenze klientů

### Recenze

V sekci „Co říkají klienti“ jsou **skutečné veřejné Google recenze Evergreen Finance**, přepsané doslova ze
strukturovaných dat publikovaných na egfin.cz, i s hodnocením 5,0 z 5 a počtem recenzí. Sekce vede na veřejný
profil firmy na Googlu, kde si je kdokoli ověří.

Google Places API na tomhle projektu není k dispozici, takže se recenze **nenačítají automaticky** — obsah
`src/lib/reviews.ts` se aktualizuje ručně. Pravidlo: nikdy nevymýšlet ani neupravovat text recenze, autora nebo
hodnocení. Když ověřený zdroj chybí, je správné sekci zúžit na odkaz na Google profil, ne ji doplnit nepodloženým
obsahem.

## Vývoj

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Kontaktní formulář

`POST /api/kontakt` zpracuje poptávku dvěma kanály, v tomto pořadí:

1. **Raynet CRM** (`src/lib/raynet.ts`) – založí lead s předmětem „Jméno Příjmení“ (zdroj kontaktu „web/poptávka“,
   kategorie tipaře, poznámka se stránkou, tématem a zprávou) a k němu naplánuje telefonát **„Zavolat: Jméno Příjmení“**
   na **nejbližší volnou pracovní hodinu**. Volný slot se hledá v kalendáři vlastníka (`GET /activity/`, aktivity, kde je
   účastníkem; zrušené a realizované se nepočítají) po celých hodinách 9–18 h, denně, až 30 dní dopředu. Když volný
   slot není, naplánuje první možný termín a v e-mailu na kolizi upozorní.
2. **E-mail přes [Resend](https://resend.com)** – text poptávky plus řádek s výsledkem CRM (číslo leadu a termín
   telefonátu, případně proč se lead nebo telefonát nepodařilo založit).

Výpočet slotů (`src/lib/workingHours.ts`) běží v zóně Europe/Prague nezávisle na zóně serveru. Bez nastaveného
e-mailu ani CRM vrací endpoint 503 a formulář nabídne přímé kanály (WhatsApp, telefon, e-mail), takže nikdy „tiše“
neselže; když CRM lead založí a e-mail selže (nebo naopak), poptávka se považuje za doručenou.

| Proměnná                   | Význam                                                                          |
| -------------------------- | ------------------------------------------------------------------------------- |
| `RESEND_API_KEY`           | API klíč Resend                                                                 |
| `LEAD_TO_EMAIL`            | kam poptávky chodí (např. adam.pospisil@egfin.cz)                               |
| `LEAD_FROM_EMAIL`          | odesílatel s ověřenou doménou, výchozí `web@adamovyfinance.cz`                  |
| `RAYNET_API_KEY`           | API klíč Raynet (Nastavení aplikace → Pro vývojáře → API klíče)                 |
| `RAYNET_USERNAME`          | přihlašovací e-mail uživatele, pod kterým API volá                              |
| `RAYNET_INSTANCE_NAME`     | název instance (`evergreen`)                                                    |
| `RAYNET_OWNER_ID`          | ID uživatele, který lead i telefonát vlastní a v jehož kalendáři se hledá slot  |
| `RAYNET_LEAD_CATEGORY_ID`  | volitelně kategorie leadu (číselník LeadCategory)                               |
| `RAYNET_CONTACT_SOURCE_ID` | volitelně zdroj kontaktu (číselník ContactSource)                               |
| `RAYNET_WORK_HOURS`        | volitelně pracovní doba, výchozí `9-18`                                         |
| `RAYNET_WORK_DAYS`         | volitelně pracovní dny `1-7` (1 = pondělí), výchozí denně; jen všední dny `1-5` |
| `RAYNET_SLOT_MINUTES`      | volitelně délka slotu, výchozí `60`                                             |
| `RAYNET_ACTIVITY_TYPE`     | volitelně `phoneCall` (výchozí) nebo `task`                                     |

Viz `.env.example` – jsou v něm i konkrétní ID číselníků instance Evergreen.

## Nasazení (Vercel)

1. Importovat repozitář do Vercelu, framework Next.js, bez dalších nastavení.
2. Přidat domény `adamovyfinance.cz` (primární) a `www.adamovyfinance.cz` (Vercel ji přesměruje 308 na primární).
   HTTP → HTTPS a HSTS řeší Vercel + hlavičky v `next.config.ts`.
3. Nastavit proměnné prostředí pro formulář a Raynet (viz výše).
4. U registrátora (aktuálně parkování VEDOS) přesměrovat DNS: `A 76.76.21.21` pro apex a `CNAME cname.vercel-dns.com`
   pro `www`, případně podle instrukcí ve Vercelu.

## Google Search Console – po nasazení

1. Přidat property typu **Doména** `adamovyfinance.cz`, ověřit DNS TXT záznamem u registrátora.
2. Sitemaps → odeslat `https://adamovyfinance.cz/sitemap.xml`.
3. URL Inspection → `https://adamovyfinance.cz/` → Request indexing.
4. Totéž pro `/financovani` a `/workshopy`.
5. Ověřit strukturovaná data v [Rich Results Test](https://search.google.com/test/rich-results): Person,
   ProfilePage, Organization, ProfessionalService, Event (workshopy), FAQPage, BreadcrumbList.
   Poslední kontrola přes validator.schema.org: 0 chyb a 0 varování na všech stránkách.

- Sitemap: `https://adamovyfinance.cz/sitemap.xml`
- Robots: `https://adamovyfinance.cz/robots.txt`
- Canonical homepage: `https://adamovyfinance.cz/`
