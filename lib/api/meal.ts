import { http } from "./http";
import type { MealCatalogItem } from "@/lib/types/meal-catalog";
import type { ApiMeal, ApiUser } from "@/lib/types/meal";

// ── Read endpoints ───────────────────────────────────────────────────────────

/**
 * GET /meals
 * Axios interceptor unwraps `{ statusCode, message, data }` automatically.
 */
export async function fetchMeals(): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>("/meals", { headers: { "Cache-Control": "no-store" } });
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

export function fetchUsers(): Promise<ApiUser[]> {
  return http.get<ApiUser[]>("/users", { headers: { "Cache-Control": "no-store" } }).then(r => r.data);
}

// ── Write endpoints ──────────────────────────────────────────────────────────

export type CreateIngredientPayload = {
  catalogItemKey: string;
  quantity: number;
  quantityUnit: "grams" | "count" | "ml";
};

export type CreateMealPayload = {
  title: string;
  description?: string;
  isVegetarian?: boolean;
  /** HTTPS URL or `data:image/...;base64,...` from a local file pick. */
  image?: string | null;
  ingredients?: CreateIngredientPayload[];
};

/**
 * POST /meals — requires a Bearer token.
 * The DummyBearerAuthGuard accepts any non-empty token value.
 */
export async function createMeal(
  payload: CreateMealPayload,
  token: string,
): Promise<ApiMeal> {
  const res = await http.post<ApiMeal>("/meals", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
