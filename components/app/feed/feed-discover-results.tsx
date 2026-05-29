"use client";

import { FeedHighProteinCard } from "@/components/app/feed/feed-high-protein-card";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

type FeedDiscoverResultsProps = {
  meals: DiscoverMeal[];
  total: number;
  title?: string;
};

export function FeedDiscoverResults({
  meals,
  total,
  title = "Results",
}: FeedDiscoverResultsProps) {
  return (
    <section className="mt-6" aria-live="polite">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title} · {total}
      </p>
      <ul className="flex flex-col gap-3">
        {meals.map((meal) => (
          <li key={meal.id}>
            <FeedHighProteinCard meal={meal} />
          </li>
        ))}
      </ul>
    </section>
  );
}
