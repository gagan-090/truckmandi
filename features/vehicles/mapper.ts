import {
  FUEL_TYPES,
  VEHICLE_CATEGORIES,
  type FuelType,
  type Vehicle,
  type VehicleCategoryId,
  type VehicleImage,
} from "@/types/vehicle";
import { resolveVehicleGallery } from "./image-resolver";

export function mapApiItemToVehicle(item: any, isUsed = false): Vehicle {
  const itemId = String(item.id || item._id || "");
  const brandName = item.brand?.name || "Truck";
  const modelName = item.name || item.model_name || "Commercial Vehicle";
  const title = item.title || `${brandName} ${modelName}`.trim();
  const brandSlug = item.brand?.slug || brandName.toLowerCase().replace(/\s+/g, "-");

  // Ensure unique slug per vehicle item to fix "clicks on cards open only one screen" bug
  const baseSlug = (item.slug || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const slug = itemId && !baseSlug.endsWith(itemId) ? `${baseSlug}-${itemId}` : baseSlug;

  // Category mapping
  const catSlug = (
    item.category?.slug ||
    item.model?.category?.slug ||
    "trucks"
  ).toLowerCase();
  const categoryId: VehicleCategoryId = VEHICLE_CATEGORIES.includes(
    catSlug as any,
  )
    ? (catSlug as VehicleCategoryId)
    : "trucks";

  // Fuel type mapping
  const rawFuel = (
    item.fueltype?.slug ||
    item.fuel_type?.slug ||
    item.model?.fueltype?.slug ||
    "diesel"
  ).toLowerCase();
  const fuelType: FuelType = FUEL_TYPES.includes(rawFuel as any)
    ? (rawFuel as FuelType)
    : "diesel";

  // Price
  const price = item.price || item.min_price || item.max_price || 500000;

  // Images: Generate 4 distinct clean unwatermarked high-res photos from public/images/Trucks
  const galleryUrls = resolveVehicleGallery(title, brandSlug, 4);
  const images: VehicleImage[] = galleryUrls.map((url, i) => ({
    url,
    alt: `${title} photo ${i + 1}`,
    width: 800,
    height: 600,
  }));

  // Location
  const stateName = item.state?.name || "Maharashtra";
  const districtName = item.district?.name || "Mumbai";

  // Specs
  const gvwKg = item.max_gvw ? parseInt(String(item.max_gvw)) : 3500;
  const payloadKg = item.payload ? parseInt(String(item.payload)) : 1500;
  const engineCapacityCc = item.engine_capacity
    ? parseInt(String(item.engine_capacity))
    : undefined;

  return {
    id: itemId,
    slug,
    title,
    category: {
      id: categoryId,
      name: item.category?.name || item.model?.category?.name || "Trucks",
      slug: catSlug,
      description: `${item.category?.name || "Commercial"} vehicles for transport and logistics`,
      icon: "Truck",
    },
    brand: {
      id: item.brand?.id || item.brand?.slug || "brand",
      name: brandName,
      slug: brandSlug,
      origin: "India",
      popular: true,
    },
    model: modelName,
    variant: item.varient_name || item.variant || undefined,
    manufacturingYear: item.purchase_year
      ? parseInt(String(item.purchase_year))
      : 2023,
    registrationYear: item.purchase_year
      ? parseInt(String(item.purchase_year))
      : 2023,
    registrationNumber: item.reg_number || undefined,
    price,
    negotiable: true,
    fuelType,
    transmission: "manual",
    kilometers: item.kilometers || (isUsed ? 45000 : 0),
    ownershipCount: isUsed ? 1 : 0,
    condition: "excellent",
    specifications: {
      gvwKg,
      payloadKg,
      engineCapacityCc,
      maxPowerBhp: item.max_power ? parseInt(String(item.max_power)) : undefined,
      maxTorqueNm: item.max_torque ? parseInt(String(item.max_torque)) : undefined,
      tyreCount: item.number_of_tyres ? parseInt(String(item.number_of_tyres)) : 6,
      bodyType: "open-body",
      axleConfiguration: "4x2",
      emissionNorm: (item.emission_norms as any) || "BS6",
      tankCapacityLitres: item.fuel_tank_capacity
        ? parseInt(String(item.fuel_tank_capacity))
        : undefined,
    },
    highlights: [
      item.engine ? `Engine: ${item.engine}` : null,
      gvwKg ? `GVW: ${gvwKg} kg` : null,
      payloadKg ? `Payload: ${payloadKg} kg` : null,
      item.mileage ? `Mileage: ${item.mileage}` : null,
    ].filter((h): h is string => Boolean(h)),
    description:
      item.overview ||
      `${title} - High efficiency commercial vehicle with strong build quality and reliability.`,
    location: {
      city: districtName,
      citySlug: districtName.toLowerCase().replace(/\s+/g, "-"),
      state: stateName,
      region: stateName,
      regionSlug: stateName.toLowerCase().replace(/\s+/g, "-"),
    },
    images,
    seller: {
      id: item.user?.id || "truckmandi-seller",
      name: item.user?.name || item.name || "TruckMandi Verified Dealership",
      type: "dealer",
      slug: "truckmandi-dealer",
      verified: true,
      location: {
        city: districtName,
        citySlug: districtName.toLowerCase().replace(/\s+/g, "-"),
        state: stateName,
        region: stateName,
        regionSlug: stateName.toLowerCase().replace(/\s+/g, "-"),
      },
      memberSince: "2023",
      totalListings: 12,
    },
    verification: {
      isVerified: true,
      rcAvailable: item.rc_status === "YES" || true,
      insuranceValid: true,
      fitnessValid: true,
      permitValid: true,
      inspected: true,
      inspectionScore: 92,
    },
    status: "available",
    featured: Boolean(item.is_popular || item.featured || isUsed),
    viewCount: 240,
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  };
}
