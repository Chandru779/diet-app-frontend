"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { ChevronRight } from "lucide-react";
import { fetchMeals } from "@/lib/api/meal";
import { MARKETING_COPY } from "@/lib/constants/marketing-copy";
import {
  discoverMealsFallback,
  pickShowcaseMealsFromApi,
  type ShowcaseMealCard,
} from "@/lib/marketing/showcase-meals";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import { cn } from "@/lib/utils";

const DISCOVER_LIMIT = 4;

function DiscoverMealCard({
  meal,
  fromApi,
}: {
  meal: ShowcaseMealCard;
  fromApi: boolean;
}) {
  return (
    <Link
      href={meal.href}
      className="meal-card group w-[148px] shrink-0 overflow-hidden rounded-2xl bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99]"
    >
      <div className="relative h-[100px] w-full bg-muted">
        <MealCoverImage
          src={meal.image}
          mealId={meal.id}
          alt={meal.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="148px"
        />
        {/* <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2 pb-1.5 pt-5">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[8px] font-semibold text-foreground shadow-sm">
            View meal
            <ChevronRight className="size-2" aria-hidden />
          </span>
        </span> */}
        {fromApi ? (
          <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-primary-foreground">
            Live
          </span>
        ) : null}
      </div>
      <div className="flex overflow-hidden border-t border-border/10">
        <span
          className={cn(
            "flex-1 px-1.5 py-1 text-center text-[9px] font-bold tabular-nums",
            NUTRIENT_COLORS.protein.bgClass,
            NUTRIENT_COLORS.protein.textClass,
          )}
        >
          {meal.proteinG}g
          <span className="block text-[8px] font-medium opacity-80">
            Protein
          </span>
        </span>
        <span
          className={cn(
            "flex-1 px-1.5 py-1 text-center text-[9px] font-bold tabular-nums",
            NUTRIENT_COLORS.carbs.bgClass,
            NUTRIENT_COLORS.carbs.textClass,
          )}
        >
          {meal.carbsG}g
          <span className="block text-[8px] font-medium opacity-80">Carbs</span>
        </span>
        <span className="flex-1 bg-violet-50 px-1.5 py-1 text-center text-[9px] font-bold tabular-nums text-violet-700">
          {meal.fatG}g
          <span className="block text-[8px] font-medium opacity-80">Fats</span>
        </span>
      </div>
      <div className="flex items-center gap-1 px-2.5 py-2">
        <p className="line-clamp-1 min-w-0 flex-1 font-heading text-xs font-bold text-foreground">
          {meal.title}
        </p>
        <ChevronRight
          className="size-3.5 shrink-0 text-muted-foreground/50 transition group-hover:translate-x-0.5 group-hover:text-primary"
          strokeWidth={2.25}
          aria-hidden
        />
      </div>
    </Link>
  );
}

function DiscoverSkeleton() {
  return (
    <>
      {Array.from({ length: DISCOVER_LIMIT }).map((_, i) => (
        <div
          key={i}
          className="meal-card w-[148px] shrink-0 overflow-hidden rounded-2xl bg-card"
        >
          <div className="h-[100px] animate-pulse bg-muted/70" />
          <div className="h-8 animate-pulse bg-muted/40" />
          <div className="mx-2.5 my-2 h-3 animate-pulse rounded bg-muted/50" />
        </div>
      ))}
    </>
  );
}

export function HomeDiscoverMeals() {
  const [meals, setMeals] = useState<ShowcaseMealCard[] | null>(null);
  const [fromApi, setFromApi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMeals()
      .then((rows) => {
        if (cancelled) return;
        const picked = pickShowcaseMealsFromApi(rows, DISCOVER_LIMIT);
        if (picked.length > 0) {
          setMeals(picked);
          setFromApi(true);
        } else {
          setMeals(null);
          setFromApi(false);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setMeals(null);
        setFromApi(false);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayMeals =
    meals && meals.length > 0 ? meals : discoverMealsFallback(DISCOVER_LIMIT);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground">
            {MARKETING_COPY.discoverTitle}
          </h2>
        </div>
        <Link
          href="/feed"
          className="shrink-0 text-sm font-semibold text-primary transition hover:opacity-80"
        >
          {MARKETING_COPY.seeAll}
        </Link>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <DiscoverSkeleton />
        ) : (
          displayMeals.map((meal) => (
            <DiscoverMealCard key={meal.id} meal={meal} fromApi={fromApi} />
          ))
        )}
      </div>
    </section>
  );
}
