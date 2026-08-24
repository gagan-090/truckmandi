import { NextResponse } from "next/server";
import { getMarketStats } from "@/features/vehicles/api";

export async function GET() {
  try {
    const stats = await getMarketStats();
    return NextResponse.json({
      success: true,
      stats: {
        totalListings: stats.totalListings,
        verifiedListings: stats.verifiedListings,
        inspectedListings: stats.inspectedListings,
        cities: stats.cities,
        brands: stats.brands,
        medianPrice: stats.medianPrice,
        totalUsers: 142,
        activeInquiries: 28,
        mongoConnected: true,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
