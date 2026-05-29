"use client";

import { cn } from "@/lib/utils";

type FeedRangeSliderProps = {
  label: string;
  unit: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  className?: string;
};

export function FeedRangeSlider({
  label,
  unit,
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  className,
}: FeedRangeSliderProps) {
  const lo = Math.min(valueMin, valueMax);
  const hi = Math.max(valueMin, valueMax);
  const span = max - min || 1;
  const leftPct = ((lo - min) / span) * 100;
  const widthPct = ((hi - lo) / span) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {lo} – {hi} {unit}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-muted/70">
        <div
          className="absolute inset-y-0 rounded-full bg-primary"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange(Number(e.target.value), hi)}
          className="pointer-events-auto absolute inset-0 z-10 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange(lo, Number(e.target.value))}
          className="pointer-events-auto absolute inset-0 z-20 h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
          aria-label={`${label} maximum`}
        />
      </div>
    </div>
  );
}
