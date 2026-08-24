"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  ImagePlus,
  Star,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import {
  MAX_IMAGE_SIZE_MB,
  MAX_LISTING_IMAGES,
  MIN_LISTING_IMAGES,
} from "@/config/constants";
import { useSellDraft, type ListingPhoto } from "@/features/sell/store";
import { photosStepSchema } from "@/features/sell/schemas";
import { sellSteps } from "@/features/sell/steps";
import { track } from "@/lib/analytics/analytics";
import { cn } from "@/lib/utils/cn";
import { StepShell } from "./step-shell";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const shotList = [
  "Front three-quarter view",
  "Rear three-quarter view",
  "Driver-side profile",
  "Cabin interior and dashboard",
  "Odometer reading",
  "Engine bay",
  "Tyres and wheels",
  "Chassis and load body",
];

export function ImageUploaderStepForm() {
  const router = useRouter();
  const { photos, setPhotos, restored } = useSellDraft();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files);
    const problems: string[] = [];
    const accepted: ListingPhoto[] = [];

    for (const file of incoming) {
      if (photos.length + accepted.length >= MAX_LISTING_IMAGES) {
        problems.push(`You can add up to ${MAX_LISTING_IMAGES} photos.`);
        break;
      }
      if (!ACCEPTED.includes(file.type)) {
        problems.push(`${file.name} is not a JPEG, PNG or WebP image.`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        problems.push(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB} MB.`);
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        sizeBytes: file.size,
      });
    }

    if (accepted.length) setPhotos((current) => [...current, ...accepted]);
    setError(problems[0] ?? null);
  }

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    // Allow re-picking the same file after a removal.
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files) addFiles(event.dataTransfer.files);
  }

  function remove(id: string) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
    setError(null);
  }

  function move(from: number, to: number) {
    setPhotos((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = photosStepSchema.safeParse({ photoCount: photos.length });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    track({ name: "listing_step_completed", step: "photos" });
    router.push(sellSteps[3].href);
  }

  if (!restored) return null;

  return (
    <StepShell
      title="Add photos"
      description={`Listings with ${MIN_LISTING_IMAGES} or more clear photos get substantially more enquiries. The first photo is what buyers see in search results.`}
      stepIndex={2}
      onSubmit={onSubmit}
    >
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-lg border-2 border-dashed p-6 text-center transition-colors sm:p-10",
          dragging
            ? "border-brand-500 bg-brand-50"
            : "border-steel-300 bg-steel-50/60",
        )}
      >
        <ImagePlus aria-hidden className="mx-auto size-8 text-steel-400" />
        <p className="mt-3 font-display text-base font-bold text-steel-900">
          Drag photos here, or choose files
        </p>
        <p className="mt-1 text-sm text-steel-600">
          JPEG, PNG or WebP · up to {MAX_IMAGE_SIZE_MB} MB each ·{" "}
          {photos.length}/{MAX_LISTING_IMAGES} added
        </p>

        <input
          ref={inputRef}
          id="photos"
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          onChange={onPick}
          className="sr-only"
        />
        <Button
          variant="secondary"
          size="md"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
        >
          Choose photos
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700"
        >
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null) move(dragIndex, index);
                setDragIndex(null);
              }}
              className="group relative overflow-hidden rounded-lg border border-steel-200 bg-white"
            >
              <div className="relative aspect-[4/3] bg-steel-100">
                <Image
                  src={photo.url}
                  alt={photo.name}
                  fill
                  sizes="220px"
                  // Object URLs cannot go through the image optimiser.
                  unoptimized
                  className="object-cover"
                />

                {index === 0 && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-sm bg-brand-600 px-1.5 py-1 text-[10px] font-bold text-white">
                    <Star aria-hidden className="size-3 fill-white" />
                    Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => remove(photo.id)}
                  aria-label={`Remove ${photo.name}`}
                  className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-white/95 text-steel-600 shadow-sm transition-colors hover:bg-white hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-2">
                <GripVertical
                  aria-hidden
                  className="size-3.5 shrink-0 cursor-grab text-steel-300"
                />
                <span className="min-w-0 flex-1 truncate text-xs text-steel-600">
                  {photo.name}
                </span>
                <span className="flex shrink-0 gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    disabled={index === 0}
                    aria-label={`Move ${photo.name} earlier`}
                    className="grid size-6 place-items-center rounded-sm text-steel-500 transition-colors hover:bg-steel-100 disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    disabled={index === photos.length - 1}
                    aria-label={`Move ${photo.name} later`}
                    className="grid size-6 place-items-center rounded-sm text-steel-500 transition-colors hover:bg-steel-100 disabled:opacity-30"
                  >
                    →
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-8 rounded-lg border border-steel-200 bg-white p-5">
        <h2 className="font-display text-sm font-bold text-steel-900">
          Photos worth taking
        </h2>
        <ul className="mt-3 grid gap-1.5 text-sm text-steel-600 sm:grid-cols-2">
          {shotList.map((shot) => (
            <li key={shot} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-steel-300"
              />
              {shot}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-steel-500">
          Shoot in daylight with the vehicle clean and the full body in frame. A
          clear odometer photo is the single most requested image buyers ask for
          after their first message.
        </p>
      </section>
    </StepShell>
  );
}
