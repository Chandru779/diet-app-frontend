"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, Layers, Package, Plus, Sparkles } from "lucide-react";
import { AppEmptyState } from "@/components/app/app-empty-state";
import { AppPrimaryButton } from "@/components/app/app-primary-button";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { MealPackCard } from "@/components/app/meal-pack/meal-pack-card";
import { fetchMealPacks, type MealPackSummary } from "@/lib/api/meal-packs";
import { useFeedStore } from "@/lib/store/feed-store";
import { cn } from "@/lib/utils";

type PackSort = "date" | "views";

const PACK_SORT_OPTIONS: { value: PackSort; label: string; icon: typeof CalendarDays }[] = [
  { value: "date", label: "Date", icon: CalendarDays },
  { value: "views", label: "Views", icon: Eye },
];

function aggregatePacks(packs: MealPackSummary[]) {
  return packs.reduce(
    (acc, pack) => ({
      meals: acc.meals + pack.mealCount,
      views: acc.views + pack.viewCount,
    }),
    { meals: 0, views: 0 },
  );
}

function sortPacks(packs: MealPackSummary[], sort: PackSort) {
  const rows = [...packs];
  if (sort === "views") {
    return rows.sort((a, b) => {
      if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
  return rows.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function MealPacksList() {
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const [packs, setPacks] = useState<MealPackSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<PackSort>("date");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMealPacks()
      .then((rows) => {
        if (!cancelled) setPacks(rows);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load meal packs. Make sure the backend is running.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const count = packs.length;
  const totals = useMemo(() => aggregatePacks(packs), [packs]);
  const sortedPacks = useMemo(() => sortPacks(packs, sort), [packs, sort]);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="bg-feed-header -mx-4 rounded-br-[1.75rem] px-5 pb-5 pt-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
              <Sparkles className="size-3.5" strokeWidth={2.25} />
              Your library
            </p>
            <h1 className="font-heading text-[1.75rem] font-bold leading-[1.12] tracking-tight text-foreground">
              Meal Packs
            </h1>
            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
              Bundle meals from anywhere and share a link with friends
            </p>
          </div>
          {!loading && count > 0 ? (
            <div className="shrink-0 rounded-2xl bg-white/90 px-3.5 py-2 text-center shadow-sm">
              <p className="font-heading text-2xl font-bold leading-none text-foreground">
                {count}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                pack{count === 1 ? "" : "s"}
              </p>
            </div>
          ) : null}
        </div>

        {!loading && !error && count > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/70 px-3 py-2 shadow-sm">
              <p className="text-[10px] font-semibold text-muted-foreground">
                Total meals
              </p>
              <p className="font-heading text-lg font-bold text-foreground">
                {totals.meals}
              </p>
            </div>
            <div className="rounded-xl bg-white/70 px-3 py-2 shadow-sm">
              <p className="text-[10px] font-semibold text-muted-foreground">
                Total views
              </p>
              <p className="font-heading text-lg font-bold text-foreground">
                {totals.views}
              </p>
            </div>
          </div>
        ) : null}

        <Link href="/meal-packs/new" className="mt-4 block">
          <AppPrimaryButton className="w-full">
            <Plus className="size-4" strokeWidth={2.5} />
            Create meal pack
          </AppPrimaryButton>
        </Link>
      </div>

      {loading ? (
        <div
          className="meal-card flex min-h-[32vh] flex-col items-center justify-center rounded-2xl bg-white py-12"
          aria-busy="true"
        >
          <MealLoadingIllustration
            className="h-12 w-12 animate-pulse text-primary/55"
            label="Loading meal packs"
          />
          <p className="mt-3 text-sm text-muted-foreground">Loading your packs…</p>
        </div>
      ) : null}

      {error ? (
        <p className="meal-card rounded-2xl border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loading && !error && count === 0 ? (
        <AppEmptyState
          icon={<Package className="size-7" strokeWidth={2} />}
          title="No meal packs yet"
          description="Create a pack to bundle meals from My Meals, Saved, Discover, or curated collections — then share it with one tap."
          action={
            <Link href="/meal-packs/new">
              <AppPrimaryButton>
                <Plus className="size-4" strokeWidth={2.5} />
                Create your first pack
              </AppPrimaryButton>
            </Link>
          }
        />
      ) : null}

      {!loading && !error && count > 0 ? (
        <>
          <div className="flex items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-2">
              <Layers className="size-3.5 text-muted-foreground" strokeWidth={2.25} />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                Your packs
              </p>
            </div>
            <div
              className="flex items-center gap-1 rounded-full bg-muted/40 p-0.5"
              role="group"
              aria-label="Sort meal packs"
            >
              {PACK_SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const active = sort === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSort(option.value)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                      active
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-pressed={active}
                  >
                    <Icon className="size-3" strokeWidth={2.25} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {sortedPacks.map((pack) => (
              <li key={pack.id}>
                <MealPackCard pack={pack} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
