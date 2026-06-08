"use client";

import { ChevronUp, X } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { AppPrimaryButton } from "@/components/app/app-primary-button";
import {
  roundMacro,
  sumPickableMacros,
  type PickableMeal,
} from "@/lib/types/meal-pack";
import { cn } from "@/lib/utils";

type MealPackSelectedBarProps = {
  selectedMeals: PickableMeal[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onRemove: (mealId: string) => void;
  onSave: () => void;
  onSaveAndCreateAnother?: () => void;
  saving?: boolean;
  saveLabel?: string;
  showSaveAndCreate?: boolean;
};

export function MealPackSelectedBar({
  selectedMeals,
  expanded,
  onToggleExpanded,
  onRemove,
  onSave,
  onSaveAndCreateAnother,
  saving = false,
  saveLabel = "Save pack",
  showSaveAndCreate = true,
}: MealPackSelectedBarProps) {
  const count = selectedMeals.length;
  const macros = sumPickableMacros(selectedMeals);

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px)+var(--vv-bottom-inset,0px))] z-30 mx-auto max-w-2xl px-4">
      {expanded ? (
        <div className="mb-2 max-h-48 overflow-y-auto rounded-2xl border border-border/70 bg-white p-2 shadow-lg">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-foreground">
              Selected meals
            </p>
            <button
              type="button"
              onClick={onToggleExpanded}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Collapse
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {selectedMeals.map((meal) => (
              <li
                key={meal.id}
                className="flex items-center gap-2 rounded-lg bg-muted/30 px-2 py-1.5"
              >
                <div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-muted">
                  <MealCoverImage
                    src={meal.image}
                    mealId={meal.id}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                  {meal.title}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(meal.id)}
                  aria-label={`Remove ${meal.title}`}
                  className="rounded-md p-1 text-muted-foreground hover:bg-white hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border/70 bg-white p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={onToggleExpanded}
          className="mb-2 flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="text-xs font-semibold text-foreground">
            Selected ({count}) · {roundMacro(macros.proteinG)}g protein ·{" "}
            {Math.round(macros.caloriesKcal)} kcal
          </span>
          <ChevronUp
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition",
              expanded ? "rotate-180" : "",
            )}
          />
        </button>

        <div className="flex flex-col gap-2 sm:flex-row">
          <AppPrimaryButton
            className="flex-1"
            disabled={saving || count === 0}
            onClick={onSave}
          >
            {saving ? "Saving…" : saveLabel}
          </AppPrimaryButton>
          {showSaveAndCreate && onSaveAndCreateAnother ? (
            <button
              type="button"
              disabled={saving || count === 0}
              onClick={onSaveAndCreateAnother}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted/40 disabled:opacity-50"
            >
              Save & create another
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
