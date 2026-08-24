"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export interface ImageZoomSource {
  url: string;
  /** Intrinsic pixel size, used to pick a zoom factor that stays sharp. */
  width: number;
  height: number;
  blurDataURL?: string;
}

export interface ZoomGeometry {
  /** Square lens drawn over the source image, in CSS px. */
  lens: { x: number; y: number; size: number };
  /** Background offset for the magnified panel, in CSS px. */
  background: { x: number; y: number; width: number; height: number };
}

/**
 * How much tighter the panel crops than a plain "fit the photo" view.
 * At 1 the lens would frame roughly what the panel shows at native
 * resolution; at 2 the lens is half as wide, so the panel shows a quarter
 * of the area — the close-in crop shoppers expect from a product zoom.
 */
const ZOOM_STRENGTH = 2;

/** Bounds, so a small source is still magnified and a large one stays sharp. */
const MIN_ZOOM = 3;
const MAX_ZOOM = 4;

/**
 * Amazon/Flipkart-style hover zoom.
 *
 * A square lens tracks the cursor over the listing photo while a magnified
 * panel shows that exact region beside it. The maths mirrors `object-cover`
 * so the panel frames the same crop the user is pointing at:
 *
 *   coverScale = max(boxW / naturalW, boxH / naturalH)
 *
 * The lens is derived back from the clamped background offset rather than
 * from the raw cursor position, so the two can never drift apart at the
 * edges of the image.
 *
 * Pointer-only: keyboard and touch users get the lightbox instead.
 */
export function useImageZoom(source: ImageZoomSource, panelSize: number) {
  const canZoom = useMediaQuery("(hover: hover) and (pointer: fine)");
  const frameRef = useRef<HTMLDivElement>(null);
  const frameRect = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const preloaded = useRef(new Set<string>());

  const [geometry, setGeometry] = useState<ZoomGeometry | null>(null);

  const compute = useCallback(
    (clientX: number, clientY: number) => {
      const rect = frameRect.current;
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const { width: boxW, height: boxH } = rect;
      const { width: naturalW, height: naturalH } = source;

      // Replicate object-cover: the image fills the box and overflows.
      const coverScale = Math.max(boxW / naturalW, boxH / naturalH);
      const imgW = naturalW * coverScale;
      const imgH = naturalH * coverScale;

      // Scale from the source's native resolution, then crop in further.
      const zoom = clampRange(
        (naturalW / boxW) * ZOOM_STRENGTH,
        MIN_ZOOM,
        MAX_ZOOM,
      );

      const zoomedW = imgW * zoom;
      const zoomedH = imgH * zoom;

      // Cursor position inside the box, then inside the (overflowing) image.
      const cursorX = clientX - rect.left;
      const cursorY = clientY - rect.top;
      const pointX = cursorX + (imgW - boxW) / 2;
      const pointY = cursorY + (imgH - boxH) / 2;

      // Centre that point in the panel, without exposing empty edges.
      const bgX = clampRange(panelSize / 2 - pointX * zoom, panelSize - zoomedW, 0);
      const bgY = clampRange(panelSize / 2 - pointY * zoom, panelSize - zoomedH, 0);

      // Derive the lens from the clamped offset so the two stay in step.
      const lensSize = panelSize / zoom;
      const lensX = -bgX / zoom - (imgW - boxW) / 2;
      const lensY = -bgY / zoom - (imgH - boxH) / 2;

      setGeometry({
        lens: { x: lensX, y: lensY, size: lensSize },
        background: { x: bgX, y: bgY, width: zoomedW, height: zoomedH },
      });
    },
    [panelSize, source],
  );

  const onPointerEnter = useCallback(() => {
    if (!canZoom) return;

    frameRect.current = frameRef.current?.getBoundingClientRect() ?? null;

    // Warm the full-resolution file once, so the panel does not flash.
    if (!preloaded.current.has(source.url)) {
      preloaded.current.add(source.url);
      const img = new window.Image();
      img.src = source.url;
    }
  }, [canZoom, source.url]);

  const onPointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!canZoom) return;

      const { clientX, clientY } = event;
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        // Re-read each frame: the page can scroll while hovering.
        frameRect.current = frameRef.current?.getBoundingClientRect() ?? null;
        compute(clientX, clientY);
      });
    },
    [canZoom, compute],
  );

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setGeometry(null);
  }, []);

  // Changing photo mid-hover would show the previous crop. Reset during
  // render rather than in an effect, so the stale lens is never painted.
  const [lastUrl, setLastUrl] = useState(source.url);
  if (source.url !== lastUrl) {
    setLastUrl(source.url);
    setGeometry(null);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return {
    canZoom,
    frameRef,
    geometry,
    isZooming: geometry !== null,
    handlers: {
      onMouseEnter: onPointerEnter,
      onMouseMove: onPointerMove,
      onMouseLeave: onPointerLeave,
    },
  };
}

function clampRange(value: number, min: number, max: number) {
  // A zoomed image is always larger than the panel, but guard the
  // degenerate case where min > max rather than returning NaN geometry.
  if (min > max) return max;
  return Math.min(max, Math.max(min, value));
}
