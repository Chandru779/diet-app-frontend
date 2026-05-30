"use client";

import { useEffect, useState } from "react";
import { Plus, Salad } from "lucide-react";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppPageHeader } from "@/components/app/app-page-header";
import { AppPrimaryButton } from "@/components/app/app-primary-button";
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
  const mealCount = meals.length;

  return (
    <div className="flex flex-col gap-3 pb-4">
      <AppPageHeader
        title="My Meals"
        subtitle={
          !loading && !error && mealCount > 0
            ? `${mealCount} meal${mealCount === 1 ? "" : "s"} you have logged`
            : "Meals you create and log show up here"
        }
      />

      {loading ? (
        <div
          className="meal-card flex min-h-[32vh] flex-col items-center justify-center rounded-2xl bg-white py-12"
          aria-busy="true"
        >
          <MealLoadingIllustration
            className="h-12 w-12 animate-pulse text-primary/55"
            label="Loading meals"
          />
          <p className="mt-3 text-sm text-muted-foreground">Loading your meals…</p>
        </div>
      ) : null}

      {error ? (
        <p className="meal-card rounded-2xl border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loading && !error && listEmpty ? (
        <AppEmptyState
          icon={
            <MealEmptyIllustration
              className="h-10 w-10 text-primary/70"
              label=""
            />
          }
          title="No meals yet"
          description="Create your first meal from the feed — it will appear here with full macros."
          action={
            <AppPrimaryButton onClick={() => openCreateSheet()}>
              <Plus className="size-4" strokeWidth={2.5} />
              Log a meal
            </AppPrimaryButton>
          }
        />
      ) : null}

      {!loading && !error && mealCount > 0 ? (
        <>
          <button
            type="button"
            onClick={() => openCreateSheet()}
            className="meal-card flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-white px-4 py-3.5 text-left shadow-sm transition hover:from-emerald-50/90 active:scale-[0.99]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Salad className="size-5" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-foreground">
                Log another meal
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Add ingredients and we&apos;ll calculate macros
              </span>
            </span>
            <Plus className="size-5 shrink-0 text-primary" strokeWidth={2.25} />
          </button>

          <ul className="flex flex-col gap-3">
            {meals.map((meal) => (
              <li key={meal.id}>
                <FeedPostCard post={meal} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
