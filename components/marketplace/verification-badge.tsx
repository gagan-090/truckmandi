import {
  BadgeCheck,
  FileCheck2,
  ShieldCheck,
  Stamp,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { VehicleVerification } from "@/types/vehicle";

interface VerificationItem {
  key: keyof VehicleVerification;
  label: string;
  icon: LucideIcon;
}

const items: VerificationItem[] = [
  { key: "rcAvailable", label: "RC available", icon: FileCheck2 },
  { key: "insuranceValid", label: "Insurance valid", icon: ShieldCheck },
  { key: "fitnessValid", label: "Fitness valid", icon: Stamp },
  { key: "permitValid", label: "Permit valid", icon: Stamp },
  { key: "inspected", label: "Inspected", icon: Wrench },
];

/** The single "Verified" mark used on cards and headers. */
export function VerifiedBadge({
  className,
  size = "sm",
  label = "Verified",
}: {
  className?: string;
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <Badge variant="trust" size={size} className={className}>
      <BadgeCheck aria-hidden />
      {label}
    </Badge>
  );
}

/**
 * Document checklist. Both the icon and the wording carry the state, so
 * colour is never the only signal.
 */
export function VerificationChecklist({
  verification,
  className,
}: {
  verification: VehicleVerification;
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-2.5 sm:grid-cols-2", className)}>
      {items.map((item) => {
        const ok = Boolean(verification[item.key]);
        const Icon = item.icon;

        return (
          <li
            key={item.key}
            className={cn(
              "flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm",
              ok
                ? "border-trust-200 bg-trust-50 text-trust-800"
                : "border-steel-200 bg-steel-50 text-steel-500",
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                "size-4 shrink-0",
                ok ? "text-trust-600" : "text-steel-400",
              )}
            />
            <span className="font-medium">{item.label}</span>
            <span className="ml-auto text-xs font-semibold">
              {ok ? "Yes" : "Not provided"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
