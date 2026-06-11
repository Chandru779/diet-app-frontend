import type { ApiMeal } from "@/lib/types/meal";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

export type PickableMeal = {
  id: string;
  title: string;
  image: string | null;
  proteinG: number;
  caloriesKcal: number;
};

export function toPickableMeal(meal: ApiMeal | DiscoverMeal): PickableMeal {
  return {
    id: meal.id,
    title: meal.title,
    image: meal.image,
    proteinG: meal.proteinG,
    caloriesKcal: meal.caloriesKcal,
  };
}

export function sumPickableMacros(meals: PickableMeal[]) {
  return meals.reduce(
    (acc, meal) => ({
      proteinG: acc.proteinG + meal.proteinG,
      caloriesKcal: acc.caloriesKcal + meal.caloriesKcal,
    }),
    { proteinG: 0, caloriesKcal: 0 },
  );
}

export function roundMacro(value: number) {
  return Math.round(value * 10) / 10;
}
