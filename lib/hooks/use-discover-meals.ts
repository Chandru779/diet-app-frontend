"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { fetchDiscoverMeals } from "@/lib/api/discover";
import { DISCOVER_STALE_MS } from "@/lib/query/constants";
import { discoverMealsQueryKey } from "@/lib/query/query-keys";
import type {
  DiscoverQueryParams,
  DiscoverResult,
} from "@/lib/types/meal-discover";

/**
 * Cached feed discover results.
 *
 * Each unique search/filter combination is cached under its own key, so
 * repeating the same query (e.g. toggling a filter back) is served from cache.
 * `keepPreviousData` keeps the current results on screen while the next query
 * loads, enabling a smooth "refreshing" indicator instead of a blank screen.
 */
export function useDiscoverMeals(
  params: DiscoverQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery<DiscoverResult>({
    queryKey: discoverMealsQueryKey(params),
    queryFn: () => fetchDiscoverMeals(params),
    enabled: options?.enabled ?? true,
    staleTime: DISCOVER_STALE_MS,
    gcTime: DISCOVER_STALE_MS,
    placeholderData: keepPreviousData,
  });
}

/**
 * Paginated feed discover results for infinite scroll.
 *
 * Pages accumulate under a single cache key (the filter set), so scrolling
 * fetches the next page and changing the search/filters starts a fresh paged
 * query. `keepPreviousData` keeps the current results visible while the next
 * filter set loads.
 */
export function useInfiniteDiscoverMeals(
  params: DiscoverQueryParams,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: discoverMealsQueryKey(params),
    queryFn: ({ pageParam }) =>
      fetchDiscoverMeals({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    enabled: options?.enabled ?? true,
    staleTime: DISCOVER_STALE_MS,
    gcTime: DISCOVER_STALE_MS,
    placeholderData: keepPreviousData,
  });
}
