import { http } from "./http";
import type { ApiMeal } from "@/lib/types/meal";

export async function fetchFavoriteMeals(): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>("/users/me/favorites", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

export async function addFavorite(mealId: string): Promise<void> {
  await http.post(`/users/me/favorites/${mealId}`);
}

export async function removeFavorite(mealId: string): Promise<void> {
  await http.delete(`/users/me/favorites/${mealId}`);
}

export async function recordMealView(mealId: string): Promise<void> {
  await http.post(`/users/me/views/${mealId}`);
}
