"use client";

import Link from "next/link";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { ArrowRight } from "lucide-react";
import { useHomeMeals } from "@/lib/hooks/use-home-meals";
import { MARKETING_COPY } from "@/lib/constants/marketing-copy";
import {
  discoverMealsFallback,
  pickCarouselMealsFromApi,
} from "@/lib/marketing/showcase-meals";

export type ShowcaseMeal = {
  id: string;
  title: string;
  image: string;
  proteinG: number;
  href: string;
};

const STACK_STYLES = [
  "left-[6%] top-6 z-10 -rotate-6",
  "left-[30%] top-2 z-20 rotate-1",
  "right-[6%] top-7 z-10 rotate-7",
] as const;

function MealShowcasePanel({
  meals,
  loading,
}: {
  meals: ShowcaseMeal[];
  loading: boolean;
}) {
  return (
    <Link href="/feed" className="group block">
      <article className="meal-card relative h-[210px] overflow-hidden rounded-3xl bg-card shadow-card transition hover:shadow-card-hover active:scale-[0.995]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/30" />

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center gap-3 px-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-[88px] animate-pulse rounded-2xl bg-muted/70"
              />
            ))}
          </div>
        ) : (
          <>
            {meals.map((meal, i) => (
              <div
                key={meal.id}
                className={`absolute w-[34%] overflow-hidden rounded-2xl border-2 border-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 group-hover:scale-[1.02] ${STACK_STYLES[i] ?? STACK_STYLES[0]}`}
              >
                <div className="relative aspect-square w-full">
                  <MealCoverImage
                    src={meal.image}
                    mealId={meal.id}
                    alt={meal.title}
                    fill
                    className="object-cover"
                    sizes="120px"
                    priority={i === 1}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-6">
                  <p className="line-clamp-1 text-[10px] font-semibold text-white">
                    {meal.title}
                  </p>
                  <p className="text-[9px] font-medium text-white/80">
                    {meal.proteinG}g protein
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-5 pb-4 pt-16">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-white">
                {MARKETING_COPY.exploreTitle}
              </h2>
              <p className="text-xs text-white/80">
                {MARKETING_COPY.exploreSubtext}
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary shadow-md transition group-hover:scale-105">
              <ArrowRight className="size-4" strokeWidth={2.5} aria-hidden />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function HomeMealCarousel() {
  const { data, isPending, isError } = useHomeMeals();
  const picked =
    data && !isError ? pickCarouselMealsFromApi(data, 3) : [];
  const loading = isPending;
  const displayMeals: ShowcaseMeal[] =
    picked.length > 0
      ? picked
      : discoverMealsFallback(3).map((m) => ({
          id: m.id,
          title: m.title,
          image: m.image,
          proteinG: m.proteinG,
          href: m.href,
        }));

  return (
    <section className="space-y-3">
      <MealShowcasePanel meals={displayMeals} loading={loading} />
      <Link
        href="/feed"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:opacity-80"
      >
        {MARKETING_COPY.browseAll}
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </section>
  );
}
