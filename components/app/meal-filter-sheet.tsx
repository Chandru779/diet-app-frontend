"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MEAL_FEED_FILTERS,
  MEAL_FEED_LIGHT_MAX_KCAL,
  MEAL_FEED_PROTEIN_MIN_OPTIONS,
  MEAL_FEED_SORT_OPTIONS,
  type MealFeedFilters,
  type MealFeedProteinMin,
  type MealFeedSort,
} from "@/lib/config/meal-feed-filters";

type MealFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  value: MealFeedFilters;
  onApply: (next: MealFeedFilters) => void;
  resultCount?: number;
};

function cloneFilters(f: MealFeedFilters): MealFeedFilters {
  return { ...f };
}

export function MealFilterSheet({
  open,
  onClose,
  value,
  onApply,
  resultCount,
}: MealFilterSheetProps) {
  const [draft, setDraft] = useState<MealFeedFilters>(() => cloneFilters(value));
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setDraft(cloneFilters(value));
  }, [open, value]);

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

  const hasChanges = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(value),
    [draft, value],
  );

  const setSort = useCallback((sort: MealFeedSort) => {
    setDraft((d) => ({ ...d, sort }));
  }, []);

  const setProteinMin = useCallback((proteinMin: MealFeedProteinMin | undefined) => {
    setDraft((d) => ({ ...d, proteinMin }));
  }, []);

  const setLightMeal = useCallback((lightMeal: boolean) => {
    setDraft((d) => ({ ...d, lightMeal: lightMeal || undefined }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({
      ...DEFAULT_MEAL_FEED_FILTERS,
      category: value.category,
    });
  }, [value.category]);

  const handleApply = useCallback(() => {
    onApply(cloneFilters(draft));
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
        aria-labelledby="meal-filter-sheet-title"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(72dvh,520px)] flex-col rounded-t-[1.75rem] bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 pb-3 pt-1">
          <div>
            <h2
              id="meal-filter-sheet-title"
              className="font-heading text-lg font-bold"
            >
              Sort &amp; more
            </h2>
            <p className="text-xs text-muted-foreground">
              Diet &amp; quick picks are on the feed — use chips above
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section aria-labelledby="filter-sort-heading">
            <h3
              id="filter-sort-heading"
              className="mb-2.5 text-sm font-semibold text-foreground"
            >
              Sort by
            </h3>
            <div className="flex flex-col gap-2">
              {MEAL_FEED_SORT_OPTIONS.map((opt) => {
                const selected = draft.sort === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSort(opt.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition active:scale-[0.99]",
                      selected
                        ? "border-primary/25 bg-primary/8"
                        : "border-border/50 bg-card/40",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {opt.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {opt.description}
                      </span>
                    </span>
                    {selected ? (
                      <Check
                        className="size-4 shrink-0 text-primary"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="filter-protein-heading">
            <h3
              id="filter-protein-heading"
              className="mb-1 text-sm font-semibold text-foreground"
            >
              Minimum protein
            </h3>
            <p className="mb-2.5 text-[11px] text-muted-foreground">
              Also available as quick chips on the feed
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProteinMin(undefined)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-[0.98]",
                  draft.proteinMin == null
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-foreground hover:bg-muted/40",
                )}
              >
                Any
              </button>
              {MEAL_FEED_PROTEIN_MIN_OPTIONS.map((opt) => {
                const selected = draft.proteinMin === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setProteinMin(selected ? undefined : opt.value)
                    }
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-[0.98]",
                      selected
                        ? "border-amber-400 bg-amber-500 text-white"
                        : "border-amber-200/80 bg-white text-amber-900 hover:bg-amber-50",
                    )}
                  >
                    {opt.label} protein
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="filter-light-heading">
            <button
              id="filter-light-heading"
              type="button"
              onClick={() => setLightMeal(!draft.lightMeal)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99]",
                draft.lightMeal
                  ? "border-sky-300 bg-sky-50"
                  : "border-border/50 bg-card/40",
              )}
            >
              <span>
                <span className="block text-sm font-semibold">Light meals</span>
                <span className="block text-xs text-muted-foreground">
                  Under {MEAL_FEED_LIGHT_MAX_KCAL} kcal per meal
                </span>
              </span>
              <span
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                  draft.lightMeal ? "bg-sky-500" : "bg-muted",
                )}
                aria-hidden
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                    draft.lightMeal ? "left-[22px]" : "left-0.5",
                  )}
                />
              </span>
            </button>
          </section>
        </div>

        <div className="shrink-0 border-t border-border/40 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-card text-sm font-semibold transition hover:bg-muted/50 active:scale-[0.99]"
            >
              <RotateCcw className="size-4" aria-hidden />
              Reset sort &amp; more
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex min-h-11 flex-[1.35] items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-[0.99]"
            >
              {resultCount != null
                ? `Show ${resultCount} meal${resultCount === 1 ? "" : "s"}`
                : hasChanges
                  ? "Apply"
                  : "Done"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
