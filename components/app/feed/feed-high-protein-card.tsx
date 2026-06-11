"use client";

import { MealNavLink } from "@/components/app/meal-nav-link";
import { ChefHat, Clock, Flame, Utensils } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { FavoriteButton } from "@/components/app/feed/favorite-button";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

type FeedHighProteinCardProps = {
  meal: DiscoverMeal;
};

export function FeedHighProteinCard({ meal }: FeedHighProteinCardProps) {
  const badges: { label: string; className: string }[] = [];
  if (meal.categorySlugs.includes("high-protein") || meal.proteinG >= 30) {
    badges.push({
      label: "High Protein",
      className: "bg-emerald-100 text-emerald-800",
    });
  }
  if (!meal.isVegetarian) {
    badges.push({
      label: "Non-veg",
      className: "bg-rose-100 text-rose-800",
    });
  } else if (meal.categorySlugs.includes("vegetarian")) {
    badges.push({
      label: "Veg",
      className: "bg-emerald-100 text-emerald-800",
    });
  }

  const difficulty =
    meal.difficulty === "easy"
      ? "Easy"
      : meal.difficulty === "medium"
        ? "Medium"
        : meal.difficulty === "hard"
          ? "Hard"
          : null;

  return (
    <div className="relative">
      <MealNavLink
        href={`/feed/${meal.id}`}
        className="meal-card group flex gap-3 rounded-2xl bg-white p-3 shadow-[0_1px_12px_rgba(0,0,0,0.06)] transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-muted">
          {meal.image ? (
            <MealCoverImage
              src={meal.image}
              mealId={meal.id}
              alt={meal.title}
              fill
              className="object-cover"
              sizes="88px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Utensils className="size-6 text-muted-foreground/30" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 font-heading text-[15px] font-bold text-foreground">
            {meal.title}
          </h3>
          {badges.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${b.className}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
          ) : null}
          {meal.description ? (
            <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
              {meal.description}
            </p>
          ) : null}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5">
              <Flame className="size-3 text-rose-500" />
              {Math.round(meal.caloriesKcal)} kcal
            </span>
            {meal.prepTimeMinutes != null ? (
              <span className="inline-flex items-center gap-0.5">
                <Clock className="size-3" />
                {meal.prepTimeMinutes} min
              </span>
            ) : null}
            {difficulty ? (
              <span className="inline-flex items-center gap-0.5">
                <ChefHat className="size-3" />
                {difficulty}
              </span>
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] font-bold tabular-nums">
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
            {meal.fiberG != null && meal.fiberG > 0 ? (
              <span className="text-violet-600">
                Fi{" "}
                <span className="font-semibold">
                  {Math.round(meal.fiberG)}g
                </span>
              </span>
            ) : null}
          </div>
        </div>
      </MealNavLink>

      <div className="absolute right-2 top-2 z-10">
        <FavoriteButton
          mealId={meal.id}
          initialFavorited={meal.isFavorited}
          className="size-8 shadow-sm"
        />
      </div>
    </div>
  );
}
