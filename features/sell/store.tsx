"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { useIsHydrated, useLocalStorage } from "@/hooks/use-local-storage";
import { useSession } from "@/features/auth/session-context";
import { scopedKey } from "@/lib/storage/account-scope";
import type { ListingDraft } from "./schemas";

export interface ListingPhoto {
  id: string;
  /** Object URL for preview. Not persisted — see the note below. */
  url: string;
  name: string;
  sizeBytes: number;
}

interface SellStore {
  draft: ListingDraft;
  photos: ListingPhoto[];
  /** False until hydration, so steps do not flash empty fields. */
  restored: boolean;
  update: (values: Partial<ListingDraft>) => void;
  setPhotos: (
    next: ListingPhoto[] | ((current: ListingPhoto[]) => ListingPhoto[]),
  ) => void;
  reset: () => void;
}

const SellContext = createContext<SellStore | null>(null);

const EMPTY_DRAFT: ListingDraft = {};

/**
 * Wizard state.
 *
 * Lives in `sell/vehicle/layout.tsx`, so it survives navigation between
 * steps — App Router does not remount a layout when a child route changes.
 * The text fields are mirrored to localStorage so a reload or an accidental
 * back-navigation does not cost the seller their work.
 *
 * Photos are deliberately not persisted: they are `File` handles behind
 * object URLs, which do not survive a reload. In production these would be
 * uploaded as they are picked and the draft would hold the returned URLs.
 */
export function SellProvider({ children }: { children: ReactNode }) {
  const { user, status } = useSession();
  const { value: draft, setValue: setDraft } = useLocalStorage<ListingDraft>(
    scopedKey(LOCAL_STORAGE_KEYS.sellDraft, user?.id ?? null),
    EMPTY_DRAFT,
  );
  const [photos, setPhotosState] = useState<ListingPhoto[]>([]);
  const restored = useIsHydrated() && status !== "loading";

  const update = useCallback(
    (values: Partial<ListingDraft>) => {
      setDraft((current) => ({ ...current, ...values }));
    },
    [setDraft],
  );

  const setPhotos = useCallback(
    (next: ListingPhoto[] | ((current: ListingPhoto[]) => ListingPhoto[])) => {
      setPhotosState((current) => {
        const resolved = typeof next === "function" ? next(current) : next;
        // Release object URLs for photos that were removed.
        for (const photo of current) {
          if (!resolved.some((item) => item.id === photo.id)) {
            URL.revokeObjectURL(photo.url);
          }
        }
        return resolved;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setPhotosState((current) => {
      for (const photo of current) URL.revokeObjectURL(photo.url);
      return [];
    });
    setDraft(EMPTY_DRAFT);
  }, [setDraft]);

  const value = useMemo(
    () => ({ draft, photos, restored, update, setPhotos, reset }),
    [draft, photos, restored, update, setPhotos, reset],
  );

  return <SellContext.Provider value={value}>{children}</SellContext.Provider>;
}

export function useSellDraft(): SellStore {
  const context = useContext(SellContext);
  if (!context) {
    throw new Error("useSellDraft must be used inside <SellProvider>");
  }
  return context;
}
