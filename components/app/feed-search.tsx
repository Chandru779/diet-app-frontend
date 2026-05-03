import { Search, SlidersHorizontal } from "lucide-react";

type FeedSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function FeedSearch({
  value,
  onChange,
  placeholder = "Search meals, ingredients…",
}: FeedSearchProps) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/30 bg-white px-4 shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear
        </button>
      ) : (
        <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground/50" />
      )}
    </div>
  );
}
