import { Clock, Drumstick, Flame, Leaf, TrendingDown, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ApiMeal } from "@/lib/types/meal";
import {
  type MealFilterCategory,
  mealFilterLabel,
  parseMealFilterCategory,
} from "@/lib/types/meal-filter";

/** Client-side sort (URL: ?sort=) — mainly in bottom sheet */
export const MEAL_FEED_SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
    description: "Recently logged meals",
    icon: Clock,
  },
  {
    value: "protein",
    label: "Most protein",
    description: "Highest protein on top",
    icon: Zap,
  },
  {
    value: "calories-low",
    label: "Lightest",
    description: "Lowest calories first",
    icon: TrendingDown,
  },
] as const;

export type MealFeedSort = (typeof MEAL_FEED_SORT_OPTIONS)[number]["value"];
export const DEFAULT_MEAL_FEED_SORT: MealFeedSort = "newest";

/** Protein floor options — one active at a time (URL: ?proteinMin=) */
export const MEAL_FEED_PROTEIN_MIN_OPTIONS = [
  { value: 25, label: "25g+", chipLabel: "25g+ protein" },
  { value: 50, label: "50g+", chipLabel: "50g+ protein" },
  { value: 75, label: "75g+", chipLabel: "75g+ protein" },
] as const;

export type MealFeedProteinMin =
  (typeof MEAL_FEED_PROTEIN_MIN_OPTIONS)[number]["value"];

const PROTEIN_MIN_SET = new Set<number>(
  MEAL_FEED_PROTEIN_MIN_OPTIONS.map((o) => o.value),
);

export const MEAL_FEED_LIGHT_MAX_KCAL = 500;

export type MealFeedQuickChipId =
  | "veg"
  | "non-veg"
  | "protein-25"
  | "protein-50"
  | "light";

export type MealFeedQuickChip = {
  id: MealFeedQuickChipId;
  label: string;
  icon?: LucideIcon;
  /** Tailwind accent for selected state */
  activeClass: string;
  inactiveClass: string;
};

/** One-tap filters shown outside (Zomato-style suggested filters rail) */
export const MEAL_FEED_QUICK_CHIPS: MealFeedQuickChip[] = [
  {
    id: "veg",
    label: "Veg",
    icon: Leaf,
    activeClass: "border-emerald-300 bg-emerald-500 text-white shadow-sm",
    inactiveClass:
      "border-emerald-200/80 bg-white text-emerald-800 hover:bg-emerald-50",
  },
  {
    id: "non-veg",
    label: "Non-veg",
    icon: Drumstick,
    activeClass: "border-orange-300 bg-orange-500 text-white shadow-sm",
    inactiveClass:
      "border-orange-200/80 bg-white text-orange-800 hover:bg-orange-50",
  },
  {
    id: "protein-25",
    label: "25g+",
    activeClass: "border-amber-300 bg-amber-500 text-white shadow-sm",
    inactiveClass:
      "border-amber-200/80 bg-white text-amber-800 hover:bg-amber-50",
  },
  {
    id: "protein-50",
    label: "50g+",
    activeClass: "border-amber-400 bg-amber-600 text-white shadow-sm",
    inactiveClass:
      "border-amber-200/80 bg-white text-amber-900 hover:bg-amber-50",
  },
  {
    id: "light",
    label: "Light",
    icon: Flame,
    activeClass: "border-sky-300 bg-sky-500 text-white shadow-sm",
    inactiveClass: "border-sky-200/80 bg-white text-sky-800 hover:bg-sky-50",
  },
];

export type MealFeedFilters = {
  category?: MealFilterCategory;
  sort: MealFeedSort;
  proteinMin?: MealFeedProteinMin;
  lightMeal?: boolean;
};

export const DEFAULT_MEAL_FEED_FILTERS: MealFeedFilters = {
  sort: DEFAULT_MEAL_FEED_SORT,
};

export function parseMealFeedSort(
  value: string | null | undefined,
): MealFeedSort {
  if (value === "protein" || value === "calories-low") return value;
  return DEFAULT_MEAL_FEED_SORT;
}

export function parseMealFeedProteinMin(
  value: string | null | undefined,
): MealFeedProteinMin | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value);
  if (PROTEIN_MIN_SET.has(n)) return n as MealFeedProteinMin;
  return undefined;
}

export function parseMealFeedFilters(
  params: Pick<URLSearchParams, "get">,
): MealFeedFilters {
  const light = params.get("light");
  return {
    category: parseMealFilterCategory(params.get("category")),
    sort: parseMealFeedSort(params.get("sort")),
    proteinMin: parseMealFeedProteinMin(params.get("proteinMin")),
    lightMeal: light === "1" || light === "true",
  };
}

