"use client";

import { useRef, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type PreparationStepRow = {
  id: string;
  text: string;
};

type MealPreparationEditorProps = {
  steps: PreparationStepRow[];
  onChange: (steps: PreparationStepRow[]) => void;
  className?: string;
};

export function buildPreparationStepsPayload(
  steps: PreparationStepRow[],
): { text: string }[] | undefined {
  const out = steps
    .map((s) => s.text.trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ text }));
  return out.length > 0 ? out : undefined;
}

export function MealPreparationEditor({
  steps,
  onChange,
  className,
}: MealPreparationEditorProps) {
  const lastInputRef = useRef<HTMLInputElement | null>(null);

  function updateStep(id: string, text: string) {
    onChange(steps.map((s) => (s.id === id ? { ...s, text } : s)));
  }

  function addStep(focus = true) {
    const id = Math.random().toString(36).slice(2, 9);
    onChange([...steps, { id, text: "" }]);
    if (focus) {
      requestAnimationFrame(() => lastInputRef.current?.focus());
    }
  }

  function removeStep(id: string) {
    if (steps.length <= 1) {
      onChange(steps.map((s) => (s.id === id ? { ...s, text: "" } : s)));
      return;
    }
    onChange(steps.filter((s) => s.id !== id));
  }

  function onStepKeyDown(
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
    id: string,
    text: string,
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (text.trim() && index === steps.length - 1) {
        addStep(true);
      } else if (index < steps.length - 1) {
        const next = document.querySelector<HTMLInputElement>(
          `[data-prep-step="${steps[index + 1]?.id}"]`,
        );
        next?.focus();
      } else {
        addStep(true);
      }
    }
    if (e.key === "Backspace" && !text && steps.length > 1) {
      e.preventDefault();
      removeStep(id);
      const prev = steps[index - 1];
      if (prev) {
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLInputElement>(`[data-prep-step="${prev.id}"]`)
            ?.focus();
        });
      }
    }
  }

  return (
    <section className={cn("space-y-2.5", className)}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">Preparation</h3>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
          Add quick preparation steps (optional)
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/30">
        <ul className="divide-y divide-border/40" role="list">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="group flex items-center gap-2 px-3 py-2.5 sm:px-3.5"
            >
              <span
                className="w-5 shrink-0 text-right text-[13px] font-semibold tabular-nums text-muted-foreground/80"
                aria-hidden
              >
                {index + 1}.
              </span>
              <input
                ref={index === steps.length - 1 ? lastInputRef : undefined}
                data-prep-step={step.id}
                type="text"
                value={step.text}
                onChange={(e) => updateStep(step.id, e.target.value)}
                onKeyDown={(e) => onStepKeyDown(e, index, step.id, step.text)}
                placeholder={
                  index === 0 ? "Add 100g paneer to bowl…" : "Next step…"
                }
                className="min-w-0 flex-1 border-0 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/45"
                aria-label={`Step ${index + 1}`}
              />
              {steps.length > 1 || step.text ? (
                <button
                  type="button"
                  onClick={() => removeStep(step.id)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground/40 opacity-0 transition hover:bg-muted hover:text-muted-foreground group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Remove step ${index + 1}`}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              ) : (
                <span className="size-7 shrink-0" aria-hidden />
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => addStep(true)}
        className="inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-sm font-semibold text-primary transition hover:opacity-80 active:scale-[0.98]"
      >
        <Plus className="size-4" strokeWidth={2.25} aria-hidden />
        Add step
      </button>
    </section>
  );
}
