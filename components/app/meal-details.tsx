import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Package2, Utensils } from "lucide-react";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import type { ApiMeal } from "@/lib/types/meal";

type MealDetailsProps = {
  meal: ApiMeal;
};

function formatQty(quantity: number, quantityUnit: "grams" | "count"): string {
  if (quantityUnit === "count") {
    const n = quantity % 1 === 0 ? String(quantity) : quantity.toFixed(1);
    return `${n}×`;
  }
  return `${quantity} g`;
}

export function MealDetails({ meal }: MealDetailsProps) {
  return (
    /* -mx-4 -mt-5 negates the layout padding so the image bleeds edge-to-edge */
    <div className="-mx-4 -mt-5 pb-10">
      <div className="relative h-[240px] w-full overflow-hidden bg-muted sm:h-[280px]">
        {meal.image ? (
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={meal.image.startsWith("data:")}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <Link
          href="/feed"
          className="absolute left-4 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-white"
          aria-label="Back to feed"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="absolute bottom-9 left-5 right-5">
          <span className="mb-1.5 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            @{meal.user.username}
          </span>
          <h1 className="font-heading text-2xl font-bold leading-tight text-white drop-shadow-sm sm:text-3xl">
            {meal.title}
          </h1>
        </div>
      </div>

      <div className="relative z-10 mx-4 -mt-4 rounded-3xl bg-card px-5 pb-8 pt-5 shadow-[0_4px_28px_rgba(0,0,0,0.12)]">
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
              <div
                className={`text-sm font-bold tabular-nums ${nc.textClass}`}
              >
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
                className="flex items-start gap-3 rounded-2xl border border-border/40 bg-background px-4 py-3.5"
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
      </div>
    </div>
  );
}
