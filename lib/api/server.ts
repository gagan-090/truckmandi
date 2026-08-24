import "server-only";
import { ApiError } from "./errors";

/**
 * Server-side API client. Reads the private `API_URL` and attaches the
 * server token, so neither can leak into a client bundle — the
 * `server-only` import makes an accidental client import a build error.
 */

const BASE_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "");

export interface ServerRequestOptions {
  searchParams?: URLSearchParams | Record<string, string>;
  body?: unknown;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  /** Seconds. Omit for the route's default caching behaviour. */
  revalidate?: number | false;
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  {
    searchParams,
    body,
    method = "GET",
    headers,
    revalidate,
    tags,
  }: ServerRequestOptions = {},
): Promise<T> {
  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : searchParams
        ? new URLSearchParams(searchParams)
        : undefined;
  const suffix = params?.toString();
  const url = `${BASE_URL}${path}${suffix ? `?${suffix}` : ""}`;

  const apiKey =
    process.env.API_SERVER_TOKEN ||
    "e732d462a159c20d0c17d4ba38891a076baf2bc5c087fd0c9b2c60f98de32746e89624b49b0714b48701b9bb6c2428a1fe6599cdd6e4f2dc425a44df7d2e8c4a";

  if (!BASE_URL || process.env.STANDALONE_MODE === "true") {
    throw new ApiError("Standalone mode active or API_URL not configured", 503, url);
  }

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(2500),
    next: {
      ...(revalidate !== undefined ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw new ApiError(
      `Server request to ${path} failed with ${response.status}`,
      response.status,
      url,
      payload,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
