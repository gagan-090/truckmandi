"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions } from "@/data/locations";
import {
  bodyTypeOptions,
  conditionOptions,
  fuelTypeOptions,
  transmissionOptions,
} from "@/data/vehicle-types";
import { CURRENT_YEAR, OLDEST_LISTING_YEAR } from "@/config/constants";
import { useSellDraft } from "@/features/sell/store";
import { detailsStepSchema, type DetailsStep } from "@/features/sell/schemas";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import { StepShell } from "./step-shell";
import { StepSkeleton } from "./vehicle-type-selector";

const NONE = "none";

export function VehicleDetailsStepForm() {
  const router = useRouter();
  const { draft, update, restored } = useSellDraft();

  const form = useForm<DetailsStep>({
    resolver: zodResolver(detailsStepSchema),
    values: {
      manufacturingYear: draft.manufacturingYear ?? ("" as unknown as number),
      registrationYear: draft.registrationYear,
      registrationNumber: draft.registrationNumber ?? "",
      kilometers: draft.kilometers ?? ("" as unknown as number),
      ownershipCount: draft.ownershipCount ?? 1,
      fuelType: draft.fuelType ?? "diesel",
      transmission: draft.transmission,
      condition: draft.condition ?? ("" as DetailsStep["condition"]),
      bodyType: draft.bodyType,
      gvwKg: draft.gvwKg,
      payloadKg: draft.payloadKg,
      city: draft.city ?? "",
      highlights: draft.highlights ?? "",
      description: draft.description ?? "",
    },
  });

  function onSubmit(values: DetailsStep) {
    update(values);
    track({ name: "listing_step_completed", step: "details" });
    router.push(sellSteps[2].href);
  }

  if (!restored) return <StepSkeleton />;

  const errors = form.formState.errors;

  return (
    <StepShell
      title="Vehicle details & condition"
      description="Accurate numbers get better enquiries. Buyers filter on year, kilometres, ownership and load capacity."
      stepIndex={1}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-8">
        <Fieldset legend="Registration">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              id="manufacturingYear"
              label="Manufacturing year"
              required
              error={errors.manufacturingYear?.message}
            >
              <Input
                id="manufacturingYear"
                type="number"
                inputMode="numeric"
                min={OLDEST_LISTING_YEAR}
                max={CURRENT_YEAR}
                placeholder="2019"
                aria-invalid={Boolean(errors.manufacturingYear)}
                {...form.register("manufacturingYear")}
              />
            </FormField>

            <FormField
              id="registrationYear"
              label="Registration year"
              hint="If different from manufacturing"
              error={errors.registrationYear?.message}
            >
              <Input
                id="registrationYear"
                type="number"
                inputMode="numeric"
                min={OLDEST_LISTING_YEAR}
                max={CURRENT_YEAR}
                placeholder="2019"
                aria-invalid={Boolean(errors.registrationYear)}
                {...form.register("registrationYear")}
              />
            </FormField>

            <FormField
              id="registrationNumber"
              label="Registration number"
              required
              hint="Only the RTO code is shown publicly"
              error={errors.registrationNumber?.message}
            >
              <Input
                id="registrationNumber"
                placeholder="DL 1LAB 4472"
                autoCapitalize="characters"
                aria-invalid={Boolean(errors.registrationNumber)}
                {...form.register("registrationNumber")}
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Usage & condition">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              id="kilometers"
              label="Kilometres driven"
              required
              error={errors.kilometers?.message}
            >
              <Input
                id="kilometers"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="84500"
                aria-invalid={Boolean(errors.kilometers)}
                {...form.register("kilometers")}
              />
            </FormField>

            <FormField
              id="ownershipCount"
              label="Number of owners"
              required
              error={errors.ownershipCount?.message}
            >
              <Input
                id="ownershipCount"
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                aria-invalid={Boolean(errors.ownershipCount)}
                {...form.register("ownershipCount")}
              />
            </FormField>

            <FormField
              id="condition"
              label="Overall condition"
              required
              error={errors.condition?.message}
            >
              <Controller
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              id="fuelType"
              label="Fuel type"
              required
              error={errors.fuelType?.message}
            >
              <Controller
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              id="transmission"
              label="Transmission"
              error={errors.transmission?.message}
            >
              <Controller
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <Select
                    value={field.value ?? NONE}
                    onValueChange={(value) =>
                      field.onChange(value === NONE ? undefined : value)
                    }
                  >
                    <SelectTrigger id="transmission">
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Not applicable</SelectItem>
                      {transmissionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              id="city"
              label="City"
              required
              hint="Where the vehicle can be inspected"
              error={errors.city?.message}
            >
              <Controller
                control={form.control}
                name="city"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.slug} value={region.slug}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Load capacity">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              id="gvwKg"
              label="Gross vehicle weight (kg)"
              error={errors.gvwKg?.message}
            >
              <Input
                id="gvwKg"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="7500"
                aria-invalid={Boolean(errors.gvwKg)}
                {...form.register("gvwKg")}
              />
            </FormField>

            <FormField
              id="payloadKg"
              label="Payload capacity (kg)"
              error={errors.payloadKg?.message}
            >
              <Input
                id="payloadKg"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="4400"
                aria-invalid={Boolean(errors.payloadKg)}
                {...form.register("payloadKg")}
              />
            </FormField>

            <FormField
              id="bodyType"
              label="Body type"
              error={errors.bodyType?.message}
            >
              <Controller
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <Select
                    value={field.value ?? NONE}
                    onValueChange={(value) =>
                      field.onChange(value === NONE ? undefined : value)
                    }
                  >
                    <SelectTrigger id="bodyType">
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Not specified</SelectItem>
                      {bodyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </Fieldset>

        <Fieldset legend="Describe the vehicle">
          <div className="space-y-5">
            <FormField
              id="highlights"
              label="Key highlights"
              hint="One per line. These appear as a checklist on your listing."
              error={errors.highlights?.message}
            >
              <Textarea
                id="highlights"
                rows={4}
                placeholder={
                  "Single owner since new\nNew tyres fitted last month\nComplete service history available"
                }
                {...form.register("highlights")}
              />
            </FormField>

            <FormField
              id="description"
              label="Description"
              required
              hint="What it has been used for, what has been replaced, and anything that needs attention. Honest listings sell faster."
              error={errors.description?.message}
            >
              <Textarea
                id="description"
                rows={6}
                aria-invalid={Boolean(errors.description)}
                {...form.register("description")}
              />
            </FormField>
          </div>
        </Fieldset>
      </div>
    </StepShell>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3.5 text-xs font-bold tracking-[0.1em] text-steel-500 uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
