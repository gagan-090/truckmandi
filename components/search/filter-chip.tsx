"use client";

import { X } from "lucide-react";

export interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-steel-300 bg-white pr-2 pl-3 text-xs font-medium text-steel-700 transition-colors hover:border-steel-400 hover:bg-steel-50"
    >
      {label}
      <X aria-hidden className="size-3.5 text-steel-400" />
      <span className="sr-only">Remove filter</span>
    </button>
  );
}
