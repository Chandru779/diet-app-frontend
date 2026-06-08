"use client";

import { Check } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import type { PickableMeal } from "@/lib/types/meal-pack";
import { cn } from "@/lib/utils";

type MealPackPickerRowProps = {
  meal: PickableMeal;
  selected: boolean;
  onToggle: (mealId: string) => void;
};

export function MealPackPickerRow({
  meal,
  selected,
  onToggle,
}: MealPackPickerRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(meal.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
        selected
          ? "border-primary/40 bg-primary/[0.06]"
          : "border-transparent bg-white hover:border-border/60 hover:bg-muted/20",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition",
          selected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 bg-white",
        )}
        aria-hidden
      >
        {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>

      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-muted">
        <MealCoverImage
          src={meal.image}
          mealId={meal.id}
          alt=""
          fill
          className="object-cover"
          sizes="44px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">
          {meal.title}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          <span className={NUTRIENT_COLORS.protein.textClass}>
            {Math.round(meal.proteinG)}g protein
          </span>
          <span className="mx-1">·</span>
          {Math.round(meal.caloriesKcal)} kcal
        </p>
      </div>
    </button>
  );
}
