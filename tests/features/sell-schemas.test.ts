import { describe, expect, it } from "vitest";
import {
  detailsStepSchema,
  pricingStepSchema,
  sellerStepSchema,
  vehicleTypeStepSchema,
} from "@/features/sell/schemas";
import {
  inquirySchema,
  offerSchema,
  phoneSchema,
} from "@/features/inquiries/schemas";

const validDetails = {
  manufacturingYear: 2019,
  registrationNumber: "DL 1LAB 4472",
  kilometers: 84_500,
  ownershipCount: 1,
  fuelType: "diesel",
  condition: "excellent",
  city: "delhi-ncr",
  description:
    "Well maintained single owner vehicle used on the Delhi to Jaipur route with complete service history.",
};

describe("phoneSchema", () => {
  it("accepts Indian mobile numbers in the forms people type", () => {
    for (const input of [
      "9876543210",
      "+919876543210",
      "09876543210",
      "98765 43210",
      "98765-43210",
    ]) {
      expect(phoneSchema.safeParse(input).success).toBe(true);
    }
  });

  it("normalises to a bare number", () => {
    expect(phoneSchema.parse("98765 43210")).toBe("9876543210");
  });

  it("rejects landlines, short numbers and invalid leading digits", () => {
    for (const input of [
      "1234567890",
      "5876543210",
      "987654321",
      "98765432101",
      "abcdefghij",
    ]) {
      expect(phoneSchema.safeParse(input).success).toBe(false);
    }
  });
});

describe("vehicleTypeStepSchema", () => {
  it("accepts a complete selection", () => {
    const result = vehicleTypeStepSchema.safeParse({
      category: "lcv",
      brand: "tata",
      model: "407 Gold SFC",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown category", () => {
    const result = vehicleTypeStepSchema.safeParse({
      category: "spaceship",
      brand: "tata",
      model: "407",
    });
    expect(result.success).toBe(false);
  });

  it("requires a model", () => {
    const result = vehicleTypeStepSchema.safeParse({
      category: "lcv",
      brand: "tata",
      model: "  ",
    });
    expect(result.success).toBe(false);
  });
});

describe("detailsStepSchema", () => {
  it("accepts a well-formed submission", () => {
    expect(detailsStepSchema.safeParse(validDetails).success).toBe(true);
  });

  it("accepts registration numbers with and without spaces", () => {
    for (const value of [
      "DL 1LAB 4472",
      "DL1LAB4472",
      "MH 12 SV 3301",
      "KA51AD2209",
    ]) {
      const result = detailsStepSchema.safeParse({
        ...validDetails,
        registrationNumber: value,
      });
      expect(result.success, value).toBe(true);
    }
  });

  it("rejects a malformed registration number", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      registrationNumber: "NOT-A-PLATE-12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a registration year before the manufacturing year", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      registrationYear: 2017,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["registrationYear"]);
    }
  });

  it("rejects a payload larger than the gross vehicle weight", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      gvwKg: 7500,
      payloadKg: 9000,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["payloadKg"]);
    }
  });

  it("accepts a payload equal to the gross vehicle weight", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      gvwKg: 7500,
      payloadKg: 7500,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a too-short description", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      description: "Good truck",
    });
    expect(result.success).toBe(false);
  });

  it("coerces numeric strings from the form inputs", () => {
    const result = detailsStepSchema.safeParse({
      ...validDetails,
      manufacturingYear: "2019",
      kilometers: "84500",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.manufacturingYear).toBe(2019);
      expect(result.data.kilometers).toBe(84_500);
    }
  });
});

describe("pricingStepSchema", () => {
  const base = {
    negotiable: true,
    rcAvailable: true,
    insuranceValid: true,
    fitnessValid: false,
    permitValid: false,
  };

  it("rejects an unrealistically low price", () => {
    expect(pricingStepSchema.safeParse({ ...base, price: 500 }).success).toBe(
      false,
    );
  });

  it("accepts a realistic price", () => {
    expect(
      pricingStepSchema.safeParse({ ...base, price: 985_000 }).success,
    ).toBe(true);
  });
});

describe("sellerStepSchema", () => {
  const base = {
    sellerName: "Harpreet Singh",
    sellerPhone: "9876543210",
    sellerType: "individual",
  };

  it("requires the confirmation checkbox", () => {
    expect(
      sellerStepSchema.safeParse({ ...base, acceptTerms: false }).success,
    ).toBe(false);
    expect(
      sellerStepSchema.safeParse({ ...base, acceptTerms: true }).success,
    ).toBe(true);
  });

  it("treats an empty email as absent but rejects a malformed one", () => {
    expect(
      sellerStepSchema.safeParse({
        ...base,
        acceptTerms: true,
        sellerEmail: "",
      }).success,
    ).toBe(true);
    expect(
      sellerStepSchema.safeParse({
        ...base,
        acceptTerms: true,
        sellerEmail: "nope",
      }).success,
    ).toBe(false);
  });
});

describe("inquirySchema", () => {
  it("requires a name and a valid phone number", () => {
    expect(
      inquirySchema.safeParse({ name: "A", phone: "9876543210" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ name: "Anil Yadav", phone: "9876543210" })
        .success,
    ).toBe(true);
  });
});

describe("offerSchema", () => {
  const schema = offerSchema(1_000_000);
  const base = { name: "Anil Yadav", phone: "9876543210" };

  it("rejects an offer above the asking price", () => {
    expect(schema.safeParse({ ...base, amount: 1_200_000 }).success).toBe(
      false,
    );
  });

  it("rejects an offer below 40% of the asking price", () => {
    expect(schema.safeParse({ ...base, amount: 300_000 }).success).toBe(false);
  });

  it("accepts a sensible offer", () => {
    expect(schema.safeParse({ ...base, amount: 920_000 }).success).toBe(true);
    expect(schema.safeParse({ ...base, amount: 400_000 }).success).toBe(true);
  });
});
