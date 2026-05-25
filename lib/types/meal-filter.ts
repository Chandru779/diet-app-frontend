/** Matches backend `MEAL_FILTER_CATEGORIES` / GET /meals/filter?category= */
export const MEAL_FILTER_CATEGORIES = ["veg", "non-veg"] as const;

export type MealFilterCategory = (typeof MEAL_FILTER_CATEGORIES)[number];

export function parseMealFilterCategory(
  value: string | null | undefined,
): MealFilterCategory | undefined {
  if (value === "veg" || value === "non-veg") return value;
  return undefined;
}

export function mealFilterLabel(category: MealFilterCategory): string {
  return category === "veg" ? "Veg meals" : "Non-veg meals";
}
