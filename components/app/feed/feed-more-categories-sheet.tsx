"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, Grid3X3, List, Search, Tags, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMealCategories } from "@/lib/api/discover";
import { FEED_CATEGORY_GROUP_LABELS } from "@/lib/config/feed-ui";
import type {
  MealCategoryItem,
  MealCategoriesResponse,
} from "@/lib/types/meal-discover";

type ViewMode = "grid" | "chips" | "list";

type FeedMoreCategoriesSheetProps = {
  open: boolean;
  onClose: () => void;
  selectedSlugs: string[];
  onApply: (slugs: string[]) => void;
  onOpenFilters?: () => void;
};

const GROUP_ICON: Record<string, string> = {
  goal: "🎯",
  dietary: "🥗",
  lifestyle: "✨",
  health_focus: "💚",
};

export function FeedMoreCategoriesSheet({
  open,
  onClose,
  selectedSlugs,
  onApply,
  onOpenFilters,
}: FeedMoreCategoriesSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [draft, setDraft] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<MealCategoriesResponse>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setDraft(selectedSlugs);
  }, [open, selectedSlugs]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetchMealCategories()
      .then((data) => {
        if (!cancelled) setGroups(data);
      })
      .catch(() => {
        if (!cancelled) setGroups([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const exploreGroups = useMemo(
    () =>
      groups.filter(
        (g) =>
          g.group === "goal" ||
          g.group === "dietary" ||
          g.group === "lifestyle" ||
          g.group === "health_focus",
      ),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return exploreGroups;
    return exploreGroups
      .map((g) => ({
        ...g,
        categories: g.categories.filter(
          (c) =>
            c.label.toLowerCase().includes(q) ||
            c.slug.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.categories.length > 0);
  }, [exploreGroups, search]);

  const toggleSlug = useCallback((slug: string) => {
    setDraft((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(draft);
    onClose();
  }, [draft, onApply, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="more-categories-title"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(88dvh,640px)] flex-col rounded-t-[1.75rem] bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 pb-3 pt-1">
          <h2
            id="more-categories-title"
            className="font-heading text-lg font-bold"
          >
            Categories
          </h2>
          <div className="flex items-center gap-1">
            {(
              [
                { id: "grid" as const, icon: Grid3X3, label: "Grid" },
                { id: "chips" as const, icon: Tags, label: "Chips" },
                { id: "list" as const, icon: List, label: "List" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                aria-label={label}
                aria-pressed={view === id}
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl transition",
                  view === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
            <button
              type="button"
              onClick={onClose}
              className="ml-1 flex size-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="shrink-0 px-5 pt-3">
            <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/30 px-3.5 py-2.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading categories…
            </p>
          ) : view === "grid" ? (
            <CategoryGrid
              groups={exploreGroups}
              selected={draft}
              onToggle={toggleSlug}
            />
          ) : view === "chips" ? (
            <CategoryChips
              groups={exploreGroups}
              selected={draft}
              onToggle={toggleSlug}
              onOpenFilters={onOpenFilters}
            />
          ) : (
            <CategoryList
              groups={filteredGroups}
              selected={draft}
              onToggle={toggleSlug}
            />
          )}
        </div>

        <div className="shrink-0 border-t border-border/40 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleApply}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-[0.99]"
          >
            Apply Categories
            {draft.length > 0 ? ` (${draft.length})` : ""}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}

function CategoryGrid({
  groups,
  selected,
  onToggle,
}: {
  groups: MealCategoriesResponse;
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  const items = groups.flatMap((g) => g.categories);

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {items.map((cat) => (
        <CategoryGridItem
          key={cat.slug}
          cat={cat}
          active={selected.includes(cat.slug)}
          onToggle={() => onToggle(cat.slug)}
        />
      ))}
    </div>
  );
}

function CategoryGridItem({
  cat,
  active,
  onToggle,
}: {
  cat: MealCategoryItem;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-center transition active:scale-[0.97]",
        active
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border/40 bg-white hover:border-border",
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-muted/50 text-lg">
        {cat.slug.includes("muscle")
          ? "💪"
          : cat.slug.includes("fat")
            ? "🔥"
            : "🍽️"}
      </span>
      <span className="text-[10px] font-semibold leading-tight text-foreground">
        {cat.label}
      </span>
    </button>
  );
}

function CategoryChips({
  groups,
  selected,
  onToggle,
  onOpenFilters,
}: {
  groups: MealCategoriesResponse;
  selected: string[];
  onToggle: (slug: string) => void;
  onOpenFilters?: () => void;
}) {
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.group}>
          <h3 className="mb-2.5 text-sm font-bold text-foreground">
            {FEED_CATEGORY_GROUP_LABELS[group.group] ?? group.group}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.categories.map((cat) => {
              const active = selected.includes(cat.slug);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => onToggle(cat.slug)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98]",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/60 bg-white text-foreground hover:bg-muted/40",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>
      ))}
      {onOpenFilters ? (
        <button
          type="button"
          onClick={onOpenFilters}
          className="text-sm font-semibold text-primary"
        >
          View all filters →
        </button>
      ) : null}
    </div>
  );
}

function CategoryList({
  groups,
  selected,
  onToggle,
}: {
  groups: MealCategoriesResponse;
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.group}>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {FEED_CATEGORY_GROUP_LABELS[group.group] ?? group.group}
          </h3>
          <ul className="divide-y divide-border/30 overflow-hidden rounded-2xl border border-border/40 bg-white">
            {group.categories.map((cat) => {
              const active = selected.includes(cat.slug);
              return (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onToggle(cat.slug)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-muted/30",
                      active && "bg-primary/5",
                    )}
                  >
                    <span className="text-lg" aria-hidden>
                      {GROUP_ICON[group.group] ?? "🍽️"}
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold">
                      {cat.label}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
