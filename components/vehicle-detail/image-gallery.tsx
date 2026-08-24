"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff, X, ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { useImageZoom } from "./use-image-zoom";
import type { VehicleImage } from "@/types/vehicle";

export interface ImageGalleryProps {
  images: VehicleImage[];
  title: string;
}

/**
 * Side of the square magnifier panel, in px. Matches the widest detail-page
 * sidebar (24rem) so the panel covers it cleanly rather than leaving a
 * sliver of the contact buttons showing beside it.
 */
const ZOOM_PANEL_SIZE = 384;

/**
 * Listing gallery.
 *
 * Mobile is a CSS scroll-snap carousel — no JS drives the swipe, only the
 * counter follows it. Desktop is a main frame plus thumbnails, with a
 * hover zoom that magnifies a square region into a panel beside the photo.
 * Both share one lightbox, which is the only part that mounts extra markup.
 */
export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const clamp = useCallback(
    (index: number) => (index + count) % Math.max(count, 1),
    [count],
  );

  const goTo = useCallback(
    (index: number, scroll = true) => {
      const next = clamp(index);
      setActive(next);
      if (scroll && trackRef.current) {
        const child = trackRef.current.children[next] as
          HTMLElement | undefined;
        child?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    },
    [clamp],
  );

  // Keep the counter in step with a native swipe.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        setActive((current) => (current === index ? current : index));
        frame = 0;
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Called before the empty-gallery return below: hooks must run in the
  // same order on every render.
  const {
    canZoom,
    frameRef,
    geometry: zoomGeometry,
    isZooming,
    handlers: zoomHandlers,
  } = useImageZoom(
    {
      url: images[active]?.url ?? "",
      width: images[active]?.width ?? 1,
      height: images[active]?.height ?? 1,
      blurDataURL: images[active]?.blurDataURL,
    },
    ZOOM_PANEL_SIZE,
  );

  if (count === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-lg border border-steel-200 bg-steel-50 text-steel-400 lg:aspect-[16/10]">
        <div className="text-center">
          <ImageOff aria-hidden className="mx-auto size-8" />
          <p className="mt-2 text-sm">No photos provided</p>
        </div>
      </div>
    );
  }

  const current = images[active];

  return (
    <>
      {/* Mobile: swipe carousel */}
      <div className="relative lg:hidden">
        <div
          ref={trackRef}
          className="scroll-rail -mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6"
          role="group"
          aria-roledescription="carousel"
          aria-label={`Photos of ${title}`}
        >
          {images.map((image, index) => (
            <div
              key={image.url + index}
              className="relative aspect-[4/3] w-screen shrink-0 snap-center bg-steel-100"
              role="group"
              aria-roledescription="slide"
              aria-label={`Photo ${index + 1} of ${count}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                placeholder={image.blurDataURL ? "blur" : "empty"}
                blurDataURL={image.blurDataURL}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <p
          aria-live="polite"
          className="tabular absolute right-6 bottom-3 rounded-full bg-steel-950/75 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm sm:right-8"
        >
          {active + 1} / {count}
        </p>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="View photos full screen"
          className="absolute bottom-3 left-6 grid size-9 place-items-center rounded-full bg-steel-950/75 text-white backdrop-blur-sm sm:left-8"
        >
          <Expand className="size-4" />
        </button>
      </div>

      {/* Desktop: main frame + thumbnails */}
      <div className="hidden lg:block">
        {/* Zoom anchor. Must not clip, so the panel can overlay the sidebar. */}
        <div className="relative">
          <div
            ref={frameRef}
            {...zoomHandlers}
            className={cn(
              "group relative aspect-[16/10] overflow-hidden rounded-lg border border-steel-200 bg-steel-100",
              canZoom && "cursor-crosshair",
            )}
          >
            <Image
              key={current.url}
              src={current.url}
              alt={current.alt}
              fill
              priority
              sizes="(max-width: 1400px) 65vw, 860px"
              placeholder={current.blurDataURL ? "blur" : "empty"}
              blurDataURL={current.blurDataURL}
              className="object-cover"
            />

            {zoomGeometry && (
              <span
                aria-hidden
                className="pointer-events-none absolute rounded-xs bg-white/20 shadow-md ring-2 ring-white/85"
                style={{
                  left: zoomGeometry.lens.x,
                  top: zoomGeometry.lens.y,
                  width: zoomGeometry.lens.size,
                  height: zoomGeometry.lens.size,
                }}
              />
            )}

            {count > 1 && !isZooming && (
              <>
                <GalleryArrow
                  direction="previous"
                  onClick={() => goTo(active - 1, false)}
                />
                <GalleryArrow
                  direction="next"
                  onClick={() => goTo(active + 1, false)}
                />
              </>
            )}

            {canZoom && !isZooming && (
              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-steel-950/70 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
              >
                <ZoomIn className="size-3.5" />
                Hover to zoom
              </span>
            )}

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className={cn(
                "absolute right-3 bottom-3 inline-flex min-h-9 items-center gap-1.5 rounded-md bg-steel-950/75 px-3 text-xs font-semibold text-white backdrop-blur-sm transition-opacity duration-200 focus-visible:opacity-100",
                isZooming ? "opacity-0" : "opacity-0 group-hover:opacity-100",
              )}
            >
              <Expand className="size-3.5" />
              View all {count} photos
            </button>
          </div>

          {zoomGeometry && (
            <div
              aria-hidden
              // Sits over the sticky sidebar while the cursor is on the photo.
              className="pointer-events-none absolute top-0 left-[calc(100%+2.5rem)] z-20 hidden overflow-hidden rounded-lg border border-steel-200 bg-steel-100 shadow-xl lg:block"
              style={{
                width: ZOOM_PANEL_SIZE,
                height: ZOOM_PANEL_SIZE,
                // The blur placeholder sits under the full-resolution file,
                // so the panel never flashes white before it decodes.
                backgroundImage: current.blurDataURL
                  ? `url(${current.url}), url(${current.blurDataURL})`
                  : `url(${current.url})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${zoomGeometry.background.width}px ${zoomGeometry.background.height}px`,
                backgroundPosition: `${zoomGeometry.background.x}px ${zoomGeometry.background.y}px`,
              }}
            />
          )}
        </div>

        {count > 1 && (
          <ul className="mt-3 grid grid-cols-6 gap-2.5">
            {images.map((image, index) => (
              <li key={image.url + index}>
                <button
                  type="button"
                  onClick={() => goTo(index, false)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    "relative block aspect-[4/3] w-full overflow-hidden rounded-md border-2 bg-steel-100 transition-all duration-150",
                    index === active
                      ? "border-brand-600"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="140px"
                    placeholder={image.blurDataURL ? "blur" : "empty"}
                    blurDataURL={image.blurDataURL}
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showClose={false}
          className="max-w-[min(96vw,1200px)] border-0 bg-transparent p-0 shadow-none"
        >
          <DialogTitle className="sr-only">Photos of {title}</DialogTitle>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-steel-950 sm:aspect-[16/10]">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="96vw"
              className="object-contain"
            />

            {count > 1 && (
              <>
                <GalleryArrow
                  direction="previous"
                  onClick={() => goTo(active - 1, false)}
                />
                <GalleryArrow
                  direction="next"
                  onClick={() => goTo(active + 1, false)}
                />
              </>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="tabular text-sm font-medium text-white">
              {active + 1} / {count}
            </p>
            {current.credit && (
              <p className="min-w-0 truncate text-xs text-white/70">
                Photo: {current.credit.author} ({current.credit.license})
              </p>
            )}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo viewer"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${direction === "previous" ? "Previous" : "Next"} photo`}
      className={cn(
        "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-steel-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white",
        direction === "previous" ? "left-3" : "right-3",
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
