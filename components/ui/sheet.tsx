"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Slide-over panel. `side="bottom"` gives the mobile drawer used for
 * filters and the compare tray, so there is one dialog implementation
 * rather than a separate drawer package.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

const sheetVariants = cva(
  "fixed z-50 flex flex-col bg-white shadow-xl focus:outline-none",
  {
    variants: {
      side: {
        right:
          "inset-y-0 right-0 h-full w-full max-w-md border-l border-steel-200 data-[state=closed]:animate-slide-to-right data-[state=open]:animate-slide-from-right",
        left: "inset-y-0 left-0 h-full w-full max-w-sm border-r border-steel-200 data-[state=closed]:animate-slide-to-left data-[state=open]:animate-slide-from-left",
        bottom:
          "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-xl border-t border-steel-200 data-[state=closed]:animate-slide-to-bottom data-[state=open]:animate-slide-from-bottom",
        top: "inset-x-0 top-0 max-h-[92dvh] border-b border-steel-200 data-[state=closed]:animate-slide-to-top data-[state=open]:animate-slide-from-top",
      },
    },
    defaultVariants: { side: "right" },
  },
);

export function SheetContent({
  className,
  children,
  side,
  showClose = true,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetVariants> & { showClose?: boolean }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-steel-950/50 backdrop-blur-[2px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {side === "bottom" && (
          <div
            aria-hidden
            className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-steel-300"
          />
        )}
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-3.5 right-4 grid size-9 place-items-center rounded-md text-steel-500 transition-colors hover:bg-steel-100 hover:text-steel-900"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-steel-200 px-5 py-4 pr-14",
        className,
      )}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  );
}

export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "shrink-0 border-t border-steel-200 bg-white px-5 py-3",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
      {...props}
    />
  );
}
