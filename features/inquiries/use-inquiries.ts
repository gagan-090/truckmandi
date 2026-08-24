"use client";

import { useCallback } from "react";
import { LOCAL_STORAGE_KEYS } from "@/config/constants";
import { useIsHydrated, useLocalStorage } from "@/hooks/use-local-storage";
import { useSession } from "@/features/auth/session-context";
import { scopedKey } from "@/lib/storage/account-scope";
import type { Inquiry, InquiryType } from "@/types/user";

const EMPTY: Inquiry[] = [];

/** What the caller supplies; id, status and timestamp are filled in here. */
export interface RecordInquiryInput {
  vehicleId: string;
  vehicleSlug: string;
  vehicleTitle: string;
  vehicleImage: string;
  type: InquiryType;
  message?: string;
  offerAmount?: number;
}

const MAX_INQUIRIES = 100;

/**
 * The buyer's own record of what they have sent.
 *
 * Kept in this browser, like saved vehicles and comparisons: the enquiry is
 * also POSTed to the API, but until that endpoint returns a durable list
 * per user there is nothing to read back, which is why submitted enquiries
 * never appeared on the account page. Swap `value` for the API response
 * once `GET /account/inquiries` exists — nothing else has to change.
 */
export function useInquiries() {
  const { user, status } = useSession();
  const { value: inquiries, setValue } = useLocalStorage<Inquiry[]>(
    scopedKey(LOCAL_STORAGE_KEYS.inquiries, user?.id ?? null),
    EMPTY,
  );
  const hydrated = useIsHydrated() && status !== "loading";

  const record = useCallback(
    (input: RecordInquiryInput, id?: string): Inquiry => {
      const inquiry: Inquiry = {
        id: id ?? `inq_${Date.now().toString(36)}`,
        status: "sent",
        createdAt: new Date().toISOString(),
        ...input,
      };

      setValue((current) => [inquiry, ...current].slice(0, MAX_INQUIRIES));
      return inquiry;
    },
    [setValue],
  );

  const remove = useCallback(
    (id: string) => setValue((current) => current.filter((i) => i.id !== id)),
    [setValue],
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  return {
    inquiries,
    count: inquiries.length,
    hydrated,
    record,
    remove,
    clear,
  };
}
