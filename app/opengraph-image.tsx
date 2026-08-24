import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card. Pages that have their own imagery (listings, dealer
 * profiles) override this through `buildMetadata`.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0e141b",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#de4b12",
            borderRadius: 16,
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          TM
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ color: "#ffffff", fontSize: 34, fontWeight: 800 }}>
            Truck
            <span style={{ color: "#fb8047" }}>Mitr</span>
          </span>
          <span
            style={{
              color: "#98a4b4",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
            }}
          >
            EXCHANGE
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          The modern Indian marketplace for commercial vehicles
        </div>
        <div style={{ color: "#98a4b4", fontSize: 28, marginTop: 24 }}>
          Trucks · Pickups · Tippers · Tankers · Buses · Trailers
        </div>
      </div>

      <div style={{ display: "flex", gap: 40 }}>
        {["Verified sellers", "Inspected vehicles", "Documents checked"].map(
          (item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#c4cdd8",
                fontSize: 22,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#3cc17e",
                }}
              />
              {item}
            </div>
          ),
        )}
      </div>
    </div>,
    size,
  );
}
