import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";

type MacroSummaryProps = {
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
  fiberG: number | null;
  sugarG: number | null;
};

const macros = [
  {
    label: "Protein",
    getValue: (p: MacroSummaryProps) => `${p.proteinG}g`,
    nc: NUTRIENT_COLORS.protein,
  },
  {
    label: "Carbs",
    getValue: (p: MacroSummaryProps) => `${p.carbsG}g`,
    nc: NUTRIENT_COLORS.carbs,
  },
  {
    label: "Fat",
    getValue: (p: MacroSummaryProps) => `${p.fatG}g`,
    nc: NUTRIENT_COLORS.fat,
  },
  {
    label: "Calories",
    getValue: (p: MacroSummaryProps) => `${p.caloriesKcal}`,
    nc: NUTRIENT_COLORS.calories,
  },
] as const;

export function MacroSummary(props: MacroSummaryProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        {macros.map(({ label, getValue, nc }) => (
          <div
            key={label}
            className={`rounded-xl border px-2 py-3 text-center ${nc.bgClass} ${nc.borderClass}`}
          >
            <div className={`text-sm font-bold tabular-nums ${nc.textClass}`}>
              {getValue(props)}
            </div>
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>

      {props.fiberG != null ? (
        <div className="flex gap-2 px-0.5">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${NUTRIENT_COLORS.fiber.bgClass} ${NUTRIENT_COLORS.fiber.borderClass} ${NUTRIENT_COLORS.fiber.textClass}`}
          >
            Fiber {props.fiberG}g
          </span>
        </div>
      ) : null}
    </div>
  );
}
