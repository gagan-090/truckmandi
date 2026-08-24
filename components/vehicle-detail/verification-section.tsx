import { ShieldCheck } from "lucide-react";
import { VerificationChecklist } from "@/components/marketplace/verification-badge";
import { formatListingDate } from "@/lib/utils/format-distance";
import type { Vehicle } from "@/types/vehicle";

export function VerificationSection({ vehicle }: { vehicle: Vehicle }) {
  const { verification } = vehicle;

  return (
    <section aria-labelledby="verification-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="verification-heading"
          className="font-display text-lg font-bold text-steel-900"
        >
          Documents & verification
        </h2>

        {verification.inspected &&
          verification.inspectionScore !== undefined && (
            <div className="flex items-center gap-2 rounded-md border border-trust-200 bg-trust-50 px-3 py-2">
              <ShieldCheck
                aria-hidden
                className="size-4 shrink-0 text-trust-600"
              />
              <span className="text-sm font-semibold text-trust-800">
                Inspection score {verification.inspectionScore}/100
              </span>
            </div>
          )}
      </div>

      <VerificationChecklist verification={verification} className="mt-4" />

      {verification.inspected && verification.inspectedAt && (
        <p className="mt-3.5 text-xs text-steel-500">
          Physically inspected by a TruckMitr engineer on{" "}
          {formatListingDate(verification.inspectedAt)}. The report covers
          engine, driveline, chassis, body and electricals.
        </p>
      )}

      {!verification.isVerified && (
        <p className="mt-3.5 rounded-md border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900">
          This listing has not completed verification. Inspect the vehicle in
          person and check the original documents before paying any advance.
        </p>
      )}
    </section>
  );
}
