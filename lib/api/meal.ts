import { http } from "./http";
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
  name: string;
  quantity: number;
  /** always "grams" for the predefined ingredient flow */
  quantityUnit: "grams" | "count";
  /** nutrition values are expressed per this many grams (100 for per-100g data) */
  nutritionBaseQuantity: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG?: number;
};

export type CreateMealPayload = {
  title: string;
  description?: string;
  isVegetarian?: boolean;
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
