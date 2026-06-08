import { http } from "./http";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

export type MealPackOwner = {
  id: string;
  username: string;
};

export type MealPackSummary = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  mealCount: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  totalFiberG: number;
  totalCaloriesKcal: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MealPackDetail = MealPackSummary & {
  owner: MealPackOwner;
  isOwner: boolean;
  items: DiscoverMeal[];
};

export type CreateMealPackPayload = {
  title: string;
  description?: string;
  mealIds: string[];
};

export type UpdateMealPackPayload = {
  title?: string;
  description?: string | null;
  mealIds?: string[];
};

export async function fetchMealPacks(): Promise<MealPackSummary[]> {
  const res = await http.get<MealPackSummary[]>("/users/me/meal-packs", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

/** Public view — works for owners and anyone with a share link. */
export async function fetchMealPackById(id: string): Promise<MealPackDetail> {
  const res = await http.get<MealPackDetail>(`/meal-packs/${id}`, {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

export async function createMealPack(
  payload: CreateMealPackPayload,
): Promise<MealPackDetail> {
  const res = await http.post<MealPackDetail>("/users/me/meal-packs", payload);
  return res.data;
}

export async function updateMealPack(
  id: string,
  payload: UpdateMealPackPayload,
): Promise<MealPackDetail> {
  const res = await http.patch<MealPackDetail>(
    `/users/me/meal-packs/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteMealPack(id: string): Promise<void> {
  await http.delete(`/users/me/meal-packs/${id}`);
}

export async function recordMealPackView(packId: string): Promise<void> {
  await http.post(`/meal-packs/${packId}/views`);
}
