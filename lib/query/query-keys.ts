export const homeMealsQueryKey = ["home", "meals"] as const;
export const mealCategoriesQueryKey = ["feed", "meal-categories"] as const;

export const myMealsRootKey = ["my-meals"] as const;
export function myMealsQueryKey(
  userId: string | null,
  username: string | null,
) {
  return [...myMealsRootKey, userId, username] as const;
}

export const savedMealsRootKey = ["saved-meals"] as const;
export const savedMealsQueryKey = [...savedMealsRootKey, "list"] as const;

export const mealPacksRootKey = ["meal-packs"] as const;
export const mealPacksListQueryKey = [...mealPacksRootKey, "list"] as const;
export function mealPackDetailQueryKey(id: string) {
  return [...mealPacksRootKey, "detail", id] as const;
}
