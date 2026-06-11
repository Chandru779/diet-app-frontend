import {
  MARKETING_ASSETS,
  MARKETING_PREVIEW_MEALS,
} from "@/lib/constants/marketing-copy";
import type { ApiMeal } from "@/lib/types/meal";

export type ShowcaseMealCard = {
  id: string;
  title: string;
  image: string;
  proteinG: number;
  carbsG: number;
  fatG: number;
  href: string;
};

function hasDisplayableImage(
  image: string | null | undefined,
): image is string {
  return Boolean(image?.trim());
}

/**
 * Picks meals for marketing showcases. Requires an image.
 * Sorted by protein (desc) until backend exposes popularity.
 */
export function pickShowcaseMealsFromApi(
  meals: ApiMeal[],
  limit = 4,
): ShowcaseMealCard[] {
  return meals
    .filter((m) => hasDisplayableImage(m.image))
    .sort((a, b) => b.proteinG - a.proteinG)
    .slice(0, limit)
    .map((m) => ({
      id: m.id,
      title: m.title,
      image: m.image!,
      proteinG: Math.round(m.proteinG),
      carbsG: Math.round(m.carbsG),
      fatG: Math.round(m.fatG),
      href: `/feed/${m.id}`,
    }));
}

/** Compact carousel cards (protein only). */
export function pickCarouselMealsFromApi(
  meals: ApiMeal[],
  limit = 3,
): Pick<ShowcaseMealCard, "id" | "title" | "image" | "proteinG" | "href">[] {
  return pickShowcaseMealsFromApi(meals, limit).map(
    ({ id, title, image, proteinG, href }) => ({
      id,
      title,
      image,
      proteinG,
      href,
    }),
  );
}

export function discoverMealsFallback(limit = 4): ShowcaseMealCard[] {
  const fromAssets = MARKETING_ASSETS.meals.map((m) => ({
    id: m.id,
    title: m.title,
    image: m.image,
    proteinG: m.proteinG,
    carbsG: m.carbsG,
    fatG: m.fatG,
    href: "/feed",
  }));

  if (fromAssets.length >= limit) return fromAssets.slice(0, limit);

  const fromPreview = MARKETING_PREVIEW_MEALS.map((m) => ({
    id: m.id,
    title: m.title,
    image: m.image,
    proteinG: m.proteinG,
    carbsG: 0,
    fatG: 0,
    href: "/feed",
  }));

  return [...fromAssets, ...fromPreview].slice(0, limit);
}
