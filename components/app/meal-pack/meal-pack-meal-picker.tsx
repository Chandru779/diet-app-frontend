"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { MealPackPickerRow } from "@/components/app/meal-pack/meal-pack-picker-row";
import {
  fetchCollectionBySlug,
  fetchCollections,
  type MealCollectionSummary,
} from "@/lib/api/collections";
import { fetchDiscoverMeals } from "@/lib/api/discover";
import { fetchFavoriteMeals } from "@/lib/api/favorites";
import { fetchMealsByUserId } from "@/lib/api/meal";
import { useAuthStore } from "@/lib/store/auth-store";
import { toPickableMeal, type PickableMeal } from "@/lib/types/meal-pack";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "my-meals", label: "My Meals" },
  { id: "saved", label: "Saved" },
  { id: "discover", label: "Discover" },
  { id: "collections", label: "Collections" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type MealPackMealPickerProps = {
  selectedIds: Set<string>;
  selectedMeals: PickableMeal[];
  onSelectionChange: (ids: Set<string>, meals: PickableMeal[]) => void;
};

export function MealPackMealPicker({
  selectedIds,
  selectedMeals,
  onSelectionChange,
}: MealPackMealPickerProps) {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [tab, setTab] = useState<TabId>("my-meals");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meals, setMeals] = useState<PickableMeal[]>([]);
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverTotal, setDiscoverTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [collections, setCollections] = useState<MealCollectionSummary[]>([]);
  const [activeCollectionSlug, setActiveCollectionSlug] = useState<
    string | null
  >(null);
  const [collectionsLoading, setCollectionsLoading] = useState(false);

  const mealMap = useMemo(() => {
    const map = new Map<string, PickableMeal>();
    for (const meal of selectedMeals) {
      map.set(meal.id, meal);
    }
    for (const meal of meals) {
      if (!map.has(meal.id)) {
        map.set(meal.id, meal);
      }
    }
    return map;
  }, [meals, selectedMeals]);

  const toggleMeal = useCallback(
    (mealId: string) => {
      const nextIds = new Set(selectedIds);
      const nextMeals = [...selectedMeals];
      const meal = mealMap.get(mealId);

      if (nextIds.has(mealId)) {
        nextIds.delete(mealId);
        const idx = nextMeals.findIndex((m) => m.id === mealId);
        if (idx >= 0) nextMeals.splice(idx, 1);
      } else if (meal) {
        nextIds.add(mealId);
        nextMeals.push(meal);
      }

      onSelectionChange(nextIds, nextMeals);
    },
    [mealMap, onSelectionChange, selectedIds, selectedMeals],
  );

  const addAllMeals = useCallback(
    (rows: PickableMeal[]) => {
      const nextIds = new Set(selectedIds);
      const nextMeals = [...selectedMeals];
      for (const meal of rows) {
        if (!nextIds.has(meal.id)) {
          nextIds.add(meal.id);
          nextMeals.push(meal);
        }
      }
      onSelectionChange(nextIds, nextMeals);
    },
    [onSelectionChange, selectedIds, selectedMeals],
  );

  const discoverSearch = tab === "discover" ? search.trim() : "";

  useEffect(() => {
    if (tab === "collections") {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setMeals([]);

    const run = async () => {
      try {
        if (tab === "my-meals") {
          if (!userId) {
            if (!cancelled) setMeals([]);
            return;
          }
          const rows = await fetchMealsByUserId(userId);
          if (!cancelled) {
            setMeals(rows.map(toPickableMeal));
          }
          return;
        }

        if (tab === "saved") {
          const rows = await fetchFavoriteMeals();
          if (!cancelled) {
            setMeals(rows.map(toPickableMeal));
          }
          return;
        }

        if (tab === "discover") {
          const result = await fetchDiscoverMeals({
            page: 1,
            limit: 20,
            q: discoverSearch || undefined,
          });
          if (!cancelled) {
            setMeals(result.items.map(toPickableMeal));
            setDiscoverPage(1);
            setDiscoverTotal(result.total);
          }
        }
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
  }, [tab, userId, discoverSearch]);

  useEffect(() => {
    if (tab !== "collections") {
      return;
    }

    let cancelled = false;
    setCollectionsLoading(true);
    setError(null);
    setActiveCollectionSlug(null);
    setMeals([]);

    fetchCollections()
      .then((rows) => {
        if (!cancelled) setCollections(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load collections.");
        }
      })
      .finally(() => {
        if (!cancelled) setCollectionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  async function loadDiscoverMore() {
    if (loadingMore || meals.length >= discoverTotal) return;
    setLoadingMore(true);
    try {
      const nextPage = discoverPage + 1;
      const result = await fetchDiscoverMeals({
        page: nextPage,
        limit: 20,
        q: search.trim() || undefined,
      });
      setMeals((prev) => [...prev, ...result.items.map(toPickableMeal)]);
      setDiscoverPage(nextPage);
      setDiscoverTotal(result.total);
    } catch {
      setError("Could not load more meals.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function openCollection(slug: string) {
    setActiveCollectionSlug(slug);
    setCollectionsLoading(true);
    setError(null);
    try {
      const detail = await fetchCollectionBySlug(slug);
      setMeals(detail.items.map(toPickableMeal));
    } catch {
      setError("Could not load collection meals.");
      setMeals([]);
    } finally {
      setCollectionsLoading(false);
    }
  }

  const filteredMeals = useMemo(() => {
    if (tab === "discover") {
      return meals;
    }
    const q = search.trim().toLowerCase();
    if (!q) return meals;
    return meals.filter((m) => m.title.toLowerCase().includes(q));
  }, [meals, search, tab]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setSearch("");
            }}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
              tab === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab !== "collections" || activeCollectionSlug ? (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              tab === "discover" ? "Search discover meals…" : "Filter meals…"
            }
            className="w-full rounded-xl border border-border/70 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-primary/20 transition focus:ring-2"
          />
        </div>
      ) : null}

      {tab === "collections" && !activeCollectionSlug ? (
        <div className="flex flex-col gap-2">
          {collectionsLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading collections…
            </div>
          ) : null}
          {!collectionsLoading && collections.length === 0 ? (
            <AppEmptyState
              icon={<span className="text-lg">📚</span>}
              title="No collections yet"
              description="Curated collections from the feed will appear here."
            />
          ) : null}
          {!collectionsLoading
            ? collections.map((collection) => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => openCollection(collection.slug)}
                  className="meal-card flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-left transition hover:bg-muted/20"
                >
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold text-foreground">
                      {collection.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {collection.mealCount} meals
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    Browse →
                  </span>
                </button>
              ))
            : null}
        </div>
      ) : null}

      {tab === "collections" && activeCollectionSlug ? (
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveCollectionSlug(null);
              setMeals([]);
            }}
            className="text-xs font-semibold text-primary"
          >
            ← All collections
          </button>
          {meals.length > 0 ? (
            <button
              type="button"
              onClick={() => addAllMeals(meals)}
              className="text-xs font-semibold text-emerald-700"
            >
              Add all ({meals.length})
            </button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading || (tab === "collections" && collectionsLoading) ? (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading meals…
        </div>
      ) : null}

      {!loading &&
      !(
        tab === "collections" &&
        collectionsLoading &&
        !activeCollectionSlug
      ) ? (
        <>
          {filteredMeals.length === 0 && tab !== "collections" ? (
            <AppEmptyState
              icon={<span className="text-lg">🍽</span>}
              title={
                tab === "my-meals"
                  ? "No meals logged yet"
                  : tab === "saved"
                    ? "No saved meals"
                    : "No meals found"
              }
              description={
                tab === "my-meals"
                  ? "Log meals from the + button and they will show up here."
                  : tab === "saved"
                    ? "Heart meals on the feed to save them here."
                    : "Try a different search."
              }
            />
          ) : null}

          {filteredMeals.length > 0 ? (
            <ul className="flex flex-col gap-1.5 pb-32">
              {filteredMeals.map((meal) => (
                <li key={meal.id}>
                  <MealPackPickerRow
                    meal={meal}
                    selected={selectedIds.has(meal.id)}
                    onToggle={toggleMeal}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {tab === "discover" && meals.length < discoverTotal ? (
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => void loadDiscoverMore()}
              className="mb-28 w-full rounded-xl border border-border bg-white py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/30 disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more meals"}
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
