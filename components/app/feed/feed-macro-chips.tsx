"use client";

import { cn } from "@/lib/utils";
import { FEED_MACRO_CHIPS, type MacroChipId } from "@/lib/config/feed-ui";

type FeedMacroChipsProps = {
  active: MacroChipId[];
  onToggle: (id: MacroChipId) => void;
};

export function FeedMacroChips({ active, onToggle }: FeedMacroChipsProps) {
  return (
    <div
      className="-mx-5 mt-2.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="Macro and diet filters"
    >
      <div className="flex w-max gap-2 pb-0.5">
        {FEED_MACRO_CHIPS.map((chip) => {
          const isActive = active.includes(chip.id);
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onToggle(chip.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition active:scale-[0.97]",
                chip.borderClass,
                chip.textClass,
                isActive ? chip.bgActiveClass : "bg-white",
              )}
            >
              <Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
