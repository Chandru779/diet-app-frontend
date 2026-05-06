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
  /** How `quantity` is interpreted: weight in g, or item count */
  quantityUnit: "grams" | "count";
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
  description: string | null;
  image: string | null;
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG: number | null;
  createdAt: string;
  updatedAt: string;
  user: ApiUser;
  ingredients: ApiMealIngredient[];
};
