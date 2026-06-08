import { http } from "./http";
import type { ApiMeal } from "@/lib/types/meal";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

export type MealCollectionSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  mealCount: number;
  sortOrder: number;
};

export type MealCollectionDetail = MealCollectionSummary & {
  items: DiscoverMeal[];
};

export async function fetchCollections(): Promise<MealCollectionSummary[]> {
  const res = await http.get<MealCollectionSummary[]>("/collections", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

export async function fetchCollectionBySlug(
  slug: string,
): Promise<MealCollectionDetail> {
  const res = await http.get<MealCollectionDetail>(`/collections/${slug}`, {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
