import { trimTrailingZeros } from "./decimals";

const numberFormatter = new Intl.NumberFormat("en-IN");

/** "1,25,000" — Indian digit grouping. */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return numberFormatter.format(Math.round(value));
}

/** Odometer readings: "1,25,000 km". */
export function formatKilometers(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  return `${numberFormatter.format(Math.round(value))} km`;
}

/** Odometer in tight card layouts: "1.25 Lakh km" -> "1.25L km". */
export function formatKilometersShort(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "—";
  if (value >= 100_000) {
    return `${trimTrailingZeros(value / 100_000, 2)}L km`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}k km`;
  }
  return `${value} km`;
}

/** GVW and payload read better in tonnes above a tonne. */
export function formatWeight(kg: number | undefined): string {
  if (kg === undefined || !Number.isFinite(kg)) return "—";
  if (kg >= 1000) {
    return `${trimTrailingZeros(kg / 1000, 2)} T`;
  }
  return `${numberFormatter.format(kg)} kg`;
}

export function formatOwnership(count: number): string {
  if (count <= 0) return "—";
  if (count === 1) return "1st owner";
  if (count === 2) return "2nd owner";
  if (count === 3) return "3rd owner";
  return `${count}th owner`;
}

/** Ordinal-free variant for dense chip rows. */
export function formatOwnershipShort(count: number): string {
  return count > 0 ? `${count} owner${count > 1 ? "s" : ""}` : "—";
}
