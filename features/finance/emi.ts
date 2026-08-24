import { FINANCE_DEFAULTS } from "@/config/constants";

export interface EmiInput {
  /** Vehicle price before any down payment. */
  price: number;
  downPayment: number;
  /** Annual interest rate as a percentage, e.g. 11.5. */
  annualRate: number;
  tenureMonths: number;
}

export interface EmiResult {
  loanAmount: number;
  monthlyEmi: number;
  totalPayable: number;
  totalInterest: number;
}

/**
 * Standard reducing-balance EMI:
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where `r` is the monthly rate and `n` the tenure in months. A zero rate
 * degenerates to a straight division, which the formula cannot express.
 */
export function calculateEmi({
  price,
  downPayment,
  annualRate,
  tenureMonths,
}: EmiInput): EmiResult {
  const loanAmount = Math.max(0, price - downPayment);

  if (loanAmount === 0 || tenureMonths <= 0) {
    return { loanAmount, monthlyEmi: 0, totalPayable: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = loanAmount / tenureMonths;
    return {
      loanAmount,
      monthlyEmi: emi,
      totalPayable: loanAmount,
      totalInterest: 0,
    };
  }

  const growth = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi = (loanAmount * monthlyRate * growth) / (growth - 1);
  const totalPayable = monthlyEmi * tenureMonths;

  return {
    loanAmount,
    monthlyEmi,
    totalPayable,
    totalInterest: totalPayable - loanAmount,
  };
}

/** The EMI a listing page quotes, using platform default terms. */
export function defaultEmiFor(price: number): EmiResult {
  return calculateEmi({
    price,
    downPayment: Math.round(
      (price * FINANCE_DEFAULTS.downPaymentPercent) / 100,
    ),
    annualRate: FINANCE_DEFAULTS.interestRate,
    tenureMonths: FINANCE_DEFAULTS.tenureMonths,
  });
}
