import { Check } from "lucide-react";

export function VehicleHighlights({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) return null;

  return (
    <section aria-labelledby="highlights-heading">
      <h2
        id="highlights-heading"
        className="font-display text-lg font-bold text-steel-900"
      >
        Seller highlights
      </h2>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2.5 rounded-md bg-steel-50 px-3.5 py-3 text-sm text-steel-700"
          >
            <Check
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-trust-600"
            />
            <span className="text-pretty">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
