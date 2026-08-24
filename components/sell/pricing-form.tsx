"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultEmiFor } from "@/features/finance/emi";
import { useSellDraft } from "@/features/sell/store";
import { pricingStepSchema, type PricingStep } from "@/features/sell/schemas";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import { formatCurrency, formatPriceShort } from "@/lib/utils/format-currency";
import { StepShell } from "./step-shell";
import { StepSkeleton } from "./vehicle-type-selector";

const documents = [
  {
    name: "rcAvailable" as const,
    label: "RC available",
    hint: "Original registration certificate in your name",
  },
  {
    name: "insuranceValid" as const,
    label: "Insurance valid",
    hint: "Comprehensive or third-party, currently in force",
  },
  {
    name: "fitnessValid" as const,
    label: "Fitness certificate valid",
    hint: "Required for all commercial vehicles",
  },
  {
    name: "permitValid" as const,
    label: "Permit valid",
    hint: "State, national or contract carriage permit",
  },
];

export function PricingStepForm() {
  const router = useRouter();
  const { draft, update, restored } = useSellDraft();

  const form = useForm<PricingStep>({
    resolver: zodResolver(pricingStepSchema),
    values: {
      price: draft.price ?? ("" as unknown as number),
      negotiable: draft.negotiable ?? true,
      rcAvailable: draft.rcAvailable ?? false,
      insuranceValid: draft.insuranceValid ?? false,
      fitnessValid: draft.fitnessValid ?? false,
      permitValid: draft.permitValid ?? false,
    },
  });

  const price = Number(useWatch({ control: form.control, name: "price" })) || 0;
  const emi = price > 0 ? defaultEmiFor(price).monthlyEmi : 0;

  function onSubmit(values: PricingStep) {
    update(values);
    track({ name: "listing_step_completed", step: "pricing" });
    router.push(sellSteps[4].href);
  }

  if (!restored) return <StepSkeleton />;

  return (
    <StepShell
      title="Price & documents"
      description="Price realistically against similar listings, and tell buyers which papers are ready. Complete documentation is the strongest trust signal you can give."
      stepIndex={3}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="price"
            label="Asking price (₹)"
            required
            error={form.formState.errors.price?.message}
          >
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              min={0}
              step={5000}
              placeholder="985000"
              aria-invalid={Boolean(form.formState.errors.price)}
              {...form.register("price")}
            />
          </FormField>

          <div className="rounded-lg border border-steel-200 bg-steel-50 p-4">
            <p className="text-xs text-steel-500">Buyers will see</p>
            <p className="tabular mt-1 font-display text-xl font-extrabold text-steel-900">
              {price > 0 ? formatPriceShort(price) : "—"}
            </p>
            {emi > 0 && (
              <p className="mt-1.5 text-xs text-steel-600">
                Approximately{" "}
                <span className="tabular font-semibold">
                  {formatCurrency(emi)}
                </span>{" "}
                per month on finance
              </p>
            )}
          </div>
        </div>

        <Controller
          control={form.control}
          name="negotiable"
          render={({ field }) => (
            <div className="flex items-start gap-3 rounded-lg border border-steel-200 bg-white p-4">
              <Checkbox
                id="negotiable"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="mt-0.5"
              />
              <div className="min-w-0">
                <Label htmlFor="negotiable" className="cursor-pointer">
                  Price is negotiable
                </Label>
                <p className="mt-0.5 text-xs text-steel-500">
                  Listings marked negotiable receive noticeably more offers.
                </p>
              </div>
            </div>
          )}
        />

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-steel-800">
            Documents you can produce
          </legend>
          <p className="mb-3.5 text-xs text-steel-500">
            Only tick what you can actually show a buyer. We verify these before
            a listing gets the verified badge.
          </p>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {documents.map((document) => (
              <Controller
                key={document.name}
                control={form.control}
                name={document.name}
                render={({ field }) => (
                  <div className="flex items-start gap-3 rounded-lg border border-steel-200 bg-white p-3.5">
                    <Checkbox
                      id={document.name}
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <Label htmlFor={document.name} className="cursor-pointer">
                        {document.label}
                      </Label>
                      <p className="mt-0.5 text-xs text-pretty text-steel-500">
                        {document.hint}
                      </p>
                    </div>
                  </div>
                )}
              />
            ))}
          </div>
        </fieldset>
      </div>
    </StepShell>
  );
}
