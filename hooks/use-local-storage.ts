"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * localStorage-backed state that stays consistent across tabs and across
 * every component reading the same key in one tab.
 *
 * Built on `useSyncExternalStore` rather than an effect, so React reads the
 * stored value as part of the same commit that hydrates — no cascading
 * render, and no flash of the default value. The server snapshot is always
 * the fallback, which keeps server and client markup identical.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const handler = (event: Event) => {
        if (event instanceof StorageEvent && event.key !== key) return;
        invalidate(key);
        onChange();
      };

      window.addEventListener("storage", handler);
      window.addEventListener(STORAGE_EVENT, handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(STORAGE_EVENT, handler);
      };
    },
    [key],
  );

  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );

  const value = useMemo(() => parse(raw, initialValue), [raw, initialValue]);

  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      const current = parse(readRaw(key), initialValue);
      const resolved =
        typeof next === "function" ? (next as (c: T) => T)(current) : next;
      writeStorage(key, resolved);
    },
    [key, initialValue],
  );

  return { value, setValue, hydrated: raw !== null || isHydrated() } as const;
}

const STORAGE_EVENT = "truckmitr:storage";

/**
 * `getSnapshot` must return a referentially stable value or React loops, so
 * the raw string is cached and only re-read when a write invalidates it.
 */
const rawCache = new Map<string, string | null>();

function readRaw(key: string): string | null {
  if (rawCache.has(key)) return rawCache.get(key) ?? null;

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    // Private mode or storage disabled.
  }
  rawCache.set(key, raw);
  return raw;
}

function invalidate(key: string) {
  rawCache.delete(key);
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage unavailable — selections are best-effort
    // until the user signs in and they sync to the backend.
  }
  invalidate(key);
  // Same-tab listeners: the native `storage` event only fires cross-tab.
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

/**
 * True only after hydration. Lets a component tell "nothing stored" apart
 * from "not yet readable", so counters do not flicker in from zero.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function isHydrated() {
  return typeof window !== "undefined";
}
