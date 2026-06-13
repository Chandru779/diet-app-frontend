"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";

type FeedFiltersCustomizeProps = {
  onClick: () => void;
  filterCount?: number;
  categoryCount?: number;
};

export function FeedFiltersCustomize({
  onClick,
  filterCount = 0,
  categoryCount = 0,
}: FeedFiltersCustomizeProps) {
  const hasAny = filterCount > 0 || categoryCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="meal-card flex w-full items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 text-left shadow-sm transition hover:bg-emerald-50 active:scale-[0.99]"
    >
      <SlidersHorizontal
        className="size-4 shrink-0 text-primary"
        strokeWidth={2.25}
        aria-hidden
      />
      <span className="flex min-w-0 flex-1 flex-row items-center gap-2 overflow-hidden">
        <span className="shrink-0 text-sm font-semibold text-foreground">
          Filters
        </span>
        {hasAny ? (
          <span className="flex shrink-0 items-center gap-1">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {filterCount} filter{filterCount === 1 ? "" : "s"}
            </span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
              {categoryCount} categor{categoryCount === 1 ? "y" : "ies"}
            </span>
          </span>
        ) : (
          <span className="truncate text-[10px] font-medium text-gray-400">
            Customize your meal preferences
          </span>
        )}
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground/60"
        aria-hidden
      />
    </button>
  );
}
