const NBSP = " ";
const czk = new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 });

/** Normalises locale whitespace (regular, NBSP, narrow NBSP) to NBSP so numbers never wrap and every font renders them. */
export function nb(s: string): string {
  return s.replace(/[\s  ]/g, NBSP);
}

/** 4000000 -> "4 000 000 Kč" */
export function formatCzk(value: number, suffix = `${NBSP}Kč`): string {
  return `${nb(czk.format(Math.round(value)))}${suffix}`;
}

/** 0.7 -> "70 %" */
export function formatPct(ratio: number, digits = 0): string {
  return `${(ratio * 100).toFixed(digits).replace(".", ",")}${NBSP}%`;
}

/** 1.21 -> "1,21×" */
export function formatRatio(value: number, digits = 2): string {
  return `${value.toFixed(digits).replace(".", ",")}×`;
}

/** Signed currency for cashflow: 3100 -> "+3 100 Kč", -1200 -> "−1 200 Kč" */
export function formatSigned(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatCzk(Math.abs(value))}`;
}

/** Monthly annuity payment for a principal at an annual rate over a number of years. */
export function annuity(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}
