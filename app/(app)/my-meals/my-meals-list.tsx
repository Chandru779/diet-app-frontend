"use client";

import { useEffect, useState } from "react";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { MealEmptyIllustration } from "@/components/app/meal-empty-illustration";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { fetchMealsByUserId, fetchMealsByUsername } from "@/lib/api/meal";
import { useFeedStore } from "@/lib/store/feed-store";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiMeal } from "@/lib/types/meal";

export function MyMealsList() {
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const username = useAuthStore((s) => s.user?.username ?? null);
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        let rows: ApiMeal[];
        if (userId) {
          rows = await fetchMealsByUserId(userId);
        } else if (username) {
          rows = await fetchMealsByUsername(username);
        } else {
          rows = [];
        }
        if (!cancelled) setMeals(rows);
      } catch {
        if (!cancelled) {
          setError("Could not load meals. Make sure the backend is running.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, userId, username]);

  const listEmpty = !loading && !error && meals.length === 0;

  return (
    <div className="pb-4">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">
          My meals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Meals you logged with your account.
        </p>
      </div>

      {loading ? (
        <div
          className="flex min-h-[30vh] flex-col items-center justify-center gap-3"
          aria-busy="true"
        >
          <MealLoadingIllustration
            className="h-14 w-14 animate-pulse text-primary/55"
            label="Loading meals"
          />
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loading && !error && listEmpty ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <MealEmptyIllustration className="h-28 w-28 text-muted-foreground/40" />
          <div>
            <p className="font-medium text-foreground">No meals yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Create your first meal from the feed tab — it will show up here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openCreateSheet()}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.98]"
          >
            Log a meal
          </button>
        </div>
      ) : null}

      {!loading && !error && meals.length > 0 ? (
        <ul className="flex flex-col gap-4">
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
