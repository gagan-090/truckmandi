"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Reports `false` on the server and during the hydrating render, then the
 * real value. Never branch layout on this — use CSS. It is for behaviour
 * that genuinely differs, such as which side a sheet opens from.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
