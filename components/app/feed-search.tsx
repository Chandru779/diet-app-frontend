import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  subtitle?: string;
  onFilterClick?: () => void;
  activeFilterCount?: number;
  filterButtonLabel?: string;
  loading?: boolean;
};

export function FeedSearch({
  value,
  onChange,
  placeholder = "Search meals, ingredients…",
  subtitle,
  onFilterClick,
  activeFilterCount = 0,
  filterButtonLabel = "Sort & more",
  loading = false,
}: FeedSearchProps) {
  return (
    <div>
      {subtitle ? (
        <p className="mb-2.5 text-[13px] leading-snug text-muted-foreground">
          {subtitle}
        </p>
      ) : null}

      <div className="meal-card flex min-h-[48px] items-center gap-2 rounded-2xl bg-white py-1.5 pl-4 pr-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:ring-2 focus-within:ring-ring/25">
        {loading ? (
          <Loader2
            className="size-[18px] shrink-0 animate-spin text-primary"
            strokeWidth={2}
            aria-label="Searching"
          />
        ) : (
          <Search
            className="size-[18px] shrink-0 text-foreground/70"
            strokeWidth={2}
            aria-hidden
          />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/50"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 px-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
        {onFilterClick ? (
          <button
            type="button"
            onClick={onFilterClick}
            aria-label={
              activeFilterCount > 0
                ? `${filterButtonLabel}, ${activeFilterCount} active`
                : filterButtonLabel
            }
            className={cn(
              "relative flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.97]",
            )}
          >
            <SlidersHorizontal
              className="size-[17px]"
              strokeWidth={2.25}
              aria-hidden
            />
            {activeFilterCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-primary shadow-sm ring-2 ring-primary">
                {activeFilterCount > 9 ? "9+" : activeFilterCount}
              </span>
            ) : null}
          </button>
        ) : null}
      </div>
    </div>
  );
}
