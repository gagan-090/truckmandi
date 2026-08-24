import { NextResponse } from "next/server";

/**
 * Liveness probe for load balancers and uptime monitoring.
 * Deliberately does no I/O — it answers "is this process serving?", not
 * "is the backend healthy?".
 */
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "truckmitr-exchange-web",
      timestamp: new Date().toISOString(),
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
