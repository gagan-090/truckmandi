"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCompare } from "@/features/compare/use-compare";

/**
 * Bridges local selection and the URL.
 *
 * The tray stores ids in localStorage, but /compare?ids=… is what people
 * share. When someone opens /compare with no ids, this promotes whatever
 * they have selected locally into the URL so the page can render on the
 * server; when the URL carries ids, it adopts them locally so the tray and
 * the page agree.
 */
export function CompareSync({ urlIds }: { urlIds: string[] }) {
  const router = useRouter();
  const { ids, replace, hydrated } = useCompare();

  useEffect(() => {
    if (!hydrated) return;

    const urlKey = urlIds.join(",");
    const localKey = ids.join(",");
    if (urlKey === localKey) return;

    if (urlIds.length > 0) {
      replace(urlIds);
    } else if (ids.length > 0) {
      router.replace(`/compare?ids=${localKey}`);
    }
  }, [hydrated, ids, urlIds, router, replace]);

  return null;
}
