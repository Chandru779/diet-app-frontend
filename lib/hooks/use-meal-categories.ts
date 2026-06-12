"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMealCategories } from "@/lib/api/discover";
import { MEAL_CATEGORIES_STALE_MS } from "@/lib/query/constants";
import { mealCategoriesQueryKey } from "@/lib/query/query-keys";
import type { MealCategoriesResponse } from "@/lib/types/meal-discover";

export function useMealCategories() {
  return useQuery<MealCategoriesResponse>({
    queryKey: mealCategoriesQueryKey,
    queryFn: fetchMealCategories,
    staleTime: MEAL_CATEGORIES_STALE_MS,
    gcTime: MEAL_CATEGORIES_STALE_MS,
  });
}
