import { z } from "zod";
import {
  MAX_LISTING_IMAGES,
  MIN_LISTING_IMAGES,
  OLDEST_LISTING_YEAR,
  CURRENT_YEAR,
} from "@/config/constants";
import { nameSchema, phoneSchema } from "@/features/inquiries/schemas";
import { SELLER_TYPES } from "@/types/seller";
import {
  BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  VEHICLE_CONDITIONS,
} from "@/types/vehicle";

/**
 * One schema per wizard step, so each step validates independently and a
 * later step never blocks an earlier one. `listingSchema` is the union used
 * on final submit.
 */

export const vehicleTypeStepSchema = z.object({
  category: z.enum(VEHICLE_CATEGORIES, {
    message: "Choose a vehicle category",
  }),
  brand: z.string().min(1, "Choose a brand"),
  model: z
    .string()
    .trim()
    .min(1, "Enter the model, e.g. 407 Gold SFC")
    .max(60, "Model name is too long"),
  variant: z.string().trim().max(60).optional(),
});

export const detailsStepSchema = z
  .object({
    manufacturingYear: z.coerce
      .number()
      .int()
      .min(OLDEST_LISTING_YEAR, `Year must be ${OLDEST_LISTING_YEAR} or later`)
      .max(CURRENT_YEAR, `Year cannot be later than ${CURRENT_YEAR}`),
    registrationYear: z.coerce
      .number()
      .int()
      .min(OLDEST_LISTING_YEAR)
      .max(CURRENT_YEAR)
      .optional(),
    registrationNumber: z
      .string()
      .trim()
      .regex(
        /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{0,3}\s?\d{1,4}$/i,
        "Enter a valid registration number, e.g. DL 1LAB 4472",
      ),
    kilometers: z.coerce
      .number()
      .int()
      .min(0, "Kilometres cannot be negative")
      .max(2_000_000, "Enter a realistic odometer reading"),
    ownershipCount: z.coerce.number().int().min(1).max(10),
    fuelType: z.enum(FUEL_TYPES, { message: "Choose a fuel type" }),
    transmission: z.enum(TRANSMISSIONS).optional(),
    condition: z.enum(VEHICLE_CONDITIONS, {
      message: "Choose the overall condition",
    }),
    bodyType: z.enum(BODY_TYPES).optional(),
    gvwKg: z.coerce.number().int().min(0).max(100_000).optional(),
    payloadKg: z.coerce.number().int().min(0).max(100_000).optional(),
    city: z.string().min(1, "Choose the city where the vehicle is located"),
    highlights: z.string().trim().max(600).optional(),
    description: z
      .string()
      .trim()
      .min(40, "Write at least a couple of sentences buyers can act on")
      .max(2000, "Keep the description under 2000 characters"),
  })
  .refine(
    (data) =>
      data.registrationYear === undefined ||
      data.registrationYear >= data.manufacturingYear,
    {
      message: "Registration year cannot be before the manufacturing year",
      path: ["registrationYear"],
    },
  )
  .refine(
    (data) =>
      data.gvwKg === undefined ||
      data.payloadKg === undefined ||
      data.payloadKg <= data.gvwKg,
    {
      message: "Payload cannot exceed gross vehicle weight",
      path: ["payloadKg"],
    },
  );

export const photosStepSchema = z.object({
  photoCount: z
    .number()
    .min(MIN_LISTING_IMAGES, `Add at least ${MIN_LISTING_IMAGES} photos`)
    .max(MAX_LISTING_IMAGES, `You can add up to ${MAX_LISTING_IMAGES} photos`),
});

export const pricingStepSchema = z.object({
  price: z.coerce
    .number()
    .min(10_000, "Enter a realistic asking price")
    .max(100_000_000, "Price is too high"),
  negotiable: z.boolean(),
  rcAvailable: z.boolean(),
  insuranceValid: z.boolean(),
  fitnessValid: z.boolean(),
  permitValid: z.boolean(),
});

export const sellerStepSchema = z.object({
  sellerName: nameSchema,
  sellerPhone: phoneSchema,
  sellerEmail: z
    .union([z.literal(""), z.email("Enter a valid email address")])
    .optional(),
  sellerType: z.enum(SELLER_TYPES, { message: "Choose how you are selling" }),
  acceptTerms: z.literal(true, {
    message: "You must confirm the details are accurate",
  }),
});

/** Everything the backend needs to create a listing. */
export const listingSchema = vehicleTypeStepSchema
  .and(detailsStepSchema)
  .and(pricingStepSchema)
  .and(sellerStepSchema);

export type VehicleTypeStep = z.input<typeof vehicleTypeStepSchema>;
export type DetailsStep = z.input<typeof detailsStepSchema>;
export type PricingStep = z.input<typeof pricingStepSchema>;
export type SellerStep = z.input<typeof sellerStepSchema>;

export type ListingDraft = Partial<VehicleTypeStep> &
  Partial<DetailsStep> &
  Partial<PricingStep> &
  Partial<SellerStep>;
