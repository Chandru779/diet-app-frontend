import { http } from "./http";
import type {
  DiscoverQueryParams,
  DiscoverResult,
  MealCategoriesResponse,
} from "@/lib/types/meal-discover";

function toParams(
  query: DiscoverQueryParams,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  if (query.q) params.q = query.q;
  if (query.categories?.length) params.categories = query.categories.join(",");
  if (query.categoryGroup) params.categoryGroup = query.categoryGroup;
  if (query.mealType?.length) params.mealType = query.mealType.join(",");
  if (query.isVegetarian !== undefined)
    params.isVegetarian = query.isVegetarian;
  if (query.caloriesMin != null) params.caloriesMin = query.caloriesMin;
  if (query.caloriesMax != null) params.caloriesMax = query.caloriesMax;
  if (query.proteinMin != null) params.proteinMin = query.proteinMin;
  if (query.proteinMax != null) params.proteinMax = query.proteinMax;
  if (query.carbsMin != null) params.carbsMin = query.carbsMin;
  if (query.carbsMax != null) params.carbsMax = query.carbsMax;
  if (query.fatMin != null) params.fatMin = query.fatMin;
  if (query.fatMax != null) params.fatMax = query.fatMax;
  if (query.prepTimeMax != null) params.prepTimeMax = query.prepTimeMax;
  if (query.includeIngredients?.length) {
    params.includeIngredients = query.includeIngredients.join(",");
  }
  if (query.excludeIngredients?.length) {
    params.excludeIngredients = query.excludeIngredients.join(",");
  }
  if (query.isQuick) params.isQuick = true;
  if (query.isBeginnerFriendly) params.isBeginnerFriendly = true;
  if (query.isBudgetFriendly) params.isBudgetFriendly = true;
  if (query.sort) params.sort = query.sort;
  if (query.page != null) params.page = query.page;
  if (query.limit != null) params.limit = query.limit;
  if (query.publicOnly !== undefined) params.publicOnly = query.publicOnly;
  return params;
}

export async function fetchDiscoverMeals(
  query: DiscoverQueryParams = {},
): Promise<DiscoverResult> {
  const res = await http.get<DiscoverResult>("/meals/discover", {
    params: toParams({ publicOnly: true, limit: 20, ...query }),
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

export async function fetchDiscoverCount(
  query: DiscoverQueryParams = {},
): Promise<number> {
  const res = await http.get<{ total: number }>("/meals/discover/count", {
    params: toParams({ publicOnly: true, ...query }),
    headers: { "Cache-Control": "no-store" },
  });
  return res.data.total;
}

export async function fetchMealCategories(): Promise<MealCategoriesResponse> {
  const res = await http.get<MealCategoriesResponse>("/meals/categories", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
