type CacheEntry = {
  expires: number;
  value: unknown;
};

const globalCache = globalThis as typeof globalThis & {
  wcQueryCache?: Map<string, CacheEntry>;
  wcQueryInflight?: Map<string, Promise<unknown>>;
};

const store = globalCache.wcQueryCache ?? new Map<string, CacheEntry>();
const inflight = globalCache.wcQueryInflight ?? new Map<string, Promise<unknown>>();
globalCache.wcQueryCache = store;
globalCache.wcQueryInflight = inflight;

export const CATALOG_CACHE_TTL = 45_000;
export const ADMIN_CACHE_TTL = 20_000;

export async function withCache<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.value as T;
  }

  const pending = inflight.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = load()
    .then((value) => {
      store.set(key, { value, expires: Date.now() + ttlMs });
      inflight.delete(key);
      return value;
    })
    .catch((error) => {
      inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
}

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    store.clear();
    inflight.clear();
    return;
  }

  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(prefix)) {
      inflight.delete(key);
    }
  }
}

export function catalogProductsCacheKey(input: {
  q?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}) {
  return `catalog:products:${input.q ?? ""}:${input.categoryId ?? ""}:${input.page ?? 1}:${input.limit ?? 20}`;
}
