"use client";

import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FEED_PRIMARY_CATEGORIES,
  type PrimaryCategoryId,
} from "@/lib/config/feed-ui";

type FeedPrimaryCategoriesProps = {
  active: PrimaryCategoryId | null;
  onSelect: (id: PrimaryCategoryId) => void;
};

export function FeedPrimaryCategories({
  active,
  onSelect,
}: FeedPrimaryCategoriesProps) {
  return (
    <div
      className="-mx-5 mt-3.5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="Meal categories"
    >
      <div className="flex w-max items-center gap-2 pb-0.5">
        {FEED_PRIMARY_CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          const isMore = cat.id === "more";
          const Icon = cat.icon;

          if (isMore) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-label="More categories"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border-2 border-dashed border-primary/35 bg-white/60 px-3.5 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-white active:scale-[0.98]"
              >
                <LayoutGrid className="size-4 text-primary" strokeWidth={2} />
                More
              </button>
            );
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 text-xs font-semibold transition active:scale-[0.98]",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border/50 bg-white text-foreground shadow-sm hover:border-border",
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  isActive ? "text-primary-foreground" : "text-foreground/75",
                )}
                strokeWidth={2}
                aria-hidden
              />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
