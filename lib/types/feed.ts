import type { DiscoverMeal } from "./meal-discover";

export type FeedSectionType = "carousel" | "list" | "category_grid";

export type FeedExploreCategory = {
  slug: string;
  label: string;
  mealCount?: number;
};

export type FeedSection = {
  id: string;
  title: string;
  type: FeedSectionType;
  items: DiscoverMeal[];
  categories?: FeedExploreCategory[];
};

export type FeedHomeResponse = {
  sections: FeedSection[];
};
