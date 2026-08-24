"use client";

import { useCallback } from "react";
import { LOCAL_STORAGE_KEYS, MAX_COMPARE_VEHICLES } from "@/config/constants";
import { useIsHydrated, useLocalStorage } from "@/hooks/use-local-storage";
import { useSession } from "@/features/auth/session-context";
import { scopedKey } from "@/lib/storage/account-scope";
import { track } from "@/lib/analytics/analytics";

const EMPTY: string[] = [];

export interface CompareResult {
  added: boolean;
  /** True when the tray was already full, so the caller can explain why. */
  rejected: boolean;
}

/**
 * Comparison tray, capped at `MAX_COMPARE_VEHICLES` and stored per account
 * so it does not carry over between users on a shared browser.
 */
export function useCompare() {
  const { user, status } = useSession();
  const { value: ids, setValue } = useLocalStorage<string[]>(
    scopedKey(LOCAL_STORAGE_KEYS.compare, user?.id ?? null),
    EMPTY,
  );
  const hydrated = useIsHydrated() && status !== "loading";

  const isSelected = useCallback(
    (vehicleId: string) => ids.includes(vehicleId),
    [ids],
  );

  const isFull = ids.length >= MAX_COMPARE_VEHICLES;

  const toggle = useCallback(
    (vehicleId: string): CompareResult => {
      const selected = ids.includes(vehicleId);

      if (!selected && ids.length >= MAX_COMPARE_VEHICLES) {
        return { added: false, rejected: true };
      }

      const next = selected
        ? ids.filter((id) => id !== vehicleId)
        : [...ids, vehicleId];

      setValue(next);
      track({
        name: "vehicle_compare",
        vehicleId,
        added: !selected,
        total: next.length,
      });
      return { added: !selected, rejected: false };
    },
    [ids, setValue],
  );

  const remove = useCallback(
    (vehicleId: string) =>
      setValue((current) => current.filter((id) => id !== vehicleId)),
    [setValue],
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  /** Replaces the whole selection, e.g. when adopting ids from a shared URL. */
  const replace = useCallback(
    (next: string[]) => setValue(next.slice(0, MAX_COMPARE_VEHICLES)),
    [setValue],
  );

  return {
    ids,
    count: ids.length,
    isSelected,
    isFull,
    toggle,
    remove,
    clear,
    replace,
    hydrated,
    max: MAX_COMPARE_VEHICLES,
  };
}
