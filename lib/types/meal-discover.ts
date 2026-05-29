import type { MealType } from "./meal";

export type DiscoverMealUser = {
  id: string;
  username: string;
};

export type MealDifficulty = "easy" | "medium" | "hard";

export type DiscoverMeal = {
  id: string;
  title: string;
  slug: string | null;
  mealType: MealType | null;
  description: string | null;
  image: string | null;
  isVegetarian: boolean;
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG: number | null;
  prepTimeMinutes: number | null;
  difficulty: MealDifficulty | null;
  isQuick: boolean;
  isBeginnerFriendly: boolean;
  isBudgetFriendly: boolean;
  popularity: number;
  tags: string[];
  categorySlugs: string[];
  user: DiscoverMealUser;
  isFavorited?: boolean;
  createdAt: string;
};

export type DiscoverResult = {
  items: DiscoverMeal[];
  total: number;
  page: number;
  limit: number;
};

export type MealCategoryGroup =
  | "quick_filter"
  | "macro_chip"
  | "goal"
  | "dietary"
  | "lifestyle"
  | "health_focus";

export type MealCategoryItem = {
  slug: string;
  label: string;
  group: MealCategoryGroup;
  sortOrder: number;
  isComputed: boolean;
  description: string | null;
  mealCount: number;
};

export type MealCategoriesResponse = {
  group: MealCategoryGroup;
  categories: MealCategoryItem[];
}[];

export type DiscoverSort = "newest" | "popular" | "protein" | "calories";

export type DiscoverQueryParams = {
  q?: string;
  categories?: string[];
  categoryGroup?: MealCategoryGroup;
  mealType?: MealType[];
  isVegetarian?: boolean;
  caloriesMin?: number;
  caloriesMax?: number;
  proteinMin?: number;
  proteinMax?: number;
  carbsMin?: number;
  carbsMax?: number;
  fatMin?: number;
  fatMax?: number;
  prepTimeMax?: number;
  includeIngredients?: string[];
  excludeIngredients?: string[];
  isQuick?: boolean;
  isBeginnerFriendly?: boolean;
  isBudgetFriendly?: boolean;
  sort?: DiscoverSort;
  page?: number;
  limit?: number;
  publicOnly?: boolean;
};
