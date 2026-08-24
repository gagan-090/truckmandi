import { LOCAL_STORAGE_KEYS } from "@/config/constants";

/**
 * Per-account namespacing for browser-stored data.
 *
 * Saved vehicles, comparisons, enquiries and the sell draft used to live
 * under one global key each, so everything one account saved was still
 * there for the next account signed in on the same browser. Every key is
 * now scoped: `truckmitr:favorites:u:<userId>` when signed in, and
 * `truckmitr:favorites:guest` while signed out.
 *
 * This is browser-local by nature. Signing in on a different device shows
 * nothing until the backend owns this data — see `features/favorites`.
 */
export function scopedKey(baseKey: string, userId: string | null): string {
  return userId ? `${baseKey}:u:${userId}` : `${baseKey}:guest`;
}

/** Every key that holds account-specific data. */
const SCOPED_KEYS = [
  LOCAL_STORAGE_KEYS.favorites,
  LOCAL_STORAGE_KEYS.compare,
  LOCAL_STORAGE_KEYS.inquiries,
  LOCAL_STORAGE_KEYS.sellDraft,
] as const;

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private mode — best effort.
  }
}

function drop(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

/**
 * Moves anything saved while signed out into the account that just signed
 * in, then clears the guest bucket so it cannot follow the next person.
 *
 * Arrays are merged (guest entries first, de-duplicated); the sell draft is
 * only adopted when the account does not already have one.
 */
export function adoptGuestData(userId: string): void {
  if (typeof window === "undefined") return;

  for (const baseKey of SCOPED_KEYS) {
    const guestKey = scopedKey(baseKey, null);
    const guestValue = read(guestKey);
    if (guestValue === null) continue;

    const userKey = scopedKey(baseKey, userId);
    const userValue = read(userKey);

    if (Array.isArray(guestValue)) {
      const existing = Array.isArray(userValue) ? userValue : [];
      write(userKey, mergeById([...guestValue, ...existing]));
    } else if (userValue === null) {
      write(userKey, guestValue);
    }

    drop(guestKey);
  }

  notifyStorageChanged();
}

/** Wipes the signed-out bucket, so the next visitor starts clean. */
export function clearGuestData(): void {
  if (typeof window === "undefined") return;

  for (const baseKey of SCOPED_KEYS) {
    drop(scopedKey(baseKey, null));
  }

  notifyStorageChanged();
}

/** De-duplicates by `id` for object lists, or by value for id arrays. */
function mergeById(items: unknown[]): unknown[] {
  const seen = new Set<string>();
  const merged: unknown[] = [];

  for (const item of items) {
    const key =
      typeof item === "string"
        ? item
        : item && typeof item === "object" && "id" in item
          ? String((item as { id: unknown }).id)
          : JSON.stringify(item);

    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged;
}

/** Matches the event `useLocalStorage` listens for. */
function notifyStorageChanged(): void {
  window.dispatchEvent(new Event("truckmitr:storage"));
}
