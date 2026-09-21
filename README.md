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
   na **nejbližší volný slot v pracovní době**. Volný slot se hledá v kalendáři vlastníka (`GET /activity/`, aktivity,
   kde je účastníkem; zrušené a realizované se nepočítají) po 15 minutách v pracovní dny od 9:00, poslední slot
   16:45–17:00, až 30 dní dopředu.
   Když volný slot není, naplánuje první slot následujícího pracovního dne po přijetí poptávky a v e-mailu na kolizi
   upozorní.
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
| `RAYNET_WORK_HOURS`        | volitelně pracovní doba, výchozí `9-17` (konec exkluzivní), lze i `9:00-16:45`  |
| `RAYNET_WORK_DAYS`         | volitelně pracovní dny (1 = pondělí … 7 = neděle), výchozí `1-5`; s víkendem `1-7` |
| `RAYNET_SLOT_MINUTES`      | volitelně délka slotu v minutách, výchozí `15`                                  |
| `RAYNET_ACTIVITY_TYPE`     | volitelně `phoneCall` (výchozí) nebo `task`                                     |

Viz `.env.example` – jsou v něm i konkrétní ID číselníků instance Evergreen.

## Nasazení (Vercel)

1. Importovat repozitář do Vercelu, framework Next.js, bez dalších nastavení.
2. Přidat domény `adamovyfinance.cz` (primární) a `www.adamovyfinance.cz` (Vercel ji přesměruje 308 na primární).
   HTTP → HTTPS a HSTS řeší Vercel + hlavičky v `next.config.ts`.
3. Nastavit proměnné prostředí pro formulář a Raynet (viz výše).
4. U registrátora (aktuálně parkování VEDOS) přesměrovat DNS: `A 76.76.21.21` pro apex a `CNAME cname.vercel-dns.com`
   pro `www`, případně podle instrukcí ve Vercelu.

## Značka „Adamovy finance“ ve vyhledávání

Na dotaz „Adamovy finance“ vracel Google jako první facebookovou stránku, napravo
zobrazoval cizí firmu **ADAM finance, a.s.** (IČO 28367243) a web sám nikde.
Příčiny byly na straně kódu tyhle a všechny jsou vyřešené:

| Problém | Stav před | Řešení |
| --- | --- | --- |
| Fráze „Adamovy finance“ nebyla v title, description ani ve strukturovaných datech — jen jednou drobným písmem v patičce | Google neměl důvod spojit doménu se značkou | `SITE.brand`; title `Adamovy finance – Adam Pospíšil \| …`; šablona podstránek `%s \| Adamovy finance – Adam Pospíšil` |
| `og:site_name` i `WebSite.name` zněly „Adam Pospíšil“ | Google bere název webu právě odsud, takže značku nikdy nezobrazil | obojí je teď `Adamovy finance`, `alternateName` drží „Adam Pospíšil“ |
| Facebook `@adamovyfinance` nebyl z webu odkazovaný ani v `sameAs` | web a FB byly pro Google dvě nesouvisející entity | odkaz v patičce + `sameAs` v `Person`, `Brand` i `ProfessionalService` |
| Neexistovala entita pojmenovaná „Adamovy finance“ | Google dotaz spároval s nejbližší firmou v rejstříku | nový uzel `Brand` (`brandSchema()`) s logem, sloganem a `sameAs` |
| Staré WordPressové adresy vracely 404, přestože je Google drží v indexu (ověřeno na `/uspory-a-investice/`) — a byly to právě ony, co nesly „Adamovy finance“ v titulku | ztracená historie domény | trvalé redirecty v `next.config.ts` |

### Co je potřeba dodělat ručně

Kód dodá signály, zbytek je mimo repozitář. V pořadí podle dopadu:

1. **Google Business Profile pro „Adamovy finance“.** Jediná věc, která reálně
   přepíše panel vpravo. Panel *ADAM finance, a.s.* tam není kvůli webu — Google
   dotaz vyhodnotí jako hledání firmy a vezme nejbližší ověřený profil. Dokud pro
   „Adamovy finance“ žádný neexistuje, zůstane tam cizí firma. Založit na
   <https://business.google.com>: název „Adamovy finance“, adresa Palackého 715/15,
   Praha 1, kategorie *Hypoteční makléř* / *Finanční poradce*, web
   `https://adamovyfinance.cz` — a **ověřit**; bez ověření se panel nezobrazí.
2. **Na Facebooku `@adamovyfinance` doplnit do „O nás“ odkaz na `adamovyfinance.cz`.**
   FB stránka je dnes na dotaz první. Až z ní povede odkaz na web, Google obě
   entity spojí a s přesnou shodou domény i titulku obvykle převezme první pozici
   web. Totéž v biu na Instagramu.
3. **Search Console → Stránky → „Nenalezeno (404)“.** Vytáhnout skutečný seznam
   starých WP adres a doplnit ho do bloku redirectů v `next.config.ts`. Ty, co
   jsou tam teď, jsou potvrzená `/uspory-a-investice/` plus obvyklé cesty webu
   finančního poradce; reálný seznam zná jen Search Console.
