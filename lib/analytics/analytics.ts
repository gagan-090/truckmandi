/**
 * Analytics façade. Components call `track(...)`; which provider receives
 * the event is decided here and nowhere else.
 */

export type AnalyticsEvent =
  | { name: "vehicle_view"; vehicleId: string; category: string; price: number }
  | { name: "vehicle_search"; query?: string; filters: number; results: number }
  | { name: "vehicle_favorite"; vehicleId: string; added: boolean }
  | {
      name: "vehicle_compare";
      vehicleId: string;
      added: boolean;
      total: number;
    }
  | { name: "compare_view"; vehicleIds: string[] }
  | { name: "seller_contact"; vehicleId: string; sellerId: string }
  | { name: "seller_call"; vehicleId: string; sellerId: string }
  | { name: "seller_chat"; vehicleId: string; sellerId: string }
  | { name: "make_offer"; vehicleId: string; amount: number }
  | { name: "listing_started"; category?: string }
  | { name: "listing_step_completed"; step: string }
  | { name: "listing_completed"; category: string; price: number }
  | { name: "finance_calculated"; amount: number; tenureMonths: number }
  | { name: "filter_applied"; filter: string; value: string };

type Payload = Record<string, unknown>;

interface AnalyticsProvider {
  track(name: string, payload: Payload): void;
}

/** Development sink. Keeps the event contract visible while building. */
const consoleProvider: AnalyticsProvider = {
  track(name, payload) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[analytics] ${name}`, payload);
    }
  },
};

/**
 * Production sink. Swap the body for GA4, Segment, PostHog or a first-party
 * collector — no calling code changes.
 */
const remoteProvider: AnalyticsProvider = {
  track(name, payload) {
    const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;
    if (!id || typeof window === "undefined") return;

    const queue = ((
      window as unknown as { dataLayer?: unknown[] }
    ).dataLayer ??= []);
    queue.push({ event: name, ...payload });
  },
};

const providers: AnalyticsProvider[] =
  process.env.NODE_ENV === "production" ? [remoteProvider] : [consoleProvider];

export function track(event: AnalyticsEvent): void {
  const { name, ...payload } = event;
  for (const provider of providers) {
    try {
      provider.track(name, payload as Payload);
    } catch {
      // Analytics must never break a user flow.
    }
  }
}
