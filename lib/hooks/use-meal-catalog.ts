"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMealCatalog } from "@/lib/api/meal";
import { MEAL_CATALOG_STALE_MS } from "@/lib/query/constants";
import { mealCatalogQueryKey } from "@/lib/query/query-keys";
import type { MealCatalogItem } from "@/lib/types/meal-catalog";

/**
 * Cached meal builder catalog.
 *
 * Each distinct (trimmed) search term is cached under its own key, so repeated
 * opens or repeated searches for the same term hit the cache instead of the
 * network, while a brand new search term still fetches fresh data.
 *
 * @param search Trimmed search term. Empty string = full bootstrap catalog.
 */
export function useMealCatalog(
  search: string,
  options?: { enabled?: boolean },
) {
  const normalized = search.trim();
  return useQuery<MealCatalogItem[]>({
    queryKey: mealCatalogQueryKey(normalized),
    queryFn: () => fetchMealCatalog(normalized || undefined),
    staleTime: MEAL_CATALOG_STALE_MS,
    gcTime: MEAL_CATALOG_STALE_MS,
    enabled: options?.enabled ?? true,
  });
}
