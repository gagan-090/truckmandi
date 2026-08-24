import { ApiError } from "./errors";

/**
 * Browser-side API client. Only ever sees `NEXT_PUBLIC_API_URL`; server
 * credentials live in `lib/api/server.ts` and never reach this module.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  searchParams?: URLSearchParams | Record<string, string>;
}

function resolveUrl(
  path: string,
  searchParams: RequestOptions["searchParams"],
): string {
  const url = `${BASE_URL.replace(/\/$/, "")}${path}`;
  if (!searchParams) return url;
  const params =
    searchParams instanceof URLSearchParams
      ? searchParams
      : new URLSearchParams(searchParams);
  const suffix = params.toString();
  return suffix ? `${url}?${suffix}` : url;
}

export async function apiFetch<T>(
  path: string,
  { body, searchParams, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const url = resolveUrl(path, searchParams);

  const apiKey =
    process.env.NEXT_PUBLIC_API_SERVER_TOKEN ||
    "e732d462a159c20d0c17d4ba38891a076baf2bc5c087fd0c9b2c60f98de32746e89624b49b0714b48701b9bb6c2428a1fe6599cdd6e4f2dc425a44df7d2e8c4a";

  if (!BASE_URL || process.env.NEXT_PUBLIC_STANDALONE_MODE === "true") {
    throw new ApiError("Standalone mode active or NEXT_PUBLIC_API_URL not configured", 503, url);
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "X-API-KEY": apiKey,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Session cookie is issued by Laravel Sanctum on the same parent domain.
    credentials: "include",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => undefined);
    throw new ApiError(
      `Request to ${path} failed with ${response.status}`,
      response.status,
      url,
      payload,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};
