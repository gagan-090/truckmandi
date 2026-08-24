/** URL-safe slug: lowercase, ASCII, hyphen separated. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Listing URLs stay human-readable and stable:
 * "tata-407-gold-sfc-2019-delhi-12345"
 * The trailing id is what we resolve against; the prose is for crawlers.
 */
export function buildVehicleSlug(input: {
  brand: string;
  model: string;
  variant?: string;
  year: number;
  city: string;
  id: string;
}): string {
  const parts = [
    input.brand,
    input.model,
    input.variant,
    String(input.year),
    input.city,
    input.id,
  ].filter(Boolean) as string[];

  return slugify(parts.join(" "));
}

/** Recovers the stable id from a listing slug. */
export function extractIdFromSlug(slug: string): string | null {
  const match = /-([a-z0-9]+)$/.exec(slug);
  return match ? match[1] : null;
}

export function titleCase(value: string): string {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
