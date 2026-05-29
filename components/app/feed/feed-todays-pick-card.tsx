"use client";

import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { FavoriteButton } from "@/components/app/feed/favorite-button";
import type { DiscoverMeal } from "@/lib/types/meal-discover";
import { cn } from "@/lib/utils";

function primaryBadge(meal: DiscoverMeal): string | null {
  if (meal.categorySlugs.includes("high-protein")) return "High Protein";
  if (meal.isQuick || meal.categorySlugs.includes("quick-meals")) return "Quick Meal";
  if (meal.isVegetarian || meal.categorySlugs.includes("veg-meals")) return "Veg";
  if (meal.categorySlugs.includes("keto")) return "Keto";
  return meal.tags[0]?.replace(/-/g, " ") ?? null;
}

type FeedTodaysPickCardProps = {
  meal: DiscoverMeal;
  className?: string;
};

export function FeedTodaysPickCard({ meal, className }: FeedTodaysPickCardProps) {
  const badge = primaryBadge(meal);

  return (
    <Link
      href={`/feed/${meal.id}`}
      className={cn(
        "group block w-[11.5rem] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)] ring-1 ring-border/20 transition hover:shadow-[0_4px_24px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <MealCoverImage
          src={meal.image}
          mealId={meal.id}
          alt={meal.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="184px"
        />
        {badge ? (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
            {badge}
          </span>
        ) : null}
        <div className="absolute right-2 top-2">
          <FavoriteButton
            mealId={meal.id}
            initialFavorited={meal.isFavorited}
          />
        </div>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-foreground">
          {meal.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Flame className="size-3 text-rose-500" aria-hidden />
            <span className="font-semibold text-foreground">
              {Math.round(meal.caloriesKcal)}
            </span>
            <span>kcal</span>
          </span>
          {meal.prepTimeMinutes != null ? (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="size-3" aria-hidden />
              <span>{meal.prepTimeMinutes} min</span>
            </span>
          ) : null}
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-[11px] font-bold tabular-nums">
          <span className="text-emerald-600">
            P <span className="font-semibold">{Math.round(meal.proteinG)}</span>
          </span>
          <span className="text-blue-600">
            C <span className="font-semibold">{Math.round(meal.carbsG)}</span>
          </span>
          <span className="text-orange-500">
            F <span className="font-semibold">{Math.round(meal.fatG)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
