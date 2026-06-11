"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeedRangeSlider } from "@/components/app/feed/feed-range-slider";
import {
  DEFAULT_FEED_ADVANCED_FILTERS,
  FEED_CALORIE_RANGE,
  FEED_CARBS_RANGE,
  FEED_DIET_CHIPS,
  FEED_FAT_RANGE,
  FEED_MEAL_TYPE_OPTIONS,
  FEED_PREP_TIME_OPTIONS,
  FEED_PROTEIN_RANGE,
  type DietChipId,
  type FeedAdvancedFilters,
  type PrepTimePreset,
} from "@/lib/config/feed-advanced-filters";
import type { MealType } from "@/lib/types/meal";

type MealFilterSheetProps = {
  open: boolean;
  onClose: () => void;
  value: FeedAdvancedFilters;
  onApply: (next: FeedAdvancedFilters) => void;
  resultCount?: number;
};

function cloneFilters(f: FeedAdvancedFilters): FeedAdvancedFilters {
  return {
    ...f,
    mealTypes: f.mealTypes ? [...f.mealTypes] : undefined,
    dietChips: f.dietChips ? [...f.dietChips] : undefined,
    includeIngredients: f.includeIngredients
      ? [...f.includeIngredients]
      : undefined,
    excludeIngredients: f.excludeIngredients
      ? [...f.excludeIngredients]
      : undefined,
    categorySlugs: f.categorySlugs ? [...f.categorySlugs] : undefined,
  };
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-border/50 bg-white px-4 py-3.5 text-left transition active:scale-[0.99]"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block text-xs text-muted-foreground">
          {description}
        </span>
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

function IngredientInput({
  label,
  placeholder,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add() {
    const v = input.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setInput("");
  }

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">{label}</h4>
      <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-muted/20 px-3 py-2">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {values.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                className="rounded-full hover:bg-primary/20"
                aria-label={`Remove ${v}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function MealFilterSheet({
  open,
  onClose,
  value,
  onApply,
  resultCount,
}: MealFilterSheetProps) {
  const [draft, setDraft] = useState<FeedAdvancedFilters>(() =>
    cloneFilters(value),
  );
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

  const calMin = draft.caloriesMin ?? FEED_CALORIE_RANGE.min;
  const calMax = draft.caloriesMax ?? FEED_CALORIE_RANGE.max;
  const proteinMin = draft.proteinSliderMin ?? FEED_PROTEIN_RANGE.min;
  const proteinMax = draft.proteinSliderMax ?? FEED_PROTEIN_RANGE.max;
  const carbsMin = draft.carbsMin ?? FEED_CARBS_RANGE.min;
  const carbsMax = draft.carbsMax ?? FEED_CARBS_RANGE.max;
  const fatMin = draft.fatMin ?? FEED_FAT_RANGE.min;
  const fatMax = draft.fatMax ?? FEED_FAT_RANGE.max;

  const activeCount = useMemo(() => {
    let n = 0;
    if (draft.caloriesMin != null || draft.caloriesMax != null) n += 1;
    if (draft.proteinSliderMin != null || draft.proteinSliderMax != null)
      n += 1;
    if (draft.carbsMin != null || draft.carbsMax != null) n += 1;
    if (draft.fatMin != null || draft.fatMax != null) n += 1;
    if (draft.mealTypes?.length) n += draft.mealTypes.length;
    if (draft.dietChips?.length) n += draft.dietChips.length;
    if (draft.prepTimePreset != null) n += 1;
    if (draft.includeIngredients?.length) n += 1;
    if (draft.excludeIngredients?.length) n += 1;
    if (draft.isQuick) n += 1;
    if (draft.isBeginnerFriendly) n += 1;
    if (draft.isBudgetFriendly) n += 1;
    return n;
  }, [draft]);

  const toggleMealType = useCallback((type: MealType) => {
    setDraft((d) => {
      const current = d.mealTypes ?? [];
      const next = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];
      return { ...d, mealTypes: next.length ? next : undefined };
    });
  }, []);

  const toggleDiet = useCallback((id: DietChipId) => {
    setDraft((d) => {
      const current = d.dietChips ?? [];
      const next = current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id];
      return { ...d, dietChips: next.length ? next : undefined };
    });
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({
      ...DEFAULT_FEED_ADVANCED_FILTERS,
      categorySlugs: value.categorySlugs,
    });
  }, [value.categorySlugs]);

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
          "fixed inset-x-0 bottom-0 z-[60] flex max-h-[min(90dvh,680px)] flex-col rounded-t-[1.75rem] bg-white shadow-[0_-12px_48px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 pb-3 pt-1">
          <h2
            id="meal-filter-sheet-title"
            className="font-heading text-lg font-bold"
          >
            Filters
          </h2>
          <button
            type="button"
            onClick={resetDraft}
            className="text-sm font-semibold text-primary"
          >
            Reset
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          <section className="space-y-4" aria-label="Macro ranges">
            <FeedRangeSlider
              label="Calories (kcal)"
              unit="kcal"
              min={FEED_CALORIE_RANGE.min}
              max={FEED_CALORIE_RANGE.max}
              valueMin={calMin}
              valueMax={calMax}
              onChange={(lo, hi) =>
                setDraft((d) => ({
                  ...d,
                  caloriesMin: lo > FEED_CALORIE_RANGE.min ? lo : undefined,
                  caloriesMax: hi < FEED_CALORIE_RANGE.max ? hi : undefined,
                }))
              }
            />
            <FeedRangeSlider
              label="Protein (g)"
              unit="g"
              min={FEED_PROTEIN_RANGE.min}
              max={FEED_PROTEIN_RANGE.max}
              valueMin={proteinMin}
              valueMax={proteinMax}
              onChange={(lo, hi) =>
                setDraft((d) => ({
                  ...d,
                  proteinSliderMin:
                    lo > FEED_PROTEIN_RANGE.min ? lo : undefined,
                  proteinSliderMax:
                    hi < FEED_PROTEIN_RANGE.max ? hi : undefined,
                }))
              }
            />
            <FeedRangeSlider
              label="Carbs (g)"
              unit="g"
              min={FEED_CARBS_RANGE.min}
              max={FEED_CARBS_RANGE.max}
              valueMin={carbsMin}
              valueMax={carbsMax}
              onChange={(lo, hi) =>
                setDraft((d) => ({
                  ...d,
                  carbsMin: lo > FEED_CARBS_RANGE.min ? lo : undefined,
                  carbsMax: hi < FEED_CARBS_RANGE.max ? hi : undefined,
                }))
              }
            />
            <FeedRangeSlider
              label="Fat (g)"
              unit="g"
              min={FEED_FAT_RANGE.min}
              max={FEED_FAT_RANGE.max}
              valueMin={fatMin}
              valueMax={fatMax}
              onChange={(lo, hi) =>
                setDraft((d) => ({
                  ...d,
                  fatMin: lo > FEED_FAT_RANGE.min ? lo : undefined,
                  fatMax: hi < FEED_FAT_RANGE.max ? hi : undefined,
                }))
              }
            />
          </section>

          <section aria-labelledby="filter-meal-type">
            <h3
              id="filter-meal-type"
              className="mb-3 text-sm font-semibold text-foreground"
            >
              Meal Type
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {FEED_MEAL_TYPE_OPTIONS.map((opt) => {
                const selected = draft.mealTypes?.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMealType(opt.value)}
                    aria-pressed={selected}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98]",
                      selected
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-white",
                    )}
                  >
                    <span className="text-xl" aria-hidden>
                      {opt.emoji}
                    </span>
                    <span className="text-[10px] font-semibold">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="filter-diet">
            <h3
              id="filter-diet"
              className="mb-3 text-sm font-semibold text-foreground"
            >
              Diet Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {FEED_DIET_CHIPS.map((chip) => {
                const selected = draft.dietChips?.includes(chip.id);
                const isNonVeg = chip.id === "non-veg";
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => toggleDiet(chip.id)}
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98]",
                      selected
                        ? isNonVeg
                          ? "border-rose-400 bg-rose-500 text-white"
                          : "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-white text-foreground",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="filter-prep">
            <h3
              id="filter-prep"
              className="mb-3 text-sm font-semibold text-foreground"
            >
              Prep Time
            </h3>
            <div className="flex flex-wrap gap-2">
              {FEED_PREP_TIME_OPTIONS.map((opt) => {
                const selected = draft.prepTimePreset === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        prepTimePreset: selected ? undefined : opt.value,
                      }))
                    }
                    aria-pressed={selected}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-[0.98]",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/60 bg-white text-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4" aria-label="Ingredients">
            <IngredientInput
              label="Include Ingredients"
              placeholder="e.g. Chicken, Paneer…"
              values={draft.includeIngredients ?? []}
              onChange={(includeIngredients) =>
                setDraft((d) => ({
                  ...d,
                  includeIngredients: includeIngredients.length
                    ? includeIngredients
                    : undefined,
                }))
              }
            />
            <IngredientInput
              label="Exclude Ingredients"
              placeholder="e.g. Nuts, Dairy…"
              values={draft.excludeIngredients ?? []}
              onChange={(excludeIngredients) =>
                setDraft((d) => ({
                  ...d,
                  excludeIngredients: excludeIngredients.length
                    ? excludeIngredients
                    : undefined,
                }))
              }
            />
          </section>

          <section className="space-y-2" aria-labelledby="filter-more">
            <h3
              id="filter-more"
              className="text-sm font-semibold text-foreground"
            >
              More Options
            </h3>
            <ToggleRow
              label="Quick Meals Only"
              description="Under 20 minutes prep"
              checked={Boolean(draft.isQuick)}
              onChange={(isQuick) =>
                setDraft((d) => ({ ...d, isQuick: isQuick || undefined }))
              }
            />
            <ToggleRow
              label="Beginner Friendly"
              description="Easy to prepare"
              checked={Boolean(draft.isBeginnerFriendly)}
              onChange={(isBeginnerFriendly) =>
                setDraft((d) => ({
                  ...d,
                  isBeginnerFriendly: isBeginnerFriendly || undefined,
                }))
              }
            />
            <ToggleRow
              label="Budget Friendly"
              description="Affordable ingredients"
              checked={Boolean(draft.isBudgetFriendly)}
              onChange={(isBudgetFriendly) =>
                setDraft((d) => ({
                  ...d,
                  isBudgetFriendly: isBudgetFriendly || undefined,
                }))
              }
            />
          </section>
        </div>

        <div className="shrink-0 border-t border-border/40 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleApply}
            className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-95 active:scale-[0.99]"
          >
            {resultCount != null
              ? `Apply Filters (${resultCount})`
              : activeCount > 0
                ? `Apply Filters (${activeCount})`
                : "Apply Filters"}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
