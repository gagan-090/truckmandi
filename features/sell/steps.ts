export interface SellStep {
  id: string;
  label: string;
  shortLabel: string;
  href: string;
}

/**
 * The wizard's route order. `sell-progress` and the step navigation both
 * read from here, so adding a step never means editing three files.
 */
export const sellSteps: SellStep[] = [
  {
    id: "type",
    label: "Vehicle type",
    shortLabel: "Type",
    href: "/sell/vehicle",
  },
  {
    id: "details",
    label: "Details & condition",
    shortLabel: "Details",
    href: "/sell/vehicle/details",
  },
  {
    id: "photos",
    label: "Photos",
    shortLabel: "Photos",
    href: "/sell/vehicle/photos",
  },
  {
    id: "pricing",
    label: "Price & documents",
    shortLabel: "Price",
    href: "/sell/vehicle/pricing",
  },
  {
    id: "seller",
    label: "Your details",
    shortLabel: "Contact",
    href: "/sell/vehicle/seller",
  },
  {
    id: "preview",
    label: "Preview & publish",
    shortLabel: "Preview",
    href: "/sell/vehicle/preview",
  },
];

export function stepIndexFor(pathname: string): number {
  // Longest match wins, so /sell/vehicle/details does not resolve to /sell/vehicle.
  let bestIndex = 0;
  let bestLength = 0;

  sellSteps.forEach((step, index) => {
    if (pathname.startsWith(step.href) && step.href.length > bestLength) {
      bestIndex = index;
      bestLength = step.href.length;
    }
  });

  return bestIndex;
}
