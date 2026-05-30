"use client";

import { useEffect, useState } from "react";
import { Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppPageHeader } from "@/components/app/app-page-header";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { fetchFavoriteMeals } from "@/lib/api/favorites";
import { useFeedStore } from "@/lib/store/feed-store";
import type { ApiMeal } from "@/lib/types/meal";

export function SavedList() {
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFavoriteMeals()
      .then((rows) => {
        if (!cancelled) setMeals(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load collections. Make sure the backend is running.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const listEmpty = !loading && !error && meals.length === 0;
  const count = meals.length;

  return (
    <div className="flex flex-col gap-3 pb-4">
      <AppPageHeader
        title="Collections"
        subtitle={
          !loading && !error && count > 0
            ? `${count} saved meal${count === 1 ? "" : "s"}`
            : "Tap the heart on any meal to save it here"
        }
      />

      {loading ? (
        <div
          className="meal-card flex min-h-[32vh] flex-col items-center justify-center rounded-2xl bg-white py-12"
          aria-busy="true"
        >
          <MealLoadingIllustration
            className="h-12 w-12 animate-pulse text-primary/55"
            label="Loading collections"
          />
          <p className="mt-3 text-sm text-muted-foreground">Loading saved meals…</p>
        </div>
      ) : null}

      {error ? (
        <p className="meal-card rounded-2xl border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loading && !error && listEmpty ? (
        <AppEmptyState
          icon={<Bookmark className="size-7" strokeWidth={2} />}
          title="No saved meals yet"
          description="Browse the feed and tap the heart on meals you want to keep in your collection."
          action={
            <Link
              href="/feed"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.98]"
            >
              <Compass className="size-4" strokeWidth={2.25} />
              Explore feed
            </Link>
          }
        />
      ) : null}

      {!loading && !error && count > 0 ? (
        <ul className="flex flex-col gap-3">
          {meals.map((meal) => (
            <li key={meal.id}>
              <FeedPostCard post={meal} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
