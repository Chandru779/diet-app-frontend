import type { MealType } from "@/lib/types/meal";
import {
  DEFAULT_MEAL_FEED_FILTERS,
  parseMealFeedFilters,
  mealFeedFiltersToSearchParams,
  type MealFeedFilters,
} from "@/lib/config/meal-feed-filters";

export type PrepTimePreset = 15 | 30 | 60 | 999;

export type DietChipId =
  | "vegetarian"
  | "vegan"
  | "non-veg"
  | "keto"
  | "paleo"
  | "mediterranean";

export type FeedAdvancedFilters = MealFeedFilters & {
  caloriesMin?: number;
  caloriesMax?: number;
  proteinSliderMin?: number;
  proteinSliderMax?: number;
  carbsMin?: number;
  carbsMax?: number;
  fatMin?: number;
  fatMax?: number;
  mealTypes?: MealType[];
  dietChips?: DietChipId[];
  prepTimePreset?: PrepTimePreset;
  includeIngredients?: string[];
  excludeIngredients?: string[];
  isQuick?: boolean;
  isBeginnerFriendly?: boolean;
  isBudgetFriendly?: boolean;
  /** Extra category slugs from “More” sheet */
  categorySlugs?: string[];
};

export const DEFAULT_FEED_ADVANCED_FILTERS: FeedAdvancedFilters = {
  ...DEFAULT_MEAL_FEED_FILTERS,
};

export const FEED_CALORIE_RANGE = { min: 0, max: 1500 } as const;
export const FEED_PROTEIN_RANGE = { min: 0, max: 120 } as const;
export const FEED_CARBS_RANGE = { min: 0, max: 200 } as const;
export const FEED_FAT_RANGE = { min: 0, max: 100 } as const;

export const FEED_MEAL_TYPE_OPTIONS: {
  value: MealType;
  label: string;
  emoji: string;
}[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch", label: "Lunch", emoji: "☀️" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snack", label: "Snack", emoji: "🍎" },
];

export const FEED_DIET_CHIPS: { id: DietChipId; label: string; slug?: string }[] =
  [
    { id: "vegetarian", label: "Vegetarian", slug: "vegetarian" },
    { id: "vegan", label: "Vegan", slug: "vegan" },
    { id: "non-veg", label: "Non-Veg" },
    { id: "keto", label: "Keto", slug: "keto" },
    { id: "paleo", label: "Paleo", slug: "paleo" },
    { id: "mediterranean", label: "Mediterranean", slug: "mediterranean" },
  ];

export const FEED_PREP_TIME_OPTIONS: {
  value: PrepTimePreset;
  label: string;
}[] = [
  { value: 15, label: "< 15 min" },
  { value: 30, label: "15–30 min" },
  { value: 60, label: "30–60 min" },
  { value: 999, label: "> 60 min" },
];

function parseNum(value: string | null): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function parseList(value: string | null): string[] | undefined {
  if (!value?.trim()) return undefined;
  const items = value.split(",").map((s) => s.trim()).filter(Boolean);
  return items.length ? items : undefined;
}

export function parseFeedAdvancedFilters(
  params: Pick<URLSearchParams, "get">,
): FeedAdvancedFilters {
  const base = parseMealFeedFilters(params);
  const mealTypes = parseList(params.get("mealType")) as MealType[] | undefined;
  const dietChips = parseList(params.get("diet")) as DietChipId[] | undefined;
  const prep = parseNum(params.get("prepTime"));
  const categorySlugs = parseList(params.get("cat"));

  return {
    ...base,
    caloriesMin: parseNum(params.get("calMin")),
    caloriesMax: parseNum(params.get("calMax")),
    proteinSliderMin: parseNum(params.get("proteinSliderMin")),
    proteinSliderMax: parseNum(params.get("proteinSliderMax")),
    carbsMin: parseNum(params.get("carbsMin")),
    carbsMax: parseNum(params.get("carbsMax")),
    fatMin: parseNum(params.get("fatMin")),
    fatMax: parseNum(params.get("fatMax")),
    mealTypes,
    dietChips,
    prepTimePreset: prep as PrepTimePreset | undefined,
    includeIngredients: parseList(params.get("include")),
    excludeIngredients: parseList(params.get("exclude")),
    isQuick: params.get("quick") === "1",
    isBeginnerFriendly: params.get("beginner") === "1",
    isBudgetFriendly: params.get("budget") === "1",
    categorySlugs,
  };
}

export function feedAdvancedFiltersToSearchParams(
  filters: FeedAdvancedFilters,
): URLSearchParams {
  const next = mealFeedFiltersToSearchParams(filters);

  if (filters.caloriesMin != null) next.set("calMin", String(filters.caloriesMin));
  if (filters.caloriesMax != null) next.set("calMax", String(filters.caloriesMax));
  if (filters.proteinSliderMin != null) {
    next.set("proteinSliderMin", String(filters.proteinSliderMin));
  }
  if (filters.proteinSliderMax != null) {
    next.set("proteinSliderMax", String(filters.proteinSliderMax));
  }
  if (filters.carbsMin != null) next.set("carbsMin", String(filters.carbsMin));
  if (filters.carbsMax != null) next.set("carbsMax", String(filters.carbsMax));
  if (filters.fatMin != null) next.set("fatMin", String(filters.fatMin));
  if (filters.fatMax != null) next.set("fatMax", String(filters.fatMax));
  if (filters.mealTypes?.length) next.set("mealType", filters.mealTypes.join(","));
  if (filters.dietChips?.length) next.set("diet", filters.dietChips.join(","));
  if (filters.prepTimePreset != null) {
    next.set("prepTime", String(filters.prepTimePreset));
  }
  if (filters.includeIngredients?.length) {
    next.set("include", filters.includeIngredients.join(","));
  }
  if (filters.excludeIngredients?.length) {
    next.set("exclude", filters.excludeIngredients.join(","));
  }
  if (filters.isQuick) next.set("quick", "1");
  if (filters.isBeginnerFriendly) next.set("beginner", "1");
  if (filters.isBudgetFriendly) next.set("budget", "1");
  if (filters.categorySlugs?.length) next.set("cat", filters.categorySlugs.join(","));

  return next;
}

export function countFeedAdvancedFilters(filters: FeedAdvancedFilters): number {
  let n = 0;
  if (filters.sort !== "newest") n += 1;
  if (filters.category) n += 1;
  if (filters.proteinMin != null) n += 1;
  if (filters.lightMeal) n += 1;
  if (filters.caloriesMin != null || filters.caloriesMax != null) n += 1;
  if (filters.proteinSliderMin != null || filters.proteinSliderMax != null) n += 1;
  if (filters.carbsMin != null || filters.carbsMax != null) n += 1;
  if (filters.fatMin != null || filters.fatMax != null) n += 1;
  if (filters.mealTypes?.length) n += 1;
  if (filters.dietChips?.length) n += filters.dietChips.length;
  if (filters.prepTimePreset != null) n += 1;
  if (filters.includeIngredients?.length) n += 1;
  if (filters.excludeIngredients?.length) n += 1;
  if (filters.isQuick) n += 1;
  if (filters.isBeginnerFriendly) n += 1;
  if (filters.isBudgetFriendly) n += 1;
  if (filters.categorySlugs?.length) n += filters.categorySlugs.length;
  return n;
}

export function prepTimeToMax(preset: PrepTimePreset): number {
  if (preset === 999) return 999;
  return preset;
}
