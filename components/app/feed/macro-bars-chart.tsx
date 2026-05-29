import { cn } from "@/lib/utils";

type MacroBarsChartProps = {
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number | null;
  compact?: boolean;
  className?: string;
};

function BarRow({
  label,
  value,
  max,
  colorClass,
  barClass,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  barClass: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "w-3 shrink-0 text-[10px] font-bold tabular-nums",
          colorClass,
        )}
      >
        {label}
      </span>
      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-[10px] font-semibold tabular-nums text-muted-foreground">
        {Math.round(value)}g
      </span>
    </div>
  );
}

export function MacroBarsChart({
  proteinG,
  carbsG,
  fatG,
  fiberG,
  compact,
  className,
}: MacroBarsChartProps) {
  const max = Math.max(proteinG, carbsG, fatG, fiberG ?? 0, 1);

  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-1",
        compact ? "min-w-[72px]" : "min-w-[88px]",
        className,
      )}
    >
      <BarRow
        label="P"
        value={proteinG}
        max={max}
        colorClass="text-emerald-600"
        barClass="bg-emerald-500"
      />
      <BarRow
        label="C"
        value={carbsG}
        max={max}
        colorClass="text-blue-600"
        barClass="bg-blue-500"
      />
      <BarRow
        label="F"
        value={fatG}
        max={max}
        colorClass="text-orange-500"
        barClass="bg-orange-400"
      />
      {fiberG != null && fiberG > 0 ? (
        <BarRow
          label="Fi"
          value={fiberG}
          max={max}
          colorClass="text-violet-600"
          barClass="bg-violet-500"
        />
      ) : null}
    </div>
  );
}
