import Link from "next/link";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { MealDetailScrollShell } from "@/components/app/meal-detail-scroll-shell";
import {
  ArrowLeft,
  BadgeCheck,
  ChefHat,
  Package2,
  Utensils,
} from "lucide-react";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import { SYSTEM_USER, isSystemUser } from "@/lib/constants/system-user";
import type { ApiMeal } from "@/lib/types/meal";

type MealDetailsProps = {
  meal: ApiMeal;
};

function formatQty(
  quantity: number,
  quantityUnit: "grams" | "count" | "ml",
): string {
  if (quantityUnit === "count") {
    const n = quantity % 1 === 0 ? String(quantity) : quantity.toFixed(1);
    return `${n}×`;
  }
  if (quantityUnit === "ml") {
    return `${quantity} ml`;
  }
  return `${quantity} g`;
}

function MealDetailHero({ meal }: { meal: ApiMeal }) {
  return (
    <>
      {meal.image ? (
        <MealCoverImage
          src={meal.image}
          mealId={meal.id}
          alt={meal.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted via-background to-muted">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
              <Utensils className="size-6 text-muted-foreground/70" />
            </div>
            <p className="text-xs font-medium">Meal photo</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 px-6 pb-11 sm:px-8 sm:pb-12">
        <span className="inline-flex w-fit items-center gap-0.5 rounded-full bg-black/35 px-2.5 py-px text-[9px] font-semibold uppercase tracking-wide text-white/85 backdrop-blur-sm ring-1 ring-white/10">
          {isSystemUser(meal.user.username) ? (
            <>
              <BadgeCheck className="size-2.5 shrink-0" aria-hidden="true" />
              {SYSTEM_USER.displayName}
            </>
          ) : (
            `@${meal.user.username}`
          )}
        </span>
        <h1 className="font-heading text-[1.6rem] font-bold leading-[1.22] tracking-tight text-white drop-shadow-md sm:text-[1.85rem]">
          {meal.title}
        </h1>
      </div>
    </>
  );
}

export function MealDetails({ meal }: MealDetailsProps) {
  return (
    <MealDetailScrollShell
      hero={<MealDetailHero meal={meal} />}
      backButton={
        <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+0.625rem)] z-[5] mx-auto flex max-w-2xl pl-3 pr-4">
          <Link
            href="/feed"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white"
            aria-label="Back to feed"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      }
    >
      {meal.description ? (
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          {meal.description}
        </p>
      ) : null}

      <div className="mb-6 grid grid-cols-4 gap-2">
        {(
          [
            {
              label: "Protein",
              value: `${meal.proteinG}g`,
              nc: NUTRIENT_COLORS.protein,
            },
            {
              label: "Carbs",
              value: `${meal.carbsG}g`,
              nc: NUTRIENT_COLORS.carbs,
            },
            {
              label: "Fat",
              value: `${meal.fatG}g`,
              nc: NUTRIENT_COLORS.fat,
            },
            {
              label: "Kcal",
              value: `${meal.caloriesKcal}`,
              nc: NUTRIENT_COLORS.calories,
            },
          ] as const
        ).map(({ label, value, nc }) => (
          <div
            key={label}
            className={`rounded-2xl border px-2 py-3 text-center ${nc.bgClass} ${nc.borderClass}`}
          >
            <div className={`text-sm font-bold tabular-nums ${nc.textClass}`}>
              {value}
            </div>
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>

      {meal.fiberG != null ? (
        <div className="mb-5 flex">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${NUTRIENT_COLORS.fiber.bgClass} ${NUTRIENT_COLORS.fiber.borderClass} ${NUTRIENT_COLORS.fiber.textClass}`}
          >
            Fiber {meal.fiberG}g
          </span>
        </div>
      ) : null}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Package2 className="size-4 text-primary" />
          <h2 className="font-heading text-lg font-bold">Ingredients</h2>
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {meal.ingredients.length}
          </span>
        </div>

        <ul className="space-y-2">
          {meal.ingredients.map((ing, idx) => (
            <li
              key={ing.id}
              className="meal-card flex items-start gap-3 rounded-2xl bg-background px-4 py-3.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {idx + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {ing.name}
                  </p>
                  <span className="shrink-0 rounded-lg bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {formatQty(ing.quantity, ing.quantityUnit ?? "grams")}
                  </span>
                </div>

                <p className="mt-1.5 flex flex-wrap gap-x-2.5 text-xs">
                  <span
                    className={`font-semibold ${NUTRIENT_COLORS.protein.textClass}`}
                  >
                    P {ing.proteinG}g
                  </span>
                  <span
                    className={`font-semibold ${NUTRIENT_COLORS.carbs.textClass}`}
                  >
                    C {ing.carbsG}g
                  </span>
                  <span
                    className={`font-semibold ${NUTRIENT_COLORS.fat.textClass}`}
                  >
                    F {ing.fatG}g
                  </span>
                  <span
                    className={`font-semibold ${NUTRIENT_COLORS.calories.textClass}`}
                  >
                    {ing.caloriesKcal} kcal
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {meal.preparationSteps && meal.preparationSteps.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <ChefHat className="size-4 text-primary" />
            <h2 className="font-heading text-lg font-bold">Preparation</h2>
          </div>
          <ol className="space-y-2">
            {meal.preparationSteps.map((step, idx) => (
              <li
                key={`${idx}-${step.text.slice(0, 24)}`}
                className="meal-card flex gap-3 rounded-2xl bg-muted/30 px-4 py-3"
              >
                <span className="w-5 shrink-0 text-right text-sm font-semibold tabular-nums text-muted-foreground">
                  {idx + 1}.
                </span>
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </MealDetailScrollShell>
  );
}
