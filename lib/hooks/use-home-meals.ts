"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHomeMealsClient } from "@/lib/api/home-meals";
import { HOME_MEALS_STALE_MS } from "@/lib/query/constants";
import { homeMealsQueryKey } from "@/lib/query/query-keys";
import type { ApiMeal } from "@/lib/types/meal";

export function useHomeMeals() {
  return useQuery<ApiMeal[]>({
    queryKey: homeMealsQueryKey,
    queryFn: fetchHomeMealsClient,
    staleTime: HOME_MEALS_STALE_MS,
    gcTime: HOME_MEALS_STALE_MS,
  });
}
