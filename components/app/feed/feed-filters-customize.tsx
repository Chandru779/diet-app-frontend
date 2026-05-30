"use client";

import { ChevronRight, SlidersHorizontal } from "lucide-react";

type FeedFiltersCustomizeProps = {
  onClick: () => void;
  activeCount?: number;
};

export function FeedFiltersCustomize({
  onClick,
  activeCount = 0,
}: FeedFiltersCustomizeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl border border-emerald-100/90 bg-emerald-50/80 px-3 py-2 text-left shadow-sm transition hover:bg-emerald-50 active:scale-[0.99]"
    >
      <SlidersHorizontal
        className="size-4 shrink-0 text-primary"
        strokeWidth={2.25}
        aria-hidden
      />
      <span className="flex min-w-0 flex-1 flex-row items-center gap-2 overflow-hidden">
        <span className="shrink-0 text-sm font-semibold text-foreground">
          Filters
          {activeCount > 0 ? (
            <span className="text-primary">({activeCount})</span>
          ) : null}
        </span>
        <span className="truncate text-[10px] font-medium text-gray-400">
          Customize your meal preferences
        </span>
      </span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground/60"
        aria-hidden
      />
    </button>
  );
}
