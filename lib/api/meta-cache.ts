/** Shared cache headers for read-only meta / facts API routes. */
export const META_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
} as const;
