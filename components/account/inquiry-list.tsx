"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  HandCoins,
  MailOpen,
  MessageSquare,
  PhoneCall,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useInquiries } from "@/features/inquiries/use-inquiries";
import { formatPriceShort } from "@/lib/utils/format-currency";
import { formatListingDate, formatRelativeTime } from "@/lib/utils/format-distance";
import type { InquiryStatus, InquiryType } from "@/types/user";

const typeMeta: Record<
  InquiryType,
  { label: string; icon: LucideIcon }
> = {
  message: { label: "Message", icon: MessageSquare },
  offer: { label: "Offer", icon: HandCoins },
  callback: { label: "Callback", icon: PhoneCall },
  visit: { label: "Visit request", icon: CalendarClock },
};

const statusMeta: Record<
  InquiryStatus,
  { label: string; variant: "neutral" | "accent" | "trust" | "outline" }
> = {
  sent: { label: "Sent", variant: "accent" },
  viewed: { label: "Viewed by seller", variant: "neutral" },
  responded: { label: "Seller responded", variant: "trust" },
  closed: { label: "Closed", variant: "outline" },
};

export function InquiryList() {
  const { inquiries, hydrated, remove, clear } = useInquiries();

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-lg" />
        ))}
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={<MailOpen />}
        title="No enquiries yet"
        description="When you message a seller or make an offer, it will appear here with the seller's response."
        action={
          <Button asChild>
            <Link href="/vehicles">Browse vehicles</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-steel-600">
          <span className="tabular font-semibold text-steel-900">
            {inquiries.length}
          </span>{" "}
          {inquiries.length === 1 ? "enquiry" : "enquiries"} sent
        </p>
        <Button variant="link" size="xs" onClick={clear}>
          Clear all
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {inquiries.map((inquiry) => {
          const type = typeMeta[inquiry.type] ?? typeMeta.message;
          const status = statusMeta[inquiry.status] ?? statusMeta.sent;
          const TypeIcon = type.icon;

          return (
            <li
              key={inquiry.id}
              className="relative flex gap-4 rounded-lg border border-steel-200 bg-white p-3.5 transition-colors hover:border-steel-300 sm:p-4"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-steel-100 sm:size-24">
                {inquiry.vehicleImage ? (
                  <Image
                    src={inquiry.vehicleImage}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : null}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">
                    <TypeIcon aria-hidden />
                    {type.label}
                  </Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <h3 className="mt-2 font-display text-sm font-bold text-steel-900 sm:text-base">
                  <Link
                    href={`/vehicles/${inquiry.vehicleSlug}`}
                    className="line-clamp-1 after:absolute after:inset-0 after:content-['']"
                  >
                    {inquiry.vehicleTitle}
                  </Link>
                </h3>

                {inquiry.offerAmount !== undefined && (
                  <p className="mt-1 text-sm text-steel-700">
                    You offered{" "}
                    <span className="tabular font-bold text-steel-900">
                      {formatPriceShort(inquiry.offerAmount)}
                    </span>
                  </p>
                )}

                {inquiry.message && (
                  <p className="mt-1 line-clamp-2 text-sm text-pretty text-steel-600">
                    “{inquiry.message}”
                  </p>
                )}

                <p className="mt-2 text-xs text-steel-500">
                  Sent {formatRelativeTime(inquiry.createdAt)}
                  <span aria-hidden> · </span>
                  {formatListingDate(inquiry.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => remove(inquiry.id)}
                aria-label={`Remove enquiry about ${inquiry.vehicleTitle}`}
                // Above the card-wide link overlay.
                className="relative z-10 grid size-9 shrink-0 self-start place-items-center rounded-md text-steel-400 transition-colors hover:bg-steel-100 hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