4. **Nahlásit špatný panel:** u panelu *ADAM finance, a.s.* → „O těchto údajích“ →
   zpětná vazba, že výsledek neodpovídá dotazu. Samo o sobě zabírá zřídka, spolu
   s bodem 1 pomáhá.
5. **Seznam.cz Firmy** — na českém trhu se zápis vyplatí.

### Čeho se dá reálně dosáhnout

- **Web na 1. pozici:** vysoká šance. Značkový dotaz s přesnou shodou domény je
  nejsnazší kategorie; chyběla jen shoda v titulku a propojení entit.
- **Panel vpravo:** Google cizí firmu nesmaže — nahradí ji, až bude pro „Adamovy
  finance“ silnější entita. Stojí a padá to s ověřeným Business Profilem (bod 1).
- **Evergreen Finance na 2. pozici:** z tohoto repozitáře to zařídit nejde a není
  realistické to nastavit přesně. Na značkový dotaz obsazuje Google přední místa
  vlastními profily značky (web, FB, Instagram, LinkedIn), takže druhá bude spíš
  facebooková stránka. Aby se `egfin.cz` do výsledků vůbec dostal, musí se na něm
  fráze „Adamovy finance“ objevit — stačí řádek v Adamově profilu na stránce týmu:
  „Adam Pospíšil — Adamovy finance“ s odkazem na `adamovyfinance.cz`. Patička
  tohoto webu na Evergreen Finance odkazuje a meta description ho zmiňuje, takže
  vazba vede oběma směry.

## Search Console hlásí přesměrování — co s tím

Po přechodu z WordPressu na Next.js přijde e-mail „Nové důvody, které brání
indexování“ se dvěma položkami. Nejsou si rovné:

**„Stránka s přesměrováním“ — není chyba.** Je to informace, že URL přesměrovává,
takže se neindexuje ona, ale její cíl. Přesně to má dělat: staré WordPressové
adresy, `/o-mne`, `/kalkulacky`, varianty s `www`, s `http` a s koncovým lomítkem.
Po migraci tahle čísla vždycky vyskočí a nic se s nimi nedělá. Redirecty přidané
kvůli značce toto číslo ještě zvednou — taky v pořádku.

**„Chyba přesměrování“ — to je skutečná chyba.** Znamená, že robot přesměrování
nedokončil: smyčka, příliš dlouhý řetězec, nebo prázdná či neplatná URL v řetězci.

Aktuální stav je proměřený a čistý:

- žádná smyčka; každá cesta z `next.config.ts` končí na 200 nebo 404
- nejdelší řetězec jsou 4 hopy v nejhorší kombinaci
  `http://www.adamovyfinance.cz/stara-cesta/` → https → apex → bez lomítka → cíl;
  Google jich následuje až 10, takže délka problém není
- `www` i `http` varianty se korektně sbíhají na `https://adamovyfinance.cz`

Nejpravděpodobnější příčina hlášených chyb je tedy **okno migrace** — přepnutí DNS
z parkování na Vercel, kdy robot trefil doménu v mezistavu. Takové chyby zmizí při
dalším průchodu. Postup: v Search Console otevřít report, u obou položek dát
**Ověřit opravu**, a pokud se „Chyba přesměrování“ vrátí, exportovat seznam URL —
teprve ten řekne, o které adresy jde.

### Poznámka k `permanent: true`

Redirecty v `next.config.ts` vracejí 308, který si prohlížeč i Google cachují
natrvalo a špatně se berou zpátky. Proto jsou v seznamu jen adresy, o kterých
víme, že existovaly, nebo které se jako cesta znovu nepoužijí. Spekulativní
`/blog`, `/reference`, `/investice` a `/sluzby` tam schválně nejsou — ať zůstanou
volné pro budoucí stránky.

## Google Search Console – po nasazení

1. Přidat property typu **Doména** `adamovyfinance.cz`, ověřit DNS TXT záznamem u registrátora.
2. Sitemaps → odeslat `https://adamovyfinance.cz/sitemap.xml`.
3. URL Inspection → `https://adamovyfinance.cz/` → Request indexing. Po změně titulků
   a strukturovaných dat je nutné reindexaci vyžádat znovu, jinak se projeví až při
   dalším průchodu robota.
4. Totéž pro `/financovani` a `/workshopy`.
5. Ověřit strukturovaná data v [Rich Results Test](https://search.google.com/test/rich-results): Person,
   Brand, ProfilePage, Organization, ProfessionalService, Event (workshopy), FAQPage, BreadcrumbList.
6. Sledovat ve **Výkon → Dotazy** pozici na „adamovy finance“, „adamovy finance praha“
   a „adam pospíšil hypotéky“.

- Sitemap: `https://adamovyfinance.cz/sitemap.xml`
- Robots: `https://adamovyfinance.cz/robots.txt`
- Canonical homepage: `https://adamovyfinance.cz/`
