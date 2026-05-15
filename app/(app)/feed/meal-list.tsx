"use client";

import { useEffect, useMemo, useState } from "react";
import { FeedAppBar } from "@/components/app/feed-app-bar";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { FeedSearch } from "@/components/app/feed-search";
import { MealEmptyIllustration } from "@/components/app/meal-empty-illustration";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { fetchMeals } from "@/lib/api/meal";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useFeedStore } from "@/lib/store/feed-store";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiMeal } from "@/lib/types/meal";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function MealList() {
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);
  const username = useAuthStore((s) => s.user?.username);
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMeals()
      .then((rows) => {
        if (cancelled) return;
        setMeals(rows);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load meals. Make sure the backend is running.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return meals;
    return meals.filter((meal) => {
      const blob = meal.ingredients.map((i) => i.name.toLowerCase()).join(" ");
      return (
        meal.title.toLowerCase().includes(q) ||
        (meal.description ?? "").toLowerCase().includes(q) ||
        meal.user.username.toLowerCase().includes(q) ||
        blob.includes(q)
      );
    });
  }, [query, meals]);

  const { firstName } = deriveDisplayName(username);
  const headline = username
    ? `Hey, ${firstName} 👋`
    : "What's on your plate?";

  const listEmpty = !loading && !error && meals.length === 0;
  const showNoSearchResults =
    !loading && !error && meals.length > 0 && filtered.length === 0 && query;

  return (
    <div className="pb-4">
      <div className="bg-feed-header -mx-4 mb-5 rounded-b-[2rem] px-5 pb-5 pt-3">
        <FeedAppBar greeting={getGreeting()} headline={headline} />
        <FeedSearch value={query} onChange={setQuery} />
      </div>

      {!loading && !error && !listEmpty ? (
        <div className="mb-3 flex items-center justify-between px-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {query
              ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
              : `All meals · ${meals.length}`}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          aria-busy="true"
          aria-live="polite"
        >
          <MealLoadingIllustration
            className="h-16 w-16 animate-pulse text-primary/50"
            label="Loading meals"
          />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!loading && !error && listEmpty ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center"
          role="status"
          aria-live="polite"
        >
          <MealEmptyIllustration className="mb-4 h-20 w-20 text-primary/35" />
          <p className="font-heading text-lg font-semibold text-foreground">
            No meals yet
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            When you or others log meals, they will show up here. Be the first
            to share one.
          </p>
          <button
            type="button"
            onClick={openCreateSheet}
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
          >
            Log a meal
          </button>
        </div>
      ) : null}

      {!loading && !error && !listEmpty ? (
        <>
          <ul className="flex flex-col gap-3">
            {filtered.map((meal) => (
              <li key={meal.id}>
                <FeedPostCard post={meal} />
              </li>
            ))}
          </ul>

          {showNoSearchResults ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No meals matched &ldquo;{query}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
