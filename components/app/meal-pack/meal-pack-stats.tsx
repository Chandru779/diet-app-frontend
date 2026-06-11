"use client";

import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import type { MealPackSummary } from "@/lib/api/meal-packs";
import { cn } from "@/lib/utils";

type MealPackStatsProps = {
  pack: Pick<
    MealPackSummary,
    | "mealCount"
    | "totalProteinG"
    | "totalCarbsG"
    | "totalFatG"
    | "totalFiberG"
    | "totalCaloriesKcal"
  >;
  className?: string;
  showPerMeal?: boolean;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function MealPackStats({
  pack,
  className,
  showPerMeal = true,
}: MealPackStatsProps) {
  const perMeal =
    pack.mealCount > 0
      ? {
          calories: round1(pack.totalCaloriesKcal / pack.mealCount),
          protein: round1(pack.totalProteinG / pack.mealCount),
        }
      : null;

  const stats = [
    {
      label: "Calories",
      value: `${Math.round(pack.totalCaloriesKcal)}`,
      unit: "kcal",
      ...NUTRIENT_COLORS.calories,
    },
    {
      label: "Protein",
      value: `${pack.totalProteinG}`,
      unit: "g",
      ...NUTRIENT_COLORS.protein,
    },
    {
      label: "Carbs",
      value: `${pack.totalCarbsG}`,
      unit: "g",
      ...NUTRIENT_COLORS.carbs,
    },
    {
      label: "Fat",
      value: `${pack.totalFatG}`,
      unit: "g",
      ...NUTRIENT_COLORS.fat,
    },
    {
      label: "Fiber",
      value: `${pack.totalFiberG}`,
      unit: "g",
      ...NUTRIENT_COLORS.fiber,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border px-3 py-2.5",
              stat.bgClass,
              stat.borderClass,
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
              {stat.label}
            </p>
            <p
              className={cn(
                "mt-0.5 text-lg font-bold tabular-nums",
                stat.textClass,
              )}
            >
              {stat.value}
              <span className="ml-0.5 text-xs font-semibold">{stat.unit}</span>
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
            Meals
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
            {pack.mealCount}
          </p>
        </div>
      </div>

      {showPerMeal && perMeal ? (
        <p className="text-[12px] text-muted-foreground">
          ~{Math.round(perMeal.calories)} kcal and ~{perMeal.protein}g protein
          per meal on average
        </p>
      ) : null}
    </div>
  );
}
