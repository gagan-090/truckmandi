/**
 * Indian commercial vehicles are priced in lakh and crore. A raw
 * ₹12,50,000 is harder to scan in a listing grid than "₹12.5 Lakh",
 * so grids use the short form and detail pages show both.
 */

import { trimTrailingZeros } from "./decimals";

const LAKH = 100_000;
const CRORE = 10_000_000;

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Full precision: "₹12,50,000". */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return inrFormatter.format(Math.round(amount));
}

/** Compact Indian form: "₹12.5 Lakh", "₹1.25 Cr", "₹85,000". */
export function formatPriceShort(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return "Price on request";

  if (amount >= CRORE) {
    return `₹${trimTrailingZeros(amount / CRORE, 2)} Cr`;
  }
  if (amount >= LAKH) {
    return `₹${trimTrailingZeros(amount / LAKH, 2)} Lakh`;
  }
  return inrFormatter.format(Math.round(amount));
}

/** Axis and slider labels where "₹" is already implied. "12.5L", "1.2Cr". */
export function formatPriceCompact(amount: number): string {
  if (amount >= CRORE) return `${trimTrailingZeros(amount / CRORE, 1)}Cr`;
  if (amount >= LAKH) return `${trimTrailingZeros(amount / LAKH, 1)}L`;
  if (amount >= 1000) return `${trimTrailingZeros(amount / 1000, 0)}K`;
  return String(Math.round(amount));
}

/** Monthly EMI values are always shown to the rupee. */
export function formatEmi(amount: number): string {
  return `${inrFormatter.format(Math.round(amount))}/mo`;
}
