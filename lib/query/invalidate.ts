import type { QueryClient } from "@tanstack/react-query";
import {
  mealPackDetailQueryKey,
  mealPacksRootKey,
  myMealsRootKey,
  savedMealsRootKey,
} from "@/lib/query/query-keys";

/** Refetch My Meals after create/update/delete meal mutations. */
export function invalidateMyMeals(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: myMealsRootKey });
}

/** Refetch Saved after favorite toggle mutations. */
export function invalidateSavedMeals(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: savedMealsRootKey });
}

/** Refetch pack list (and optional detail) after pack mutations. */
export function invalidateMealPacks(
  queryClient: QueryClient,
  packId?: string,
) {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: mealPacksRootKey }),
  ];
  if (packId) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: mealPackDetailQueryKey(packId),
      }),
    );
  }
  return Promise.all(tasks);
}
