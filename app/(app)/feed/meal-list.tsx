"use client";

import { useEffect, useMemo, useState } from "react";
import { FeedAppBar } from "@/components/app/feed-app-bar";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { FeedSearch } from "@/components/app/feed-search";
import { fetchMeals } from "@/lib/api/meal";
import { useFeedStore } from "@/lib/store/feed-store";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiMeal } from "@/lib/types/meal";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 rounded-2xl bg-card p-3.5 shadow-sm">
      <div className="h-[88px] w-[88px] animate-pulse rounded-xl bg-muted" />
      <div className="flex flex-1 flex-col gap-2 py-1">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mt-auto flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-3 w-10 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MealList() {
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const displayName = useAuthStore((s) => s.displayName);
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

  const headline = displayName
    ? `Hey, ${displayName.split("-")[0]} 👋`
    : "What's on your plate?";

  return (
    <div className="pb-4">
      <div className="bg-feed-header -mx-4 mb-5 rounded-b-[2rem] px-5 pb-5 pt-3">
        <FeedAppBar greeting={getGreeting()} headline={headline} />
        <FeedSearch value={query} onChange={setQuery} />
      </div>

      {!loading && !error ? (
        <div className="mb-3 flex items-center justify-between px-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {query
              ? `${filtered.length} result${filtered.length === 1 ? "" : "s"}`
              : `All meals · ${meals.length}`}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <ul className="flex flex-col gap-3">
            {filtered.map((meal) => (
              <li key={meal.id}>
                <FeedPostCard post={meal} />
              </li>
            ))}
          </ul>

          {filtered.length === 0 && query ? (
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
