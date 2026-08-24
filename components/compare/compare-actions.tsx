"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCompare } from "@/features/compare/use-compare";
import { CompareTable } from "./compare-table";
import type { CompareRow, CompareVehicle } from "@/features/compare/build-rows";

/**
 * Wires the table's remove control to both stores: local selection (so the
 * tray updates) and the URL (so the link stays shareable and the server can
 * re-render the remaining columns).
 */
export function CompareTableWithActions({
  vehicles,
  rows,
}: {
  vehicles: CompareVehicle[];
  rows: CompareRow[];
}) {
  const router = useRouter();
  const { remove } = useCompare();

  const onRemove = useCallback(
    (id: string) => {
      remove(id);
      const next = vehicles.filter((v) => v.id !== id).map((v) => v.id);
      router.replace(
        next.length ? `/compare?ids=${next.join(",")}` : "/compare",
      );
    },
    [remove, router, vehicles],
  );

  return <CompareTable vehicles={vehicles} rows={rows} onRemove={onRemove} />;
}
