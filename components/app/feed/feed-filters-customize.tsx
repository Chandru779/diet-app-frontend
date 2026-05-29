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
      className="mt-3.5 flex w-full items-center gap-3 rounded-2xl border border-emerald-100/90 bg-emerald-50/80 px-4 py-3 text-left shadow-sm transition hover:bg-emerald-50 active:scale-[0.99]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
        <SlidersHorizontal className="size-4 text-primary" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          Filters
          {activeCount > 0 ? (
            <span className="ml-1.5 text-primary">({activeCount})</span>
          ) : null}
        </span>
        <span className="block text-xs text-muted-foreground">
          Customize your meal preferences
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground/60" />
    </button>
  );
}
