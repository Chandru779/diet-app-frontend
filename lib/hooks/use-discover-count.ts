"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDiscoverCount } from "@/lib/api/discover";
import { DISCOVER_STALE_MS } from "@/lib/query/constants";
import { discoverCountQueryKey } from "@/lib/query/query-keys";
import type { DiscoverQueryParams } from "@/lib/types/meal-discover";

/**
 * Cached result count for the filter sheet preview.
 *
 * Shares the same per-param caching strategy as {@link useDiscoverMeals}.
 */
export function useDiscoverCount(
  params: DiscoverQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery<number>({
    queryKey: discoverCountQueryKey(params),
    queryFn: () => fetchDiscoverCount(params),
    enabled: options?.enabled ?? true,
    staleTime: DISCOVER_STALE_MS,
    gcTime: DISCOVER_STALE_MS,
    placeholderData: keepPreviousData,
  });
}
