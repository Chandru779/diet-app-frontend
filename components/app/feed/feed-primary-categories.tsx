"use client";

import { cn } from "@/lib/utils";
import {
  FEED_PRIMARY_CATEGORIES,
  type PrimaryCategoryId,
} from "@/lib/config/feed-ui";

type FeedPrimaryCategoriesProps = {
  active: PrimaryCategoryId | null;
  onSelect: (id: PrimaryCategoryId) => void;
};

function categoryIconClass(id: PrimaryCategoryId, isActive: boolean): string {
  if (isActive) return "text-primary-foreground";
  if (id === "quick-meals") return "text-amber-500";
  return "text-foreground/80";
}

function splitCategoryLabel(label: string): [string, string | null] {
  const words = label.trim().split(/\s+/);
  if (words.length <= 1) return [label, null];
  if (words.length === 2) return [words[0], words[1]];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
}

function CategoryLabel({ label }: { label: string }) {
  const [line1, line2] = splitCategoryLabel(label);

  return (
    <span className="flex min-h-[2.2em] max-w-full flex-col items-center justify-center text-center text-[10px] font-semibold leading-[1.1]">
      <span className="block">{line1}</span>
      {line2 ? <span className="block">{line2}</span> : null}
    </span>
  );
}

export function FeedPrimaryCategories({
  active,
  onSelect,
}: FeedPrimaryCategoriesProps) {
  return (
    <div
      className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="toolbar"
      aria-label="Meal categories"
    >
      <div className="flex w-max items-start gap-2 pb-0.5">
        {FEED_PRIMARY_CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={cat.id !== "more" ? isActive : undefined}
              aria-label={cat.id === "more" ? "More categories" : cat.label}
              className={cn(
                "flex size-[4.25rem] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border px-0.5 py-1.5 transition active:scale-[0.98]",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-gray-100 bg-white text-foreground shadow-sm hover:border-gray-200",
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  categoryIconClass(cat.id, isActive),
                )}
                strokeWidth={2}
                aria-hidden
              />
              <CategoryLabel label={cat.label} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
