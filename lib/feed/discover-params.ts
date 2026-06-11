import type { FeedAdvancedFilters } from "@/lib/config/feed-advanced-filters";
import { prepTimeToMax } from "@/lib/config/feed-advanced-filters";
import { MEAL_FEED_LIGHT_MAX_KCAL } from "@/lib/config/meal-feed-filters";
import type { DiscoverQueryParams } from "@/lib/types/meal-discover";
import type { MacroChipId, PrimaryCategoryId } from "@/lib/config/feed-ui";
import { FEED_DIET_CHIPS } from "@/lib/config/feed-advanced-filters";

export type FeedDiscoverState = {
  search: string;
  primaryCategory: PrimaryCategoryId | null;
  macroChips: MacroChipId[];
  sheetFilters: FeedAdvancedFilters;
};

export function hasActiveDiscoverState(state: FeedDiscoverState): boolean {
  if (state.search.trim()) return true;
  if (state.primaryCategory && state.primaryCategory !== "more") return true;
  if (state.macroChips.length) return true;
  const f = state.sheetFilters;
  if (f.category) return true;
  if (
    f.proteinMin != null ||
    f.proteinSliderMin != null ||
    f.proteinSliderMax != null
  ) {
    return true;
  }
  if (f.lightMeal) return true;
  if (f.sort !== "newest") return true;
  if (f.caloriesMin != null || f.caloriesMax != null) return true;
  if (f.carbsMin != null || f.carbsMax != null) return true;
  if (f.fatMin != null || f.fatMax != null) return true;
  if (f.mealTypes?.length) return true;
  if (f.dietChips?.length) return true;
  if (f.prepTimePreset != null) return true;
  if (f.includeIngredients?.length) return true;
  if (f.excludeIngredients?.length) return true;
  if (f.isQuick) return true;
  if (f.isBeginnerFriendly) return true;
  if (f.isBudgetFriendly) return true;
  if (f.categorySlugs?.length) return true;
  return false;
}

export function buildDiscoverParams(
  state: FeedDiscoverState,
): DiscoverQueryParams {
  const categories: string[] = [
    ...state.macroChips.map((id) => {
      const map: Record<MacroChipId, string> = {
        "protein-30g-plus": "protein-30g-plus",
        "low-carb": "low-carb",
        keto: "keto",
        "gluten-free": "gluten-free",
        "dairy-free": "dairy-free",
      };
      return map[id];
    }),
    ...(state.sheetFilters.categorySlugs ?? []),
  ];

  for (const diet of state.sheetFilters.dietChips ?? []) {
    const chip = FEED_DIET_CHIPS.find((c) => c.id === diet);
    if (chip?.slug) categories.push(chip.slug);
  }

  if (state.primaryCategory && state.primaryCategory !== "more") {
    categories.push(state.primaryCategory);
  }

  const params: DiscoverQueryParams = {
    q: state.search.trim() || undefined,
    categories: categories.length ? [...new Set(categories)] : undefined,
    mealType: state.sheetFilters.mealTypes?.length
      ? state.sheetFilters.mealTypes
      : undefined,
    sort:
      state.sheetFilters.sort === "protein"
        ? "protein"
        : state.sheetFilters.sort === "calories-low"
          ? "calories"
          : state.primaryCategory === "popular"
            ? "popular"
            : "newest",
    publicOnly: true,
    limit: 30,
    page: 1,
    caloriesMin: state.sheetFilters.caloriesMin,
    caloriesMax:
      state.sheetFilters.caloriesMax ??
      (state.sheetFilters.lightMeal ? MEAL_FEED_LIGHT_MAX_KCAL : undefined),
    proteinMin:
      state.sheetFilters.proteinSliderMin ?? state.sheetFilters.proteinMin,
    proteinMax: state.sheetFilters.proteinSliderMax,
    carbsMin: state.sheetFilters.carbsMin,
    carbsMax: state.sheetFilters.carbsMax,
    fatMin: state.sheetFilters.fatMin,
    fatMax: state.sheetFilters.fatMax,
    prepTimeMax: state.sheetFilters.prepTimePreset
      ? prepTimeToMax(state.sheetFilters.prepTimePreset)
      : undefined,
    includeIngredients: state.sheetFilters.includeIngredients,
    excludeIngredients: state.sheetFilters.excludeIngredients,
    isQuick: state.sheetFilters.isQuick,
    isBeginnerFriendly: state.sheetFilters.isBeginnerFriendly,
    isBudgetFriendly: state.sheetFilters.isBudgetFriendly,
  };

  if (state.sheetFilters.category === "veg") {
    params.isVegetarian = true;
  } else if (state.sheetFilters.category === "non-veg") {
    params.isVegetarian = false;
  }

  const hasVeg = state.sheetFilters.dietChips?.includes("vegetarian");
  const hasVegan = state.sheetFilters.dietChips?.includes("vegan");
  const hasNonVeg = state.sheetFilters.dietChips?.includes("non-veg");
  if (hasVegan || hasVeg) params.isVegetarian = true;
  if (hasNonVeg && !hasVeg && !hasVegan) params.isVegetarian = false;

  return params;
}
