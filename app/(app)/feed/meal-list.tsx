"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FeedAppBar } from "@/components/app/feed-app-bar";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { FeedSearch } from "@/components/app/feed-search";
import { MealEmptyIllustration } from "@/components/app/meal-empty-illustration";
import { MealFeedQuickFilters } from "@/components/app/meal-feed-quick-filters";
import { MealFilterSheet } from "@/components/app/meal-filter-sheet";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { fetchFilteredMeals, fetchMeals } from "@/lib/api/meal";
import {
  applyMealFeedClientFilters,
  DEFAULT_MEAL_FEED_FILTERS,
  hasMealFeedClientFilters,
  mealFeedFiltersSummary,
  mealFeedFiltersToSearchParams,
  countMealFeedSheetFilters,
  parseMealFeedFilters,
  toggleMealFeedQuickChip,
  type MealFeedFilters,
  type MealFeedQuickChipId,
} from "@/lib/config/meal-feed-filters";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useFeedStore } from "@/lib/store/feed-store";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiMeal } from "@/lib/types/meal";
import { mealFilterLabel } from "@/lib/types/meal-filter";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function MealList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseMealFeedFilters(searchParams),
    [searchParams],
  );
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);
  const username = useAuthStore((s) => s.user?.username);
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState<ApiMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const sheetFilterCount = countMealFeedSheetFilters(filters);

  const pushFilters = useCallback(
    (next: MealFeedFilters) => {
      const qs = mealFeedFiltersToSearchParams(next).toString();
      router.push(qs ? `/feed?${qs}` : "/feed", { scroll: false });
    },
    [router],
  );

  const clearAllFilters = useCallback(() => {
    pushFilters(DEFAULT_MEAL_FEED_FILTERS);
  }, [pushFilters]);

  const toggleQuickChip = useCallback(
    (chipId: MealFeedQuickChipId) => {
      pushFilters(toggleMealFeedQuickChip(filters, chipId));
    },
    [filters, pushFilters],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const request = filters.category
      ? fetchFilteredMeals(filters.category)
      : fetchMeals();

    request
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
  }, [refreshKey, filters.category]);

  const afterClientFilters = useMemo(
    () => applyMealFeedClientFilters(meals, filters),
    [meals, filters],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return afterClientFilters;
    return afterClientFilters.filter((meal) => {
      const blob = meal.ingredients.map((i) => i.name.toLowerCase()).join(" ");
      return (
        meal.title.toLowerCase().includes(q) ||
        (meal.description ?? "").toLowerCase().includes(q) ||
        meal.user.username.toLowerCase().includes(q) ||
        blob.includes(q)
      );
    });
  }, [query, afterClientFilters]);

  const previewCount = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = applyMealFeedClientFilters(meals, filters);
    if (!q) return base.length;
    return base.filter((meal) => {
      const blob = meal.ingredients.map((i) => i.name.toLowerCase()).join(" ");
      return (
        meal.title.toLowerCase().includes(q) ||
        (meal.description ?? "").toLowerCase().includes(q) ||
        meal.user.username.toLowerCase().includes(q) ||
        blob.includes(q)
      );
    }).length;
  }, [meals, filters, query]);

  const { firstName } = deriveDisplayName(username);
  const headline = username
    ? `Hey, ${firstName} 👋`
    : "What's on your plate?";

  const listEmpty = !loading && !error && meals.length === 0;
  const clientFilteredEmpty =
    !loading &&
    !error &&
    meals.length > 0 &&
    afterClientFilters.length === 0 &&
    hasMealFeedClientFilters(filters);
  const showNoSearchResults =
    !loading &&
    !error &&
    afterClientFilters.length > 0 &&
    filtered.length === 0 &&
    Boolean(query);

  const listHeading = useMemo(() => {
    if (query) {
      return `${filtered.length} result${filtered.length === 1 ? "" : "s"}`;
    }
    const scope = mealFeedFiltersSummary(filters);
    return `${scope} · ${filtered.length}`;
  }, [query, filtered.length, filters]);

  const emptyTitle = filters.category
    ? `No ${filters.category === "veg" ? "vegetarian" : "non-vegetarian"} meals yet`
    : "No meals yet";

  const emptyDescription = filters.category
    ? `Nothing in the ${mealFilterLabel(filters.category).toLowerCase()} feed right now. Try all meals or log one that matches.`
    : "When you or others log meals, they will show up here. Be the first to share one.";

  return (
    <div className="pb-4">
      <div className="bg-feed-header -mx-4 mb-5 rounded-b-[2rem] px-5 pb-5 pt-3">
        <FeedAppBar greeting={getGreeting()} headline={headline} />
        <FeedSearch
          value={query}
          onChange={setQuery}
          onFilterClick={() => setFilterOpen(true)}
          activeFilterCount={sheetFilterCount}
          filterButtonLabel="Sort & more"
        />
        <MealFeedQuickFilters filters={filters} onToggle={toggleQuickChip} />
      </div>

      <MealFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={filters}
        onApply={pushFilters}
        resultCount={previewCount}
      />

      {!loading && !error && !listEmpty && !clientFilteredEmpty ? (
        <div className="mb-3 flex items-center justify-between px-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {listHeading}
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
            {emptyTitle}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {emptyDescription}
          </p>
          {filters.category ? (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted/40 active:scale-[0.99]"
            >
              Browse all meals
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateSheet}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
            >
              Log a meal
            </button>
          )}
        </div>
      ) : null}

      {!loading && !error && clientFilteredEmpty ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center"
          role="status"
          aria-live="polite"
        >
          <MealEmptyIllustration className="mb-4 h-20 w-20 text-primary/35" />
          <p className="font-heading text-lg font-semibold text-foreground">
            No meals match these filters
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Try a different chip or open Sort &amp; more to adjust.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {!loading && !error && !listEmpty && !clientFilteredEmpty ? (
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
