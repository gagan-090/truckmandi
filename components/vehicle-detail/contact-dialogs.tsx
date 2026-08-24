"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { submitInquiry } from "@/features/inquiries/api";
import { useInquiries } from "@/features/inquiries/use-inquiries";
import { inquirySchema, offerSchema } from "@/features/inquiries/schemas";
import { track } from "@/lib/analytics/analytics";
import { formatPriceShort } from "@/lib/utils/format-currency";
import type { Vehicle } from "@/types/vehicle";

type Status = "idle" | "submitting" | "done";

/** Message the seller. */
export function MessageDialog({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const { record } = useInquiries();

  const form = useForm<z.input<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      message: `Hi, is the ${vehicle.title} still available? I would like to arrange an inspection.`,
    },
  });

  async function onSubmit(values: z.input<typeof inquirySchema>) {
    setStatus("submitting");
    const parsed = inquirySchema.parse(values);
    const result = await submitInquiry({
      vehicleId: vehicle.id,
      type: "message",
      ...parsed,
    });

    // Keep the buyer's own copy, so it shows up under My enquiries.
    record(
      {
        vehicleId: vehicle.id,
        vehicleSlug: vehicle.slug,
        vehicleTitle: vehicle.title,
        vehicleImage: vehicle.images[0]?.url ?? "",
        type: "message",
        message: parsed.message,
      },
      result.id,
    );

    track({
      name: "seller_contact",
      vehicleId: vehicle.id,
      sellerId: vehicle.seller.id,
    });
    setStatus("done");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setTimeout(() => setStatus("idle"), 200);
      }}
    >
      <DialogContent>
        {status === "done" ? (
          <SuccessPanel
            title="Message sent"
            body={`${vehicle.seller.name} has been notified and usually replies within ${vehicle.seller.responseTimeMinutes ?? 60} minutes. We have also emailed you a copy.`}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold text-steel-900">
                Message the seller
              </DialogTitle>
              <DialogDescription className="text-sm text-steel-600">
                About {vehicle.title} · {formatPriceShort(vehicle.price)}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                id="msg-name"
                label="Your name"
                required
                error={form.formState.errors.name?.message}
              >
                <Input
                  id="msg-name"
                  autoComplete="name"
                  aria-invalid={Boolean(form.formState.errors.name)}
                  aria-describedby={
                    form.formState.errors.name ? "msg-name-error" : undefined
                  }
                  {...form.register("name")}
                />
              </FormField>

              <FormField
                id="msg-phone"
                label="Mobile number"
                required
                hint="Shared with the seller so they can call you back."
                error={form.formState.errors.phone?.message}
              >
                <Input
                  id="msg-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="98765 43210"
                  aria-invalid={Boolean(form.formState.errors.phone)}
                  aria-describedby={
                    form.formState.errors.phone
                      ? "msg-phone-error"
                      : "msg-phone-hint"
                  }
                  {...form.register("phone")}
                />
              </FormField>

              <FormField
                id="msg-body"
                label="Message"
                error={form.formState.errors.message?.message}
              >
                <Textarea
                  id="msg-body"
                  rows={4}
                  {...form.register("message")}
                />
              </FormField>

              <Button
                type="submit"
                block
                size="lg"
                disabled={status === "submitting"}
              >
                {status === "submitting" && (
                  <Loader2 className="animate-spin" />
                )}
                Send message
              </Button>

              <p className="text-center text-xs text-steel-500">
                By sending, you agree to share your name and number with this
                seller.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Make an offer below the asking price. */
export function OfferDialog({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const { record } = useInquiries();
  const schema = offerSchema(vehicle.price);

  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      amount: Math.round(vehicle.price * 0.92),
      message: "",
    },
  });

  async function onSubmit(values: z.input<typeof schema>) {
    setStatus("submitting");
    const parsed = schema.parse(values);
    const result = await submitInquiry({
      vehicleId: vehicle.id,
      type: "offer",
      name: parsed.name,
      phone: parsed.phone,
      message: parsed.message,
      offerAmount: parsed.amount,
    });

    record(
      {
        vehicleId: vehicle.id,
        vehicleSlug: vehicle.slug,
        vehicleTitle: vehicle.title,
        vehicleImage: vehicle.images[0]?.url ?? "",
        type: "offer",
        message: parsed.message,
        offerAmount: parsed.amount,
      },
      result.id,
    );

    track({ name: "make_offer", vehicleId: vehicle.id, amount: parsed.amount });
    setStatus("done");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setTimeout(() => setStatus("idle"), 200);
      }}
    >
      <DialogContent>
        {status === "done" ? (
          <SuccessPanel
            title="Offer sent"
            body={`Your offer has been sent to ${vehicle.seller.name}. You will get an SMS as soon as they accept, decline or counter.`}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl font-bold text-steel-900">
                Make an offer
              </DialogTitle>
              <DialogDescription className="text-sm text-steel-600">
                Asking price {formatPriceShort(vehicle.price)}
                {vehicle.negotiable ? " · Seller is open to negotiation" : ""}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                id="offer-amount"
                label="Your offer (₹)"
                required
                error={form.formState.errors.amount?.message}
              >
                <Input
                  id="offer-amount"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={5000}
                  aria-invalid={Boolean(form.formState.errors.amount)}
                  aria-describedby={
                    form.formState.errors.amount
                      ? "offer-amount-error"
                      : undefined
                  }
                  {...form.register("amount")}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="offer-name"
                  label="Your name"
                  required
                  error={form.formState.errors.name?.message}
                >
                  <Input
                    id="offer-name"
                    autoComplete="name"
                    aria-invalid={Boolean(form.formState.errors.name)}
                    {...form.register("name")}
                  />
                </FormField>

                <FormField
                  id="offer-phone"
                  label="Mobile number"
                  required
                  error={form.formState.errors.phone?.message}
                >
                  <Input
                    id="offer-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="98765 43210"
                    aria-invalid={Boolean(form.formState.errors.phone)}
                    {...form.register("phone")}
                  />
                </FormField>
              </div>

              <FormField
                id="offer-message"
                label="Note to the seller"
                error={form.formState.errors.message?.message}
              >
                <Textarea
                  id="offer-message"
                  rows={3}
                  placeholder="Payment ready, can inspect this week."
                  {...form.register("message")}
                />
              </FormField>

              <Button
                type="submit"
                block
                size="lg"
                variant="accent"
                disabled={status === "submitting"}
              >
                {status === "submitting" && (
                  <Loader2 className="animate-spin" />
                )}
                Send offer
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessPanel({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <div className="py-4 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-trust-50 text-trust-600">
        <CheckCircle2 className="size-7" />
      </div>
      <DialogTitle className="mt-4 font-display text-xl font-bold text-steel-900">
        {title}
      </DialogTitle>
      <DialogDescription className="mx-auto mt-2 max-w-sm text-sm text-pretty text-steel-600">
        {body}
      </DialogDescription>
      <Button onClick={onClose} className="mt-6" block>
        Done
      </Button>
    </div>
  );
}
