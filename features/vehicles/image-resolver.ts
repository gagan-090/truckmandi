import manifest from "./image-manifest.json";

/**
 * Resolves any vehicle to 100% clean, unwatermarked high-res photos from public/images/Trucks.
 * Completely eliminates TruckMitr watermarks across all cards and gallery thumbnails.
 */
export function resolveVehicleImage(
  rawUrl: string | undefined,
  title: string = "",
  brandSlug: string = "",
): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cleanBrand = brandSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const words = cleanTitle.split("-").filter((w) => w.length >= 3 && w !== "truck" && w !== "commercial");

  // 1. Try matching model name keywords in clean unwatermarked truck photos
  if (words.length > 0) {
    const match = manifest.trucks.find((f) => {
      const lower = f.toLowerCase();
      return words.some((w) => lower.includes(w));
    });
    if (match) return `/images/Trucks/${match}`;
  }

  // 2. Try matching brand name in clean unwatermarked truck photos
  if (cleanBrand) {
    const brandTruckMatch = manifest.trucks.find((f) =>
      f.toLowerCase().includes(cleanBrand),
    );
    if (brandTruckMatch) return `/images/Trucks/${brandTruckMatch}`;
  }

  // 3. Deterministic fallback from clean manifest
  const hash = Math.abs(
    cleanTitle.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
  );
  const fallbackIndex = hash % manifest.trucks.length;
  return `/images/Trucks/${manifest.trucks[fallbackIndex]}`;
}

export function resolveVehicleGallery(
  title: string = "",
  brandSlug: string = "",
  count: number = 4,
): string[] {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cleanBrand = brandSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const words = cleanTitle.split("-").filter((w) => w.length >= 3 && w !== "truck" && w !== "commercial");

  let matches: string[] = [];

  // 1. Find matching model truck photos
  if (words.length > 0) {
    matches = manifest.trucks.filter((f) => {
      const lower = f.toLowerCase();
      return words.some((w) => lower.includes(w));
    });
  }

  // 2. Supplement with brand truck photos
  if (matches.length < count && cleanBrand) {
    const brandMatches = manifest.trucks.filter((f) =>
      f.toLowerCase().includes(cleanBrand),
    );
    matches = [...new Set([...matches, ...brandMatches])];
  }

  // 3. Supplement with deterministic fallback photos
  if (matches.length < count) {
    const hash = Math.abs(
      cleanTitle.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0),
    );
    for (let i = 0; i < count * 3; i++) {
      matches.push(manifest.trucks[(hash + i * 17) % manifest.trucks.length]);
    }
  }

  return [...new Set(matches)]
    .slice(0, count)
    .map((f) => `/images/Trucks/${f}`);
}
