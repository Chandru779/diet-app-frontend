"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { FeedHighProteinCard } from "@/components/app/feed/feed-high-protein-card";
import type { DiscoverMeal } from "@/lib/types/meal-discover";

type FeedDiscoverResultsProps = {
  meals: DiscoverMeal[];
  total: number;
  title?: string;
  /** Refetch of the current filter set (new search/filter) is in flight. */
  loading?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
};

export function FeedDiscoverResults({
  meals,
  total,
  title = "Results",
  loading = false,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: FeedDiscoverResultsProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // Keep the latest callback without re-subscribing the observer each render.
  const loadMoreRef = useRef(onLoadMore);
  loadMoreRef.current = onLoadMore;

  useEffect(() => {
    if (!hasMore || loadingMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreRef.current?.();
      },
      // Start fetching a bit before the sentinel is fully visible for a
      // seamless scroll experience.
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, meals.length]);

  const showingAll = meals.length >= total;

  return (
    <section aria-live="polite" aria-busy={loading}>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title} ·{" "}
          <span className="tabular-nums">
            {showingAll ? total : `${meals.length} of ${total}`}
          </span>
        </p>
        {loading ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Updating…
          </span>
        ) : null}
      </div>

      <ul className="flex flex-col gap-3">
        {meals.map((meal) => (
          <li key={meal.id}>
            <FeedHighProteinCard meal={meal} />
          </li>
        ))}
      </ul>

      {/* Infinite-scroll sentinel + load-more affordance */}
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-6"
          aria-hidden={!loadingMore}
        >
          {loadingMore ? (
            <Loader2 className="size-5 animate-spin text-primary/60" />
          ) : (
            <button
              type="button"
              onClick={() => onLoadMore?.()}
              className="rounded-full border border-border/60 bg-white px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Load more
            </button>
          )}
        </div>
      ) : meals.length > 0 ? (
        <p className="py-6 text-center text-[11px] text-muted-foreground">
          You&apos;ve reached the end · {total} meal{total === 1 ? "" : "s"}
        </p>
      ) : null}
    </section>
  );
}
