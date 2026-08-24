import { NextResponse } from "next/server";
import { getVehiclesByIds } from "@/features/vehicles/api";
import { toVehicleSummary } from "@/features/vehicles/utils";

/** Hard cap, so a crafted URL cannot ask us to resolve the whole catalogue. */
const MAX_IDS = 60;

/**
 * Resolves a list of vehicle ids to card-sized summaries.
 *
 * Saved vehicles and comparisons live in the browser as bare ids, so the
 * client needs a way to turn them into listings. Looking them up by id
 * matters: the saved page used to filter a single 48-item page of results,
 * which silently dropped anything outside it.
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("ids") ?? "";

  const ids = Array.from(
    new Set(
      raw
        .split(",")
        .map((id) => id.trim())
        .filter((id) => /^[A-Za-z0-9_-]{1,64}$/.test(id)),
    ),
  ).slice(0, MAX_IDS);

  if (ids.length === 0) {
    return NextResponse.json(
      { vehicles: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const vehicles = await getVehiclesByIds(ids);

  return NextResponse.json(
    { vehicles: vehicles.map(toVehicleSummary) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
