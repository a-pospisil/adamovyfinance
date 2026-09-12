import { annuity } from "@/lib/format";
import { CNB_2026 } from "@/lib/site";

/**
 * Model example used across the site. Illustrative, not a client case –
 * every place that renders it says so ("modelový příklad").
 */
export const MODEL = {
  ratePct: 5.2,
  years: 30,
  ltv: CNB_2026.investmentLtv / 100,
  price: 4_000_000,
  rent: 18_000,
  reserveMonths: 6,
} as const;

export function modelUnit(price: number, rent: number, ltv = MODEL.ltv) {
  const loan = Math.round(price * ltv);
  const equity = price - loan;
  const payment = annuity(loan, MODEL.ratePct, MODEL.years);
  return {
    price,
    rent,
    loan,
    equity,
    payment,
    cashflow: rent - payment,
    dscr: rent / payment,
    reserve: payment * MODEL.reserveMonths,
  };
}

export const MODEL_UNIT = modelUnit(MODEL.price, MODEL.rent);

/** Five-step model portfolio for the portfolio builder scene. */
export const MODEL_PORTFOLIO = [
  { id: "01", price: 4_000_000, rent: 18_000, note: "První investiční byt" },
  { id: "02", price: 3_600_000, rent: 16_000, note: "Z uvolněného kapitálu po refinancování" },
  { id: "03", price: 5_200_000, rent: 22_000, note: "Třetí jednotka, jiná banka, jiná metodika" },
  { id: "04", price: 4_400_000, rent: 19_000, note: "Zástava přes stávající portfolio" },
  { id: "05", price: 6_800_000, rent: 28_000, note: "Větší jednotka, financování přes s.r.o." },
].map((u) => ({ ...u, ...modelUnit(u.price, u.rent) }));

export type PortfolioStep = {
  index: number;
  value: number;
  debt: number;
  rent: number;
  payment: number;
  cashflow: number;
  ltv: number;
};

export const MODEL_PORTFOLIO_STEPS: PortfolioStep[] = MODEL_PORTFOLIO.reduce<PortfolioStep[]>((acc, u, i) => {
  const prev = acc[i - 1] ?? { value: 0, debt: 0, rent: 0, payment: 0 };
  const value = prev.value + u.price;
  const debt = prev.debt + u.loan;
  const rent = prev.rent + u.rent;
  const payment = prev.payment + u.payment;
  acc.push({ index: i + 1, value, debt, rent, payment, cashflow: rent - payment, ltv: debt / value });
  return acc;
}, []);
