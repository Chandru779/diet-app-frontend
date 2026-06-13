import type { DiscoverQueryParams } from "@/lib/types/meal-discover";

export const homeMealsQueryKey = ["home", "meals"] as const;
export const mealCategoriesQueryKey = ["feed", "meal-categories"] as const;

export const discoverRootKey = ["discover"] as const;
/** Cached per unique discover param set; identical params reuse the cache. */
export function discoverMealsQueryKey(params: DiscoverQueryParams) {
  return [...discoverRootKey, "meals", params] as const;
}
export function discoverCountQueryKey(params: DiscoverQueryParams) {
  return [...discoverRootKey, "count", params] as const;
}

export const myMealsRootKey = ["my-meals"] as const;
export function myMealsQueryKey(
  userId: string | null,
  username: string | null,
) {
  return [...myMealsRootKey, userId, username] as const;
}

export const savedMealsRootKey = ["saved-meals"] as const;
export const savedMealsQueryKey = [...savedMealsRootKey, "list"] as const;

export const mealCatalogRootKey = ["meal-catalog"] as const;
/** `search` is the trimmed query string (empty string = full bootstrap catalog). */
export function mealCatalogQueryKey(search: string) {
  return [...mealCatalogRootKey, search] as const;
}

export const mealPacksRootKey = ["meal-packs"] as const;
export const mealPacksListQueryKey = [...mealPacksRootKey, "list"] as const;
export function mealPackDetailQueryKey(id: string) {
  return [...mealPacksRootKey, "detail", id] as const;
}
