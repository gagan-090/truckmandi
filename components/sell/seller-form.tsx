"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sellerTypeOptions } from "@/data/vehicle-types";
import { useSellDraft } from "@/features/sell/store";
import { sellerStepSchema, type SellerStep } from "@/features/sell/schemas";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";
import { StepShell } from "./step-shell";
import { StepSkeleton } from "./vehicle-type-selector";

export function SellerStepForm() {
  const router = useRouter();
  const { draft, update, restored } = useSellDraft();

  const form = useForm<SellerStep>({
    resolver: zodResolver(sellerStepSchema),
    values: {
      sellerName: draft.sellerName ?? "",
      sellerPhone: draft.sellerPhone ?? "",
      sellerEmail: draft.sellerEmail ?? "",
      sellerType: draft.sellerType ?? "individual",
      acceptTerms: draft.acceptTerms ?? (false as unknown as true),
    },
  });

  function onSubmit(values: SellerStep) {
    update(values);
    track({ name: "listing_step_completed", step: "seller" });
    router.push(sellSteps[5].href);
  }

  if (!restored) return <StepSkeleton />;

  const errors = form.formState.errors;

  return (
    <StepShell
      title="Your details"
      description="Buyers contact you directly. Your number is only shown after a buyer identifies themselves."
      stepIndex={4}
      onSubmit={form.handleSubmit(onSubmit)}
      nextLabel="Preview listing"
    >
      <div className="space-y-8">
        <fieldset>
          <legend className="mb-2.5 text-sm font-medium text-steel-800">
            How are you selling?
            <span aria-hidden className="ml-0.5 text-brand-600">
              *
            </span>
          </legend>

          <Controller
            control={form.control}
            name="sellerType"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-2.5 sm:grid-cols-3"
              >
                {sellerTypeOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all duration-150",
                      field.value === option.value
                        ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600"
                        : "border-steel-200 bg-white hover:border-steel-300",
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`type-${option.value}`}
                    />
                    <span className="text-sm font-semibold text-steel-800">
                      {option.label}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />

          {errors.sellerType && (
            <p role="alert" className="mt-2 text-xs font-medium text-red-600">
              {errors.sellerType.message}
            </p>
          )}
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="sellerName"
            label="Your name"
            required
            error={errors.sellerName?.message}
          >
            <Input
              id="sellerName"
              autoComplete="name"
              aria-invalid={Boolean(errors.sellerName)}
              {...form.register("sellerName")}
            />
          </FormField>

          <FormField
            id="sellerPhone"
            label="Mobile number"
            required
            hint="Revealed to buyers only when they contact you"
            error={errors.sellerPhone?.message}
          >
            <Input
              id="sellerPhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="98765 43210"
              aria-invalid={Boolean(errors.sellerPhone)}
              {...form.register("sellerPhone")}
            />
          </FormField>

          <FormField
            id="sellerEmail"
            label="Email"
            hint="Optional — for enquiry notifications"
            error={errors.sellerEmail?.message}
          >
            <Input
              id="sellerEmail"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.sellerEmail)}
              {...form.register("sellerEmail")}
            />
          </FormField>
        </div>

        <Controller
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <div>
              <div className="flex items-start gap-3 rounded-lg border border-steel-200 bg-steel-50 p-4">
                <Checkbox
                  id="acceptTerms"
                  checked={field.value === true}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="acceptTerms"
                  className="cursor-pointer font-normal"
                >
                  I confirm the details are accurate, the vehicle is mine to
                  sell, and I accept the{" "}
                  <a
                    href="/terms"
                    className="font-semibold text-brand-700 underline"
                  >
                    terms of use
                  </a>
                  .
                </Label>
              </div>
              {errors.acceptTerms && (
                <p
                  role="alert"
                  className="mt-2 text-xs font-medium text-red-600"
                >
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </StepShell>
  );
}
