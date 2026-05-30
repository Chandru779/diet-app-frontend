"use client";

import { MealNavLink } from "@/components/app/meal-nav-link";
import { Flame } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

type FeedRecentlyViewedCardProps = {
  meal: DiscoverMeal;
};

export function FeedRecentlyViewedCard({ meal }: FeedRecentlyViewedCardProps) {
  return (
    <MealNavLink
      href={`/feed/${meal.id}`}
      className="flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-1.5"
    >
      <div className="relative size-[4.75rem] overflow-hidden rounded-full bg-muted ring-2 ring-white shadow-sm">
        <MealCoverImage
          src={meal.image}
          mealId={meal.id}
          alt={meal.title}
          fill
          className="object-cover"
          sizes="76px"
        />
      </div>
      <p className="line-clamp-2 w-full text-center text-[10px] font-semibold leading-tight text-foreground">
        {meal.title}
      </p>
      <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
        <Flame className="size-2.5 text-rose-500" />
        {Math.round(meal.caloriesKcal)} kcal
      </span>
    </MealNavLink>
  );
}
