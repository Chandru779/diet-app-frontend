"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMealPacks, type MealPackSummary } from "@/lib/api/meal-packs";
import { USER_LIBRARY_STALE_MS } from "@/lib/query/constants";
import { mealPacksListQueryKey } from "@/lib/query/query-keys";

export function useMealPacks() {
  return useQuery<MealPackSummary[]>({
    queryKey: mealPacksListQueryKey,
    queryFn: fetchMealPacks,
    staleTime: USER_LIBRARY_STALE_MS,
    gcTime: USER_LIBRARY_STALE_MS,
  });
}
