import { z } from "zod";

/** Indian mobile numbers, with or without +91 / 0 prefixes. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^(?:\+91|0)?[6-9]\d{9}$/.test(value), {
    message: "Enter a valid 10-digit Indian mobile number",
  });

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Enter your name")
  .max(60, "Name is too long");

export const inquirySchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  message: z
    .string()
    .trim()
    .max(500, "Keep your message under 500 characters")
    .optional(),
});

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryPayload = z.output<typeof inquirySchema>;

export function offerSchema(askingPrice: number) {
  // Below 40% of asking is almost always a typo or a time-waster.
  const floor = Math.round(askingPrice * 0.4);

  return z.object({
    name: nameSchema,
    phone: phoneSchema,
    amount: z.coerce
      .number()
      .min(
        floor,
        `Offers below ₹${floor.toLocaleString("en-IN")} are not accepted`,
      )
      .max(askingPrice, "Your offer cannot exceed the asking price"),
    message: z.string().trim().max(500).optional(),
  });
}

export type OfferInput = z.input<ReturnType<typeof offerSchema>>;
export type OfferPayload = z.output<ReturnType<typeof offerSchema>>;
