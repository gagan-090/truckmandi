"use client";

import { useCallback } from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { useIsHydrated, useLocalStorage } from "@/hooks/use-local-storage";
import { useSession } from "@/features/auth/session-context";
import { scopedKey } from "@/lib/storage/account-scope";
import { track } from "@/lib/analytics/analytics";

const EMPTY: string[] = [];

/**
 * Saved vehicles.
 *
 * Stored per account, so one person's shortlist never shows up for the
 * next person signed in on the same browser. Signed-out visitors get a
 * `guest` bucket that is adopted on sign-in and cleared on sign-out.
 */
export function useFavorites() {
  const { user, status } = useSession();
  const { value: ids, setValue } = useLocalStorage<string[]>(
    scopedKey(LOCAL_STORAGE_KEYS.favorites, user?.id ?? null),
    EMPTY,
  );
  // Hold off until the session resolves, otherwise the guest bucket would
  // flash before the account's own list loads.
  const hydrated = useIsHydrated() && status !== "loading";

  const isFavorite = useCallback(
    (vehicleId: string) => ids.includes(vehicleId),
    [ids],
  );

  const toggle = useCallback(
    (vehicleId: string) => {
      let added = false;
      setValue((current) => {
        added = !current.includes(vehicleId);
        return added
          ? [vehicleId, ...current]
          : current.filter((id) => id !== vehicleId);
      });
      track({ name: "vehicle_favorite", vehicleId, added });
      return added;
    },
    [setValue],
  );

  const remove = useCallback(
    (vehicleId: string) => {
      setValue((current) => current.filter((id) => id !== vehicleId));
    },
    [setValue],
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  return {
    ids,
    count: ids.length,
    isFavorite,
    toggle,
    remove,
    clear,
    hydrated,
  };
}
