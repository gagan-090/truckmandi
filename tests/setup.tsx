import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { getSessionUser, setSessionUser } from "./session-mock";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  setSessionUser(null);
});

/**
 * next/image needs a plain <img> in jsdom. Next-only props are dropped so
 * React does not warn about unknown DOM attributes; `loading` is kept
 * because tests assert on lazy versus eager loading.
 */
const NEXT_ONLY_PROPS = new Set([
  "fill",
  "priority",
  "blurDataURL",
  "placeholder",
  "unoptimized",
  "quality",
  "sizes",
  "fetchPriority",
]);

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: Record<string, unknown> & { src: string; alt: string }) => {
    const domProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !NEXT_ONLY_PROPS.has(key)),
    );
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...(domProps as { src: string })} />;
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// The session provider fetches on mount; answer it so tests do not hit the
// network or settle on "signed out" mid-assertion.
const realFetch = globalThis.fetch;
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === "string" ? input : input.toString();
  if (url.includes("/api/auth/session")) {
    return Promise.resolve(
      new Response(JSON.stringify({ user: getSessionUser() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
  return realFetch(input as RequestInfo, init);
}) as typeof fetch;
