import { http } from "./http";

export async function addFavorite(mealId: string): Promise<void> {
  await http.post(`/users/me/favorites/${mealId}`);
}

export async function removeFavorite(mealId: string): Promise<void> {
  await http.delete(`/users/me/favorites/${mealId}`);
}

export async function recordMealView(mealId: string): Promise<void> {
  await http.post(`/users/me/views/${mealId}`);
}
