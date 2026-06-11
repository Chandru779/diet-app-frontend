"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FeedSearch } from "@/components/app/feed-search";
import { MealFilterSheet } from "@/components/app/meal-filter-sheet";
import { FeedMoreCategoriesSheet } from "@/components/app/feed/feed-more-categories-sheet";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { MealEmptyIllustration } from "@/components/app/meal-empty-illustration";
import { FeedHeader } from "@/components/app/feed/feed-header";
import { FeedPrimaryCategories } from "@/components/app/feed/feed-primary-categories";
import { FeedFiltersCustomize } from "@/components/app/feed/feed-filters-customize";
import { FeedMacroChips } from "@/components/app/feed/feed-macro-chips";
import { FeedHomeSections } from "@/components/app/feed/feed-home-sections";
import { FeedDiscoverResults } from "@/components/app/feed/feed-discover-results";
import { fetchDiscoverCount, fetchDiscoverMeals } from "@/lib/api/discover";
import {
  DEFAULT_FEED_ADVANCED_FILTERS,
  countFeedAdvancedFilters,
  feedAdvancedFiltersToSearchParams,
  parseFeedAdvancedFilters,
  type FeedAdvancedFilters,
} from "@/lib/config/feed-advanced-filters";
import type { MacroChipId, PrimaryCategoryId } from "@/lib/config/feed-ui";
import { FEED_PRIMARY_CATEGORIES } from "@/lib/config/feed-ui";
import {
  buildDiscoverParams,
  hasActiveDiscoverState,
  type FeedDiscoverState,
} from "@/lib/feed/discover-params";
import { useFeedStore } from "@/lib/store/feed-store";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function parsePrimaryFromUrl(value: string | null): PrimaryCategoryId | null {
  if (!value) return null;
  const found = FEED_PRIMARY_CATEGORIES.find(
    (c) => c.id === value || c.slug === value,
  );
  return found?.id ?? null;
}

