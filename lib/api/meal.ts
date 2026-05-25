import { http } from "./http";
import type { MealCatalogItem } from "@/lib/types/meal-catalog";
import type { MealFilterCategory } from "@/lib/types/meal-filter";
import type { ApiMeal, MealPreparationStep, MealType } from "@/lib/types/meal";

// ── Read endpoints ───────────────────────────────────────────────────────────

/**
 * GET /meals
 * Axios interceptor unwraps `{ statusCode, message, data }` automatically.
 */
export async function fetchMeals(): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>("/meals", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

/** GET /meals/filter?category=veg|non-veg */
export async function fetchFilteredMeals(
  category: MealFilterCategory,
): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>("/meals/filter", {
    params: { category },
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

/** GET /meals/user/:userId — meals belonging to a user identified by UUID. */
export async function fetchMealsByUserId(userId: string): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>(`/meals/user/${userId}`, {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

/** GET /meals/user/by-username/:username — fallback when UUID is unavailable. */
export async function fetchMealsByUsername(username: string): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>(
    `/meals/user/by-username/${encodeURIComponent(username)}`,
    { headers: { "Cache-Control": "no-store" } },
  );
  return res.data;
}


/** GET /meals/catalog — reference ingredients for meal builder. */
export async function fetchMealCatalog(search?: string): Promise<MealCatalogItem[]> {
  const params =
    search != null && search.trim().length > 0 ? { q: search.trim() } : {};
  const res = await http.get<MealCatalogItem[]>("/meals/catalog", {
    params,
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

export async function fetchMealById(id: string): Promise<ApiMeal> {
  // Some backend versions accidentally return `{ data: {} }` for /meals/:id
  // (promise not awaited in controller). If we don't have an id, fall back
  // to fetching the list and selecting by id.
  const res = await http.get<ApiMeal>(`/meals/${id}`, { headers: { "Cache-Control": "no-store" } });
  const meal = res.data;
  if (!meal || typeof meal !== "object" || !("id" in meal)) {
    const list = await fetchMeals();
    const found = list.find((m) => m.id === id);
    if (!found) {
      throw new Error(`Meal ${id} not found`);
    }
    return found;
  }

  return meal;
}

// ── Write endpoints ──────────────────────────────────────────────────────────

export type CreateIngredientPayload = {
  catalogItemKey: string;
  quantity: number;
  quantityUnit: "grams" | "count" | "ml";
};

export type CreateMealPayload = {
  title: string;
  slug?: string;
  mealType?: MealType;
  isPublic?: boolean;
  aiSummary?: string;
  tags?: string[];
  description?: string;
  isVegetarian?: boolean;
  /** HTTPS URL or `data:image/...;base64,...` from a local file pick. */
  image?: string | null;
  ingredients?: CreateIngredientPayload[];
  preparationSteps?: MealPreparationStep[];
};

/** PATCH /meals/:id — partial update; `null` clears nullable fields. Owner only. */
export type UpdateMealPayload = {
  title?: string;
  slug?: string | null;
  mealType?: MealType | null;
  isPublic?: boolean;
  aiSummary?: string | null;
  tags?: string[];
  description?: string | null;
  isVegetarian?: boolean;
  notes?: string | null;
  image?: string | null;
  preparationSteps?: MealPreparationStep[] | null;
  ingredients?: CreateIngredientPayload[];
};

/**
 * POST /meals — requires a Bearer token (from session cookie via `http` interceptor).
 */
export async function createMeal(
  payload: CreateMealPayload,
): Promise<ApiMeal> {
  const res = await http.post<ApiMeal>("/meals", payload);
  return res.data;
}

/**
 * PATCH /meals/:id — requires Bearer token; only the meal owner can update.
 */
export async function updateMeal(
  id: string,
  payload: UpdateMealPayload,
): Promise<ApiMeal> {
  const res = await http.patch<ApiMeal>(`/meals/${id}`, payload);
  return res.data;
}
