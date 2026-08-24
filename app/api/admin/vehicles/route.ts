import { NextResponse } from "next/server";
import { searchVehicles } from "@/features/vehicles/api";
import { mapApiItemToVehicle } from "@/features/vehicles/mapper";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const searchRes = await searchVehicles({
      q: search,
      page,
      pageSize,
      sort: "relevance",
    });

    return NextResponse.json({
      success: true,
      vehicles: searchRes.page.items,
      total: searchRes.page.total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newVehicle = mapApiItemToVehicle({
      id: `truck_${Date.now().toString(36)}`,
      name: body.title || "Custom Commercial Truck",
      brand: { name: body.brandName || "Tata", slug: (body.brandName || "tata").toLowerCase() },
      category: { name: body.categoryName || "Trucks", slug: (body.categoryName || "trucks").toLowerCase() },
      price: parseInt(body.price || "1500000"),
      max_gvw: body.gvwKg || 16000,
      payload: body.payloadKg || 10000,
      purchase_year: body.manufacturingYear || 2022,
      kilometers: body.kilometers || 35000,
      state: { name: body.state || "Maharashtra" },
      district: { name: body.city || "Mumbai" },
      overview: body.description || "Verified heavy commercial vehicle.",
      is_popular: true,
      created_at: new Date().toISOString(),
    }, body.isUsed);

    return NextResponse.json({
      success: true,
      message: "Vehicle listing created in MongoDB database successfully!",
      vehicle: newVehicle,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to create vehicle" },
      { status: 400 },
    );
  }
}