export function mealFeedFiltersToSearchParams(
  filters: MealFeedFilters,
): URLSearchParams {
  const next = new URLSearchParams();
  if (filters.category) next.set("category", filters.category);
  if (filters.sort !== DEFAULT_MEAL_FEED_SORT) next.set("sort", filters.sort);
  if (filters.proteinMin != null) {
    next.set("proteinMin", String(filters.proteinMin));
  }
  if (filters.lightMeal) next.set("light", "1");
  return next;
}

export function countActiveMealFeedFilters(filters: MealFeedFilters): number {
  let n = 0;
  if (filters.category) n += 1;
  if (filters.proteinMin != null) n += 1;
  if (filters.lightMeal) n += 1;
  if (filters.sort !== DEFAULT_MEAL_FEED_SORT) n += 1;
  return n;
}

/** Badge on the “Filters” button — sort + sheet-only protein tier (chips show the rest). */
export function countMealFeedSheetFilters(filters: MealFeedFilters): number {
  let n = 0;
  if (filters.sort !== DEFAULT_MEAL_FEED_SORT) n += 1;
  if (filters.proteinMin === 75) n += 1;
  return n;
}

export function isMealFeedQuickChipActive(
  filters: MealFeedFilters,
  chipId: MealFeedQuickChipId,
): boolean {
  switch (chipId) {
    case "veg":
      return filters.category === "veg";
    case "non-veg":
      return filters.category === "non-veg";
    case "protein-25":
      return filters.proteinMin === 25;
    case "protein-50":
      return filters.proteinMin === 50;
    case "light":
      return Boolean(filters.lightMeal);
    default:
      return false;
  }
}

/** Toggle a quick chip — instant apply, no sheet required */
export function toggleMealFeedQuickChip(
  filters: MealFeedFilters,
  chipId: MealFeedQuickChipId,
): MealFeedFilters {
  switch (chipId) {
    case "veg":
      return {
        ...filters,
        category: filters.category === "veg" ? undefined : "veg",
      };
    case "non-veg":
      return {
        ...filters,
        category: filters.category === "non-veg" ? undefined : "non-veg",
      };
    case "protein-25":
      return {
        ...filters,
        proteinMin: filters.proteinMin === 25 ? undefined : 25,
      };
    case "protein-50":
      return {
        ...filters,
        proteinMin: filters.proteinMin === 50 ? undefined : 50,
      };
    case "light":
      return { ...filters, lightMeal: !filters.lightMeal };
    default:
      return filters;
  }
}

export function mealMatchesProteinMin(
  meal: ApiMeal,
  proteinMin: MealFeedProteinMin,
): boolean {
  return meal.proteinG >= proteinMin;
}

export function mealMatchesLightMeal(meal: ApiMeal): boolean {
  return meal.caloriesKcal > 0 && meal.caloriesKcal <= MEAL_FEED_LIGHT_MAX_KCAL;
}

export function applyMealFeedClientFilters(
  meals: ApiMeal[],
  filters: Pick<MealFeedFilters, "sort" | "proteinMin" | "lightMeal">,
): ApiMeal[] {
  let rows = meals;
  if (filters.proteinMin != null) {
    rows = rows.filter((m) => mealMatchesProteinMin(m, filters.proteinMin!));
  }
  if (filters.lightMeal) {
    rows = rows.filter(mealMatchesLightMeal);
  }
  return sortMealsByFeedOption(rows, filters.sort);
}

export function sortMealsByFeedOption(
  meals: ApiMeal[],
  sort: MealFeedSort,
): ApiMeal[] {
  const copy = [...meals];
  switch (sort) {
    case "protein":
      return copy.sort((a, b) => b.proteinG - a.proteinG);
    case "calories-low":
      return copy.sort((a, b) => a.caloriesKcal - b.caloriesKcal);
    case "newest":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function hasMealFeedClientFilters(filters: MealFeedFilters): boolean {
  return (
    filters.proteinMin != null ||
    Boolean(filters.lightMeal) ||
    filters.sort !== DEFAULT_MEAL_FEED_SORT
  );
}

export function mealFeedFiltersSummary(filters: MealFeedFilters): string {
  const parts: string[] = [];
  if (filters.category) parts.push(mealFilterLabel(filters.category));
  if (filters.proteinMin != null) {
    const opt = MEAL_FEED_PROTEIN_MIN_OPTIONS.find(
      (o) => o.value === filters.proteinMin,
    );
    parts.push(opt?.chipLabel ?? `${filters.proteinMin}g+ protein`);
  }
  if (filters.lightMeal) parts.push("Light meals");
  return parts.length > 0 ? parts.join(" · ") : "All meals";
}

export function proteinMinLabel(value: MealFeedProteinMin): string {
  return (
    MEAL_FEED_PROTEIN_MIN_OPTIONS.find((o) => o.value === value)?.label ??
    `${value}g+`
  );
}
