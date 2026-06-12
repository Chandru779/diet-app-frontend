export type MealPreparationStep = {
  text: string;
};

export const MEAL_TYPES = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "pre_workout",
  "post_workout",
  "quick_meals",
] as const;

export type MealType = (typeof MEAL_TYPES)[number];

export type ApiUser = {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiMealIngredient = {
  id: string;
  mealId: string;
  mealCatalogId?: string | null;
  name: string;
  quantity: number;
  /** How `quantity` is interpreted: weight in g, volume in ml, or item count */
  quantityUnit: "grams" | "count" | "ml";
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiMeal = {
  id: string;
  title: string;
  slug: string | null;
  mealType: MealType | null;
  isPublic: boolean;
  aiSummary: string | null;
  tags: string[];
  description: string | null;
  image: string | null;
  preparationSteps: MealPreparationStep[] | null;
  popularity: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG: number | null;
  prepTimeMinutes?: number | null;
  difficulty?: "easy" | "medium" | "hard" | null;
  isQuick?: boolean;
  isBeginnerFriendly?: boolean;
  isBudgetFriendly?: boolean;
  createdAt: string;
  updatedAt: string;
  user: ApiUser;
  ingredients: ApiMealIngredient[];
};
