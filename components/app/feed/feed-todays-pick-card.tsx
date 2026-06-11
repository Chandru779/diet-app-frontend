"use client";

import { MealNavLink } from "@/components/app/meal-nav-link";
import { Clock, Flame } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { FavoriteButton } from "@/components/app/feed/favorite-button";
import type { DiscoverMeal } from "@/lib/types/meal-discover";
import { cn } from "@/lib/utils";

function primaryBadge(meal: DiscoverMeal): string | null {
  if (meal.categorySlugs.includes("high-protein")) return "High Protein";
  if (meal.isQuick || meal.categorySlugs.includes("quick-meals"))
    return "Quick Meal";
  if (meal.isVegetarian || meal.categorySlugs.includes("veg-meals"))
    return "Veg";
  if (meal.categorySlugs.includes("keto")) return "Keto";
  return meal.tags[0]?.replace(/-/g, " ") ?? null;
}

type FeedTodaysPickCardProps = {
  meal: DiscoverMeal;
  className?: string;
};

export function FeedTodaysPickCard({
  meal,
  className,
}: FeedTodaysPickCardProps) {
  const badge = primaryBadge(meal);

  return (
    <div className={cn("relative w-[11rem] shrink-0 snap-start", className)}>
      <MealNavLink
        href={`/feed/${meal.id}`}
        className="meal-card group block w-full overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
          <MealCoverImage
            src={meal.image}
            mealId={meal.id}
            alt={meal.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="176px"
          />
          {badge ? (
            <span className="absolute left-2.5 top-2.5 rounded-lg bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 p-3">
          <h3
            className="line-clamp-1 font-heading text-sm font-bold leading-snug text-foreground"
            title={meal.title}
          >
            {meal.title}
          </h3>

          <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex min-w-0 items-center gap-0.5">
              <Flame className="size-3 shrink-0 text-rose-500" aria-hidden />
              <span className="font-semibold text-foreground">
                {Math.round(meal.caloriesKcal)}
              </span>
              <span>kcal</span>
            </span>
            {meal.prepTimeMinutes != null ? (
              <span className="inline-flex shrink-0 items-center gap-0.5">
                <Clock className="size-3" aria-hidden />
                <span>{meal.prepTimeMinutes} min</span>
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-1 text-[10px] font-bold tabular-nums">
            <span className="text-emerald-600">
              P{" "}
              <span className="font-semibold">
                {Math.round(meal.proteinG)}g
              </span>
            </span>
            <span className="text-blue-600">
              C{" "}
              <span className="font-semibold">{Math.round(meal.carbsG)}g</span>
            </span>
            <span className="text-orange-500">
              F <span className="font-semibold">{Math.round(meal.fatG)}g</span>
            </span>
            <span className="text-violet-600">
              Fi{" "}
              <span className="font-semibold">
                {Math.round(meal.fiberG ?? 0)}g
              </span>
            </span>
          </div>
        </div>
      </MealNavLink>

      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton mealId={meal.id} initialFavorited={meal.isFavorited} />
      </div>
    </div>
  );
}
