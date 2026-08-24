import "server-only";
import {
  FEATURED_VEHICLES_COUNT,
  SIMILAR_VEHICLES_COUNT,
} from "@/config/constants";
import { mockVehicles } from "@/data/mock-vehicles";
import { cacheTags, endpoints } from "@/lib/api/endpoints";
import { serverFetch } from "@/lib/api/server";
import type { Paginated } from "@/types/common";
import type { SearchFacets, SearchQuery } from "@/types/search";
import type { Vehicle, VehicleSummary } from "@/types/vehicle";
import { applyFilters, buildFacets, sortVehicles } from "./filtering";
import { mapApiItemToVehicle } from "./mapper";
import { toVehicleSummary } from "./utils";

let cacheVehiclesPool: Vehicle[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 600_000;

/**
 * Fetches all vehicles from real Laravel MongoDB backend API.
 * Falls back to mockVehicles if API is unreachable.
 */
async function fetchAllVehiclesFromBackend(): Promise<Vehicle[]> {
  const now = Date.now();
  if (cacheVehiclesPool && now - lastCacheTime < CACHE_TTL_MS) {
    return cacheVehiclesPool;
  }

  try {
    const [newRes, usedRes] = await Promise.allSettled([
      serverFetch<{ success: boolean; data: any[] }>(
        endpoints.newTrucks.products,
        {
          revalidate: 0,
        },
      ),
      serverFetch<{ success: boolean; data: any[] }>(
        endpoints.usedTrucks.products,
        {
          revalidate: 0,
        },
      ),
    ]);

    const vehicles: Vehicle[] = [];

    if (newRes.status === "fulfilled" && newRes.value?.success && Array.isArray(newRes.value.data)) {
      newRes.value.data.forEach((item) => {
        vehicles.push(mapApiItemToVehicle(item, false));
      });
    }

    if (usedRes.status === "fulfilled" && usedRes.value?.success && Array.isArray(usedRes.value.data)) {
      usedRes.value.data.forEach((item) => {
        vehicles.push(mapApiItemToVehicle(item, true));
      });
    }

    if (vehicles.length > 0) {
      cacheVehiclesPool = vehicles;
      lastCacheTime = now;
      return vehicles;
    }
  } catch (err) {
    console.error("Failed to fetch real vehicles from backend, using fallback pool", err);
  }

  return mockVehicles.filter((v) => v.status !== "draft");
}

export interface VehicleSearchResult {
  page: Paginated<VehicleSummary>;
  facets: SearchFacets;
}

export async function searchVehicles(
  query: SearchQuery,
): Promise<VehicleSearchResult> {
  const pool = await fetchAllVehiclesFromBackend();
  const matched = applyFilters(pool, query);
  const sorted = sortVehicles(matched, query.sort, query.q);

  const start = (query.page - 1) * query.pageSize;
  const items = sorted
    .slice(start, start + query.pageSize)
    .map(toVehicleSummary);

  return {
    page: {
      items,
      page: query.page,
      pageSize: query.pageSize,
      total: sorted.length,
      totalPages: Math.max(1, Math.ceil(sorted.length / query.pageSize)),
    },
    facets: buildFacets(pool, query),
  };
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const pool = await fetchAllVehiclesFromBackend();
  const matched = pool.find(
    (v) => v.slug === slug || v.id === slug || slug.endsWith(v.id),
  );
  if (matched) return matched;

  try {
    const detailRes = await serverFetch<{ success: boolean; data: any }>(
      endpoints.newTrucks.detail(slug),
      {
        revalidate: 300,
        tags: [cacheTags.vehicle(slug)],
      },
    );
    if (detailRes?.success && detailRes.data) {
      return mapApiItemToVehicle(detailRes.data);
    }
  } catch {
    // Try used truck detail endpoint or search pool
  }

  try {
    const usedRes = await serverFetch<{ success: boolean; data: any }>(
      endpoints.usedTrucks.detail(slug),
      {
        revalidate: 300,
        tags: [cacheTags.vehicle(slug)],
      },
    );
    if (usedRes?.success && usedRes.data) {
      return mapApiItemToVehicle(usedRes.data, true);
    }
  } catch {
    // Fallback
  }

  return null;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const pool = await fetchAllVehiclesFromBackend();
  return pool.find((vehicle) => vehicle.id === id) ?? null;
}

export async function getFeaturedVehicles(
  limit = FEATURED_VEHICLES_COUNT,
): Promise<VehicleSummary[]> {
  const pool = await fetchAllVehiclesFromBackend();
  const featured = pool.filter((vehicle) => vehicle.featured);
  const rest = pool.filter((vehicle) => !vehicle.featured);

  return [...featured, ...rest].slice(0, limit).map(toVehicleSummary);
}

export async function getRecentVehicles(limit = 8): Promise<VehicleSummary[]> {
  const pool = await fetchAllVehiclesFromBackend();
  return [...pool]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(toVehicleSummary);
}

export async function getSimilarVehicles(
  vehicle: Vehicle,
  limit = SIMILAR_VEHICLES_COUNT,
): Promise<VehicleSummary[]> {
  const pool = await fetchAllVehiclesFromBackend();
  const scored = pool
    .filter((candidate) => candidate.id !== vehicle.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category.id === vehicle.category.id) score += 5;
      if (candidate.brand.slug === vehicle.brand.slug) score += 3;
      if (candidate.location.regionSlug === vehicle.location.regionSlug) {
        score += 2;
      }
      const priceGap =
        Math.abs(candidate.price - vehicle.price) / (vehicle.price || 1);
      if (priceGap <= 0.25) score += 3;
      else if (priceGap <= 0.5) score += 1;
      if (
        Math.abs(candidate.manufacturingYear - vehicle.manufacturingYear) <= 2
      ) {
        score += 1;
      }
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.price - b.candidate.price);

  return scored
    .slice(0, limit)
    .map((entry) => toVehicleSummary(entry.candidate));
}

export async function getVehiclesBySeller(
  sellerSlug: string,
  limit?: number,
): Promise<VehicleSummary[]> {
  const pool = await fetchAllVehiclesFromBackend();
  const matches = pool.filter(
    (vehicle) => vehicle.seller.slug === sellerSlug,
  );
  return (limit ? matches.slice(0, limit) : matches).map(toVehicleSummary);
}

export async function getAllVehicleSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  const pool = await fetchAllVehiclesFromBackend();
  return pool.slice(0, 50).map((vehicle) => ({
    slug: vehicle.slug,
    updatedAt: vehicle.updatedAt,
  }));
}

export async function getVehiclesByIds(ids: string[]): Promise<Vehicle[]> {
  const pool = await fetchAllVehiclesFromBackend();
  const wanted = new Set(ids);
  const found = pool.filter((vehicle) => wanted.has(vehicle.id));
  return ids
    .map((id) => found.find((vehicle) => vehicle.id === id))
    .filter((vehicle): vehicle is Vehicle => Boolean(vehicle));
}

export async function getMarketStats() {
  const pool = await fetchAllVehiclesFromBackend();
  const prices = pool.map((vehicle) => vehicle.price).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)] ?? 0;

  return {
    totalListings: pool.length,
    verifiedListings: pool.filter((v) => v.verification.isVerified).length,
    inspectedListings: pool.filter((v) => v.verification.inspected).length,
    cities: new Set(pool.map((v) => v.location.regionSlug)).size,
    brands: new Set(pool.map((v) => v.brand.slug)).size,
    medianPrice: median,
  };
}
