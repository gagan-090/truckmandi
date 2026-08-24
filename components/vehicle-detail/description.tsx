export function VehicleDescription({ description }: { description: string }) {
  return (
    <section aria-labelledby="description-heading">
      <h2
        id="description-heading"
        className="font-display text-lg font-bold text-steel-900"
      >
        About this vehicle
      </h2>
      <p className="mt-3.5 leading-relaxed text-pretty text-steel-700">
        {description}
      </p>
    </section>
  );
}
