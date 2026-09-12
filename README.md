# adamovyfinance.cz

Osobní web Adama Pospíšila – finanční poradce, hypoteční specialista, specialista na financování investičních
nemovitostí, investor a lektor. Pozice webu: **„Banka vidí úvěr. Já vidím portfolio.“**

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

V jedné sekci se používají nejvýš tři až čtyři barvy. Rytinový systém (`src/components/engraving`) generuje
guilloché, rozety a vlnová pole matematicky (hypotrochoida a epitrochoida), takže nejde o obrázky a vše zůstává
ostré v každém rozlišení. Kresba drží opacitu 5–20 %, papír má jemné zrno přes `body::before`.

Mikrotypografie (`ADAM POSPÍŠIL / INVESTMENT FINANCING`, `A. P. / 01`, `CZ / 2026`) je čistě dekorativní,
označená `aria-hidden`, a nikdy nepředstírá bankovní nebo právní údaje.

## Struktura

```
src/app              stránky (/, /financovani, /workshopy, /pripadove-studie, /o-adamovi, /nastroje, /kontakt,
                     /ochrana-osobnich-udaju), sitemap.ts, robots.ts, not-found.tsx, api/kontakt
src/components/home  sekce homepage (Hero, About, Specialisation, Figures, Workshop, Contact)
src/components/engraving  rytinový systém: guilloché, rozeta, vlnové pole, rohy, nominály, mikrotypografie
src/components/ui    Button, Section/SectionMark, Reveal, RevealObserver, PageHero, JsonLd
src/lib              site.ts (kontakty, ověřená čísla, ČNB limity), workshops.ts, caseStudies.ts, model.ts, schema.ts,
                     format.ts, metadata.ts, motion.ts
```

Všechna čísla, termíny a ceny se mění na jednom místě:

- `src/lib/site.ts` – `FACTS` (roky praxe, objemy úvěrů, klienti, partneři), `CNB_2026`, kontakty
- `src/lib/workshops.ts` – termíny, místo, ceny, early bird (stránky s workshopy se přegenerují každou hodinu
  a samy přepnou early bird → běžná cena → „další termín připravuji“)
- `src/lib/caseStudies.ts` – případové studie
- `src/lib/model.ts` – modelový příklad (cena, LTV, sazba, nájem) pro kalkulačku a ukázky

## Vývoj

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start
```

## Kontaktní formulář

`POST /api/kontakt` posílá poptávku e-mailem přes [Resend](https://resend.com). Bez nastavených proměnných vrací
503 a formulář nabídne přímé kanály (WhatsApp, telefon, e-mail), takže nikdy „tiše“ neselže.

| Proměnná           | Význam                                                            |
| ------------------ | ----------------------------------------------------------------- |
| `RESEND_API_KEY`   | API klíč Resend                                                   |
| `LEAD_TO_EMAIL`    | kam poptávky chodí (např. adam.pospisil@egfin.cz)                 |
| `LEAD_FROM_EMAIL`  | odesílatel s ověřenou doménou, výchozí `web@adamovyfinance.cz`    |

Viz `.env.example`.

## Nasazení (Vercel)

1. Importovat repozitář do Vercelu, framework Next.js, bez dalších nastavení.
2. Přidat domény `adamovyfinance.cz` (primární) a `www.adamovyfinance.cz` (Vercel ji přesměruje 308 na primární).
   HTTP → HTTPS a HSTS řeší Vercel + hlavičky v `next.config.ts`.
3. Nastavit proměnné prostředí pro formulář (viz výše).
4. U registrátora (aktuálně parkování VEDOS) přesměrovat DNS: `A 76.76.21.21` pro apex a `CNAME cname.vercel-dns.com`
   pro `www`, případně podle instrukcí ve Vercelu.

## Google Search Console – po nasazení

1. Přidat property typu **Doména** `adamovyfinance.cz`, ověřit DNS TXT záznamem u registrátora.
2. Sitemaps → odeslat `https://adamovyfinance.cz/sitemap.xml`.
3. URL Inspection → `https://adamovyfinance.cz/` → Request indexing.
4. Totéž pro `/financovani`, `/workshopy`, `/pripadove-studie`, `/o-adamovi`.
5. Ověřit strukturovaná data v [Rich Results Test](https://search.google.com/test/rich-results): Person,
   Organization, ProfessionalService, Event (workshopy), FAQPage, BreadcrumbList.

- Sitemap: `https://adamovyfinance.cz/sitemap.xml`
- Robots: `https://adamovyfinance.cz/robots.txt`
- Canonical homepage: `https://adamovyfinance.cz/`
