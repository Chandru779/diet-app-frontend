import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  activeFilterCount?: number;
  filterButtonLabel?: string;
};

export function FeedSearch({
  value,
  onChange,
  placeholder = "Search meals, ingredients…",
  onFilterClick,
  activeFilterCount = 0,
  filterButtonLabel = "Sort & more",
}: FeedSearchProps) {
  return (
    <div className="mt-4 flex items-center gap-2.5">
      <div className="flex min-h-[46px] flex-1 items-center gap-2.5 rounded-2xl border border-border/25 bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-ring/30">
        <Search className="size-[18px] shrink-0 text-muted-foreground/80" strokeWidth={2} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[46px] flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/45"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        disabled={!onFilterClick}
        aria-label={
          activeFilterCount > 0
            ? `${filterButtonLabel}, ${activeFilterCount} active`
            : filterButtonLabel
        }
        className={cn(
          "relative flex size-[46px] shrink-0 items-center justify-center rounded-2xl border-0 shadow-md transition active:scale-[0.97]",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          !onFilterClick && "pointer-events-none opacity-50",
        )}
      >
        <SlidersHorizontal className="size-[18px] text-white" strokeWidth={2} aria-hidden />
        {activeFilterCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary shadow-sm ring-2 ring-primary">
            {activeFilterCount > 9 ? "9+" : activeFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}
