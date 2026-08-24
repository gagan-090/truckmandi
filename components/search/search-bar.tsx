"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils/cn";

export interface SearchBarProps {
  /** `compact` for the navbar, `hero` for the landing search. */
  variant?: "compact" | "hero";
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  /** Pre-fills the field, e.g. with the current `q` on the results page. */
  defaultValue?: string;
  /**
   * Serialised params to carry over on submit. The results page passes its
   * active filters so searching narrows rather than resets.
   */
  preservedParams?: string;
  onSubmitted?: () => void;
}

/**
 * Deliberately does not read `useSearchParams` — it renders inside the root
 * layout, and that hook would opt every static page out of prerendering.
 * Callers that need the current query pass it in (see `ResultsSearchBar`).
 */
export function SearchBar({
  variant = "compact",
  placeholder = "Search by brand, model or body type",
  className,
  autoFocus,
  defaultValue = "",
  preservedParams,
  onSubmitted,
}: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();
  const [term, setTerm] = useState(defaultValue);

  // Adjust during render rather than in an effect, so back/forward
  // navigation and a cleared `q` are reflected without an extra pass.
  const [lastDefault, setLastDefault] = useState(defaultValue);
  if (defaultValue !== lastDefault) {
    setLastDefault(defaultValue);
    setTerm(defaultValue);
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams(preservedParams ?? "");
    const trimmed = term.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    params.delete("page");

    const query = params.toString();
    router.push(query ? `/vehicles?${query}` : "/vehicles");
    onSubmitted?.();
  }

  const isHero = variant === "hero";

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn("relative flex w-full items-center", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search commercial vehicles
      </label>
      <Search
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-3.5 text-steel-400",
          isHero ? "size-5" : "size-4",
        )}
      />
      <input
        id={inputId}
        type="search"
        value={term}
        autoFocus={autoFocus}
        onChange={(event) => setTerm(event.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className={cn(
          "w-full rounded-md border border-steel-300 bg-white text-steel-900 transition-colors",
          "placeholder:text-steel-400",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
          // The native clear affordance clashes with our own button.
          "[&::-webkit-search-cancel-button]:hidden",
          isHero
            ? "h-14 pr-28 pl-11 text-base shadow-sm"
            : "h-11 pr-20 pl-10 text-sm",
        )}
      />

      {term && (
        <button
          type="button"
          onClick={() => setTerm("")}
          aria-label="Clear search"
          className={cn(
            "absolute grid place-items-center rounded-full text-steel-400 transition-colors hover:bg-steel-100 hover:text-steel-700",
            isHero ? "right-[6.5rem] size-8" : "right-[4.25rem] size-7",
          )}
        >
          <X className={isHero ? "size-4" : "size-3.5"} />
        </button>
      )}

      <button
        type="submit"
        className={cn(
          "absolute right-1.5 rounded-md bg-steel-900 font-semibold text-white transition-colors hover:bg-steel-800",
          isHero ? "h-11 px-5 text-sm" : "h-8 px-3 text-xs",
        )}
      >
        Search
      </button>
    </form>
  );
}
