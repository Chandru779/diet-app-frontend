import { http } from "./http";

export type MealCollectionSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  mealCount: number;
  sortOrder: number;
};

export async function fetchCollections(): Promise<MealCollectionSummary[]> {
  const res = await http.get<MealCollectionSummary[]>("/collections", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
