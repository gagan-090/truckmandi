"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CategoryIcon } from "@/components/marketplace/category-icon";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brands } from "@/data/brands";
import { vehicleCategories } from "@/data/vehicle-categories";
import { useSellDraft } from "@/features/sell/store";
import {
  vehicleTypeStepSchema,
  type VehicleTypeStep,
} from "@/features/sell/schemas";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";
import { StepShell } from "./step-shell";

export function VehicleTypeStepForm() {
  const router = useRouter();
  const { draft, update, restored } = useSellDraft();

  const form = useForm<VehicleTypeStep>({
    resolver: zodResolver(vehicleTypeStepSchema),
    values: {
      category: draft.category ?? ("" as VehicleTypeStep["category"]),
      brand: draft.brand ?? "",
      model: draft.model ?? "",
      variant: draft.variant ?? "",
    },
  });

  function onSubmit(values: VehicleTypeStep) {
    update(values);
    track({ name: "listing_step_completed", step: "type" });
    router.push(sellSteps[1].href);
  }

  if (!restored) return <StepSkeleton />;

  return (
    <StepShell
      title="What are you selling?"
      description="Start with the category and model. This decides which specifications buyers can filter you by."
      stepIndex={0}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2.5 text-sm font-medium text-steel-800">
            Truck category
            <span aria-hidden className="ml-0.5 text-brand-600">
              *
            </span>
          </legend>

          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {vehicleCategories.map((category) => {
                  const selected = field.value === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => field.onChange(category.id)}
                      aria-pressed={selected}
                      className={cn(
                        "flex min-h-24 flex-col items-start gap-2 rounded-lg border p-3.5 text-left transition-all duration-150",
                        selected
                          ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                          : "border-steel-200 bg-white hover:border-steel-300 hover:bg-steel-50",
                      )}
                    >
                      <CategoryIcon
                        name={category.icon}
                        className={cn(
                          "size-5 shrink-0",
                          selected ? "text-brand-600" : "text-steel-500",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm leading-tight font-semibold",
                          selected ? "text-brand-900" : "text-steel-800",
                        )}
                      >
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />

          {form.formState.errors.category && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {form.formState.errors.category.message}
            </p>
          )}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="brand"
            label="Brand"
            required
            error={form.formState.errors.brand?.message}
          >
            <Controller
              control={form.control}
              name="brand"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.slug} value={brand.slug}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            id="model"
            label="Model"
            required
            hint="As written on the RC, e.g. 407 Gold SFC"
            error={form.formState.errors.model?.message}
          >
            <Input
              id="model"
              placeholder="407 Gold SFC"
              aria-invalid={Boolean(form.formState.errors.model)}
              {...form.register("model")}
            />
          </FormField>

          <FormField
            id="variant"
            label="Variant"
            hint="Optional — trim, body length or configuration"
            error={form.formState.errors.variant?.message}
          >
            <Input
              id="variant"
              placeholder="14 ft open body"
              {...form.register("variant")}
            />
          </FormField>
        </div>
      </div>
    </StepShell>
  );
}

export function StepSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-8 w-64 animate-pulse rounded-md bg-steel-100" />
      <div className="h-4 w-full max-w-lg animate-pulse rounded-md bg-steel-100" />
      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-lg bg-steel-100"
          />
        ))}
      </div>
    </div>
  );
}