export function MealList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshKey = useFeedStore((s) => s.refreshKey);
  const sections = useFeedStore((s) => s.homeSections);
  const loadingHome = useFeedStore((s) => s.homeLoading);
  const homeError = useFeedStore((s) => s.homeError);
  const ensureHomeLoaded = useFeedStore((s) => s.ensureHomeLoaded);
  const ensureCollectionsLoaded = useFeedStore((s) => s.ensureCollectionsLoaded);

  const sheetFilters = useMemo(
    () => parseFeedAdvancedFilters(searchParams),
    [searchParams],
  );

  const [search, setSearch] = useState("");
  const [primaryCategory, setPrimaryCategory] =
    useState<PrimaryCategoryId | null>(() =>
      parsePrimaryFromUrl(searchParams.get("category")),
    );
  const [macroChips, setMacroChips] = useState<MacroChipId[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [discoverMeals, setDiscoverMeals] = useState<DiscoverMeal[]>([]);
  const [discoverTotal, setDiscoverTotal] = useState(0);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [previewCount, setPreviewCount] = useState<number | undefined>();

  const discoverState: FeedDiscoverState = useMemo(
    () => ({
      search,
      primaryCategory,
      macroChips,
      sheetFilters,
    }),
    [search, primaryCategory, macroChips, sheetFilters],
  );

  const showDiscover = hasActiveDiscoverState(discoverState);

  const sheetFilterCount = countFeedAdvancedFilters(sheetFilters);
  const customizeCount =
    sheetFilterCount +
    macroChips.length +
    (primaryCategory && primaryCategory !== "more" ? 1 : 0);

  const pushSheetFilters = useCallback(
    (next: FeedAdvancedFilters) => {
      const qs = feedAdvancedFiltersToSearchParams(next).toString();
      const cat =
        primaryCategory && primaryCategory !== "more"
          ? `category=${primaryCategory}`
          : "";
      const combined = [qs, cat].filter(Boolean).join("&");
      router.push(combined ? `/feed?${combined}` : "/feed", { scroll: false });
    },
    [router, primaryCategory],
  );

  useEffect(() => {
    setPrimaryCategory(parsePrimaryFromUrl(searchParams.get("category")));
  }, [searchParams]);

  useEffect(() => {
    if (showDiscover) return;
    ensureHomeLoaded();
    ensureCollectionsLoaded();
  }, [refreshKey, ensureHomeLoaded, ensureCollectionsLoaded, showDiscover]);

  useEffect(() => {
    if (!showDiscover) {
      setDiscoverMeals([]);
      setDiscoverTotal(0);
      return;
    }

    let cancelled = false;
    setLoadingDiscover(true);
    setDiscoverError(null);

    const params = buildDiscoverParams(discoverState);

    fetchDiscoverMeals(params)
      .then((result) => {
        if (!cancelled) {
          setDiscoverMeals(result.items);
          setDiscoverTotal(result.total);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDiscoverError(
            "Could not load meals. Make sure the backend is running.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDiscover(false);
      });

    return () => {
      cancelled = true;
    };
  }, [discoverState, showDiscover, refreshKey]);

  useEffect(() => {
    if (!filterOpen) return;

    let cancelled = false;
    const params = buildDiscoverParams({
      ...discoverState,
      sheetFilters,
    });

    fetchDiscoverCount(params)
      .then((total) => {
        if (!cancelled) setPreviewCount(total);
      })
      .catch(() => {
        if (!cancelled) setPreviewCount(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [filterOpen, discoverState, sheetFilters]);

  const handlePrimarySelect = useCallback((id: PrimaryCategoryId) => {
    if (id === "more") {
      setMoreOpen(true);
      return;
    }
    setPrimaryCategory((prev) => (prev === id ? null : id));
  }, []);

  const toggleMacroChip = useCallback((id: MacroChipId) => {
    setMacroChips((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }, []);

  const handleExploreCategory = useCallback((slug: string) => {
    const match = FEED_PRIMARY_CATEGORIES.find((c) => c.slug === slug);
    if (match) {
      setPrimaryCategory(match.id);
    } else {
      setMacroChips((prev) =>
        prev.includes(slug as MacroChipId)
          ? prev
          : [...prev, slug as MacroChipId],
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleViewAllSection = useCallback((sectionId: string) => {
    if (sectionId === "high-protein-meals") {
      setPrimaryCategory("high-protein");
    } else if (sectionId === "todays-picks") {
      setPrimaryCategory("popular");
    } else if (sectionId === "trending-this-week") {
      setPrimaryCategory("popular");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApplyCategories = useCallback(
    (slugs: string[]) => {
      pushSheetFilters({
        ...sheetFilters,
        categorySlugs: slugs.length ? slugs : undefined,
      });
    },
    [pushSheetFilters, sheetFilters],
  );

  const error = homeError ?? discoverError;
  const loading = loadingHome || (showDiscover && loadingDiscover);

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="bg-feed-header -mx-4 flex flex-col gap-3 rounded-br-[1.75rem] px-5 pb-2 pt-2">
        <div className="flex flex-col gap-1.5">
          <FeedHeader greeting={getGreeting()} />
          <FeedSearch
            value={search}
            onChange={setSearch}
            subtitle="Discover high-protein meals tailored to your goals."
            placeholder="Search high-protein meals, ingredients, diets…"
            onFilterClick={() => setFilterOpen(true)}
            activeFilterCount={sheetFilterCount}
            filterButtonLabel="Filters"
          />
        </div>

        <FeedPrimaryCategories
          active={primaryCategory}
          onSelect={handlePrimarySelect}
        />

        <FeedFiltersCustomize
          onClick={() => setFilterOpen(true)}
          activeCount={customizeCount}
        />

        <FeedMacroChips active={macroChips} onToggle={toggleMacroChip} />
      </div>

      <MealFilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={sheetFilters}
        onApply={pushSheetFilters}
        resultCount={previewCount}
      />

      <FeedMoreCategoriesSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        selectedSlugs={sheetFilters.categorySlugs ?? []}
        onApply={handleApplyCategories}
        onOpenFilters={() => {
          setMoreOpen(false);
          setFilterOpen(true);
        }}
      />

      {loading && !sections.length && !discoverMeals.length ? (
        <div
          className="flex flex-col items-center justify-center py-16"
          aria-busy="true"
        >
          <MealLoadingIllustration
            className="h-16 w-16 animate-pulse text-primary/50"
            label="Loading meals"
          />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {!loading && !error && showDiscover ? (
        discoverMeals.length > 0 ? (
          <FeedDiscoverResults
            meals={discoverMeals}
            total={discoverTotal}
            title="Matching meals"
          />
        ) : (
          <div className="mt-8 flex flex-col items-center px-6 py-12 text-center">
            <MealEmptyIllustration className="mb-4 h-20 w-20 text-primary/35" />
            <p className="font-heading text-lg font-semibold">No meals found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting filters or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPrimaryCategory(null);
                setMacroChips([]);
                pushSheetFilters(DEFAULT_FEED_ADVANCED_FILTERS);
              }}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Clear all
            </button>
          </div>
        )
      ) : null}

      {!showDiscover && !error ? (
        <FeedHomeSections
          sections={sections}
          onViewAll={handleViewAllSection}
          onExploreCategory={handleExploreCategory}
        />
      ) : null}
    </div>
  );
}
