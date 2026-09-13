/**
 * Jediná případová studie na webu — ukázka z workshopů, kterou Adam
 * používá i na landing pages egfin.cz. Jméno změněné, čísla jak byla publikována.
 */
export const FEATURED_CASE = {
  title: "Stejná banka, o 4 miliony víc",
  who: "Petr H., 45 let, Praha",
  metrics: [
    { label: "Vyšší úvěr", value: "+4 mil. Kč" },
    { label: "Banka, stejná před i po", value: "1" },
    { label: "Náklady počítané dvakrát", value: "2×" },
  ],
  problem:
    "Klient žádal o investiční hypotéku. Banka mu příjem z nájmu počítala z daňového přiznání a úvěr vyšel o čtyři miliony níž, než potřeboval.",
  change:
    "Z nákladů se odstranily ty, které banka počítala dvakrát. Metodika to umožňuje, na přepážce ji ale nikdo nenabídne.",
  result: "O 4 miliony korun vyšší úvěr. Stejný klient, stejný příjem, stejná banka.",
} as const;
