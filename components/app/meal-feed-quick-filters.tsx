"use client";

import { cn } from "@/lib/utils";
import {
  MEAL_FEED_QUICK_CHIPS,
  isMealFeedQuickChipActive,
  type MealFeedFilters,
  type MealFeedQuickChipId,
} from "@/lib/config/meal-feed-filters";

type MealFeedQuickFiltersProps = {
  filters: MealFeedFilters;
  onToggle: (chipId: MealFeedQuickChipId) => void;
  className?: string;
};

export function MealFeedQuickFilters({
  filters,
  onToggle,
  className,
}: MealFeedQuickFiltersProps) {
  return (
    <div
      className={cn(
        "-mx-5 mt-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      role="toolbar"
      aria-label="Quick filters"
    >
      <div className="flex w-max gap-2 pb-0.5">
        {MEAL_FEED_QUICK_CHIPS.map((chip) => {
          const active = isMealFeedQuickChipActive(filters, chip.id);
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onToggle(chip.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.97]",
                active ? chip.activeClass : chip.inactiveClass,
              )}
            >
              {Icon ? <Icon className="size-3.5" strokeWidth={2.25} aria-hidden /> : null}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
