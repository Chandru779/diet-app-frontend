"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFavoriteMeals } from "@/lib/api/favorites";
import { USER_LIBRARY_STALE_MS } from "@/lib/query/constants";
import { savedMealsQueryKey } from "@/lib/query/query-keys";
import type { ApiMeal } from "@/lib/types/meal";

export function useSavedMeals() {
  return useQuery<ApiMeal[]>({
    queryKey: savedMealsQueryKey,
    queryFn: fetchFavoriteMeals,
    staleTime: USER_LIBRARY_STALE_MS,
    gcTime: USER_LIBRARY_STALE_MS,
  });
}
