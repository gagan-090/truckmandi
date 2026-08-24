"use client";

import { HandCoins, MessageSquare, Phone, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/marketplace/favorite-button";
import { CompareButton } from "@/components/marketplace/compare-button";
import { track } from "@/lib/analytics/analytics";
import type { Vehicle } from "@/types/vehicle";
import { MessageDialog, OfferDialog } from "./contact-dialogs";

/**
 * The conversion cluster. Rendered in the desktop sticky panel and, in
 * `layout="bar"`, inside the mobile bottom bar.
 */
export function VehicleActions({
  vehicle,
  layout = "panel",
}: {
  vehicle: Vehicle;
  layout?: "panel" | "bar";
}) {
  const [messageOpen, setMessageOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const sellerPhone = vehicle.seller.phone;

  function onCall() {
    track({
      name: "seller_call",
      vehicleId: vehicle.id,
      sellerId: vehicle.seller.id,
    });
    setPhoneRevealed(true);
  }

  function onMessage() {
    track({
      name: "seller_chat",
      vehicleId: vehicle.id,
      sellerId: vehicle.seller.id,
    });
    setMessageOpen(true);
  }

  async function onShare() {
    const url = window.location.href;
    // Native share on mobile, clipboard everywhere else.
    if (navigator.share) {
      try {
        await navigator.share({ title: vehicle.title, url });
        return;
      } catch {
        // User dismissed the share sheet.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard blocked; the address bar still has the URL.
    }
  }

  const dialogs = (
    <>
      <MessageDialog
        vehicle={vehicle}
        open={messageOpen}
        onOpenChange={setMessageOpen}
      />
      <OfferDialog
        vehicle={vehicle}
        open={offerOpen}
        onOpenChange={setOfferOpen}
      />
    </>
  );

  if (layout === "bar") {
    return (
      <>
        <div className="flex items-center gap-2">
          {phoneRevealed && sellerPhone ? (
            <Button asChild variant="success" size="lg" className="flex-1">
              <a href={`tel:${sellerPhone.replace(/\s/g, "")}`}>
                <Phone />
                Call
              </a>
            </Button>
          ) : (
            <Button
              variant="success"
              size="lg"
              className="flex-1"
              onClick={onCall}
            >
              <Phone />
              Call
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onMessage}
          >
            <MessageSquare />
            Chat
          </Button>
          <Button
            variant="accent"
            size="lg"
            className="flex-1"
            onClick={() => setOfferOpen(true)}
          >
            <HandCoins />
            Offer
          </Button>
        </div>
        {dialogs}
      </>
    );
  }

  return (
    <>
      <div className="space-y-2.5">
        {phoneRevealed && sellerPhone ? (
          <Button asChild variant="success" size="lg" block>
            <a href={`tel:${sellerPhone.replace(/\s/g, "")}`}>
              <Phone />
              {sellerPhone}
            </a>
          </Button>
        ) : (
          <Button variant="success" size="lg" block onClick={onCall}>
            <Phone />
            Show phone number
          </Button>
        )}

        <Button variant="primary" size="lg" block onClick={onMessage}>
          <MessageSquare />
          Message seller
        </Button>

        <Button
          variant="outlineAccent"
          size="lg"
          block
          onClick={() => setOfferOpen(true)}
        >
          <HandCoins />
          Make an offer
        </Button>

        <div className="flex items-center gap-2 pt-1">
          <FavoriteButton
            vehicleId={vehicle.id}
            vehicleTitle={vehicle.title}
            variant="plain"
            className="size-11"
          />
          <CompareButton
            vehicleId={vehicle.id}
            vehicleTitle={vehicle.title}
            className="h-11 flex-1 justify-center"
          />
          <button
            type="button"
            onClick={onShare}
            aria-label="Share this listing"
            className="grid size-11 shrink-0 place-items-center rounded-md border border-steel-300 bg-white text-steel-600 transition-colors hover:border-steel-400 hover:bg-steel-50"
          >
            <Share2 className="size-[18px]" />
          </button>
        </div>
      </div>
      {dialogs}
    </>
  );
}
