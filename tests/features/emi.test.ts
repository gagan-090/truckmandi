import { describe, expect, it } from "vitest";
import { calculateEmi, defaultEmiFor } from "@/features/finance/emi";
import { FINANCE_DEFAULTS } from "@/config/constants";

describe("calculateEmi", () => {
  it("matches the standard reducing-balance formula", () => {
    // ₹9,60,000 over 48 months at 11.5% p.a.
    const result = calculateEmi({
      price: 1_200_000,
      downPayment: 240_000,
      annualRate: 11.5,
      tenureMonths: 48,
    });

    expect(result.loanAmount).toBe(960_000);
    expect(Math.round(result.monthlyEmi)).toBe(25_045);
    expect(Math.round(result.totalPayable)).toBe(1_202_182);
    expect(Math.round(result.totalInterest)).toBe(242_182);
  });

  it("keeps totalPayable equal to emi times tenure", () => {
    const result = calculateEmi({
      price: 2_350_000,
      downPayment: 470_000,
      annualRate: 13.25,
      tenureMonths: 60,
    });

    expect(result.totalPayable).toBeCloseTo(result.monthlyEmi * 60, 6);
    expect(result.totalInterest).toBeCloseTo(
      result.totalPayable - result.loanAmount,
      6,
    );
  });

  it("divides evenly at a zero interest rate", () => {
    const result = calculateEmi({
      price: 600_000,
      downPayment: 100_000,
      annualRate: 0,
      tenureMonths: 50,
    });

    expect(result.monthlyEmi).toBe(10_000);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(500_000);
  });

  it("returns zeros when the down payment covers the price", () => {
    const result = calculateEmi({
      price: 500_000,
      downPayment: 500_000,
      annualRate: 11.5,
      tenureMonths: 36,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyEmi).toBe(0);
  });

  it("never produces a negative loan from an over-payment", () => {
    const result = calculateEmi({
      price: 400_000,
      downPayment: 600_000,
      annualRate: 11.5,
      tenureMonths: 36,
    });

    expect(result.loanAmount).toBe(0);
  });

  it("returns zeros for a zero tenure rather than dividing by zero", () => {
    const result = calculateEmi({
      price: 500_000,
      downPayment: 0,
      annualRate: 11.5,
      tenureMonths: 0,
    });

    expect(Number.isFinite(result.monthlyEmi)).toBe(true);
    expect(result.monthlyEmi).toBe(0);
  });

  it("raises the EMI as the rate rises", () => {
    const base = { price: 1_000_000, downPayment: 200_000, tenureMonths: 48 };
    const cheap = calculateEmi({ ...base, annualRate: 9 });
    const costly = calculateEmi({ ...base, annualRate: 16 });

    expect(costly.monthlyEmi).toBeGreaterThan(cheap.monthlyEmi);
    expect(costly.totalInterest).toBeGreaterThan(cheap.totalInterest);
  });

  it("lowers the EMI but raises total interest as tenure lengthens", () => {
    const base = { price: 1_000_000, downPayment: 200_000, annualRate: 11.5 };
    const short = calculateEmi({ ...base, tenureMonths: 24 });
    const long = calculateEmi({ ...base, tenureMonths: 72 });

    expect(long.monthlyEmi).toBeLessThan(short.monthlyEmi);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });
});

describe("defaultEmiFor", () => {
  it("uses the platform default terms", () => {
    const price = 985_000;
    const expected = calculateEmi({
      price,
      downPayment: Math.round(
        (price * FINANCE_DEFAULTS.downPaymentPercent) / 100,
      ),
      annualRate: FINANCE_DEFAULTS.interestRate,
      tenureMonths: FINANCE_DEFAULTS.tenureMonths,
    });

    expect(defaultEmiFor(price).monthlyEmi).toBeCloseTo(expected.monthlyEmi, 6);
  });
});
