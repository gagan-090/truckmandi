import { buildSpecGroups } from "@/features/vehicles/utils";
import type { Vehicle } from "@/types/vehicle";

export function VehicleSpecifications({ vehicle }: { vehicle: Vehicle }) {
  const groups = buildSpecGroups(vehicle);

  return (
    <section aria-labelledby="specifications-heading">
      <h2
        id="specifications-heading"
        className="font-display text-lg font-bold text-steel-900"
      >
        Full specifications
      </h2>

      <div className="mt-4 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
              {group.title}
            </h3>
            <dl className="mt-2.5 divide-y divide-steel-100 rounded-lg border border-steel-200">
              {group.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-4 px-4 py-3"
                >
                  <dt className="text-sm text-steel-600">{row.label}</dt>
                  <dd className="tabular text-right text-sm font-semibold text-steel-900">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-steel-500">
        Specifications are provided by the seller. Verify the chassis number,
        engine number and registration details against the original RC before
        making a payment.
      </p>
    </section>
  );
}
