/**
 * Fixes a number to `fractionDigits` and removes trailing zeros in the
 * fraction only — "12.50" becomes "12.5" and "12.00" becomes "12", while
 * "1250" is left alone.
 */
export function trimTrailingZeros(
  value: number,
  fractionDigits: number,
): string {
  return value
    .toFixed(fractionDigits)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}
