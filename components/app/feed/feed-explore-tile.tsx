"use client";

import { ChevronRight } from "lucide-react";
import { EXPLORE_TILE_STYLES } from "@/lib/config/feed-ui";
import { cn } from "@/lib/utils";

type FeedExploreTileProps = {
  slug: string;
  label: string;
  onSelect?: (slug: string) => void;
};

export function FeedExploreTile({ slug, label, onSelect }: FeedExploreTileProps) {
  const style = EXPLORE_TILE_STYLES[slug] ?? {
    bg: "bg-muted",
    accent: "text-foreground",
  };

  const shortTitle = label.split("(")[0]?.trim() ?? label;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(slug)}
      className={cn(
        "meal-card flex w-[8.5rem] shrink-0 snap-start flex-col rounded-2xl p-3.5 text-left shadow-sm transition active:scale-[0.98]",
        style.bg,
      )}
    >
      <span
        className={cn(
          "font-heading text-sm font-bold leading-tight",
          style.accent,
        )}
      >
        {shortTitle}
      </span>
      {label.includes("(") ? (
        <span className="mt-0.5 text-[10px] font-medium opacity-80">
          {label.match(/\(([^)]+)\)/)?.[1]}
        </span>
      ) : null}
      <span className="mt-3 inline-flex items-center gap-0.5 text-[10px] font-semibold opacity-70">
        Explore
        <ChevronRight className="size-3" />
      </span>
    </button>
  );
}
