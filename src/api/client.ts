import pLimit from "p-limit";

export const BASE_URL = "https://api.transit.ls8h.com";

// Global concurrency cap. TanStack Query has no global limit, so we throttle at
// the fetch layer to stay polite to the unsanctioned public API (max 4 bursts).
const limit = pLimit(4);

export type ApiResponse<T> = {
  status: number;
  ok: boolean;
  data: T | null;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Low-level GET against the Transit API.
 *
 * - Funnels every call through the shared concurrency limiter.
 * - Retries at most once on network failure / 5xx, with a short backoff.
 * - Never throws on 4xx: returns the status so callers can branch (e.g. 422 =
 *   same endpoint, 404 = not found).
 */
export function apiGet<T>(
  path: string,
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<ApiResponse<T>> {
  const url = new URL(path, BASE_URL);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }

  return limit(async () => {
    let lastErr: unknown;
    for (let attempt = 0; attempt <= 1; attempt++) {
      try {
        const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
        // Retry once on transient server errors.
        if (res.status >= 500 && attempt === 0) {
          await sleep(400);
          continue;
        }
        const data = res.ok ? ((await res.json()) as T) : null;
        return { status: res.status, ok: res.ok, data };
      } catch (err) {
        if ((err as Error)?.name === "AbortError") throw err;
        lastErr = err;
        if (attempt === 0) {
          await sleep(400); // exponential-ish backoff before the single retry
          continue;
        }
      }
    }
    throw lastErr ?? new Error(`GET ${path} failed`);
  });
}
