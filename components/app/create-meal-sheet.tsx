"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Plus, Trash2, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useFeedStore } from "@/lib/store/feed-store";
import { PREDEFINED_INGREDIENTS } from "@/lib/constants/predefined-ingredients";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import { createMeal } from "@/lib/api/meal";

// ── Types ────────────────────────────────────────────────────────────────────

type IngredientRow = {
  id: string;
  ingredientKey: string;
  quantity: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

const QUICK_GRAMS = [50, 100, 150, 200, 250] as const;

// ── Main component ───────────────────────────────────────────────────────────

export function CreateMealSheet() {
  const displayName = useAuthStore((s) => s.displayName);
  const bumpRefresh = useFeedStore((s) => s.bumpRefresh);
  const isOpen = useFeedStore((s) => s.isCreateSheetOpen);
  const closeStoreSheet = useFeedStore((s) => s.closeCreateSheet);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<IngredientRow[]>([
    { id: uid(), ingredientKey: "", quantity: "100" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Derived state ──────────────────────────────────────────────────────────

  const liveTotal = useMemo(() => {
    let proteinG = 0,
      carbsG = 0,
      fatG = 0,
      caloriesKcal = 0;
    for (const row of rows) {
      const preset = PREDEFINED_INGREDIENTS.find(
        (p) => p.key === row.ingredientKey,
      );
      const qty = parseFloat(row.quantity);
      if (!preset || !qty || qty <= 0) continue;
      const f = qty / 100;
      proteinG += preset.proteinPer100g * f;
      carbsG += preset.carbsPer100g * f;
      fatG += preset.fatPer100g * f;
      caloriesKcal += preset.caloriesPer100g * f;
    }
    return {
      proteinG: round1(proteinG),
      carbsG: round1(carbsG),
      fatG: round1(fatG),
      caloriesKcal: Math.round(caloriesKcal),
    };
  }, [rows]);

  const hasValidRows = rows.some(
    (r) => r.ingredientKey && parseFloat(r.quantity) > 0,
  );
  const canSubmit = title.trim().length > 0 && hasValidRows && !submitting;

  // ── Row helpers ────────────────────────────────────────────────────────────

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { id: uid(), ingredientKey: "", quantity: "100" },
    ]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const setRowIngredient = (id: string, ingredientKey: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ingredientKey } : r)),
    );

  const setRowQty = (id: string, quantity: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantity } : r)),
    );

  // ── Sheet lifecycle ────────────────────────────────────────────────────────

  function resetForm() {
    setTitle("");
    setDescription("");
    setRows([{ id: uid(), ingredientKey: "", quantity: "100" }]);
    setError(null);
    setSuccess(false);
  }

  function close() {
    closeStoreSheet();
    setTimeout(resetForm, 350);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const validRows = rows.filter(
      (r) => r.ingredientKey && parseFloat(r.quantity) > 0,
    );

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      isVegetarian: true,
      ingredients: validRows.map((row) => {
        const preset = PREDEFINED_INGREDIENTS.find(
          (p) => p.key === row.ingredientKey,
        )!;
        return {
          name: preset.name,
          quantity: parseFloat(row.quantity),
          quantityUnit: "grams" as const,
          nutritionBaseQuantity: 100,
          proteinG: preset.proteinPer100g,
          carbsG: preset.carbsPer100g,
          fatG: preset.fatPer100g,
          caloriesKcal: preset.caloriesPer100g,
          fiberG: preset.fiberPer100g,
        };
      }),
    };

    try {
      await createMeal(payload, displayName ?? "guest");
      setSuccess(true);
      bumpRefresh();
      setTimeout(close, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create meal. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden
      />

      {/* ── Sheet panel ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] flex max-h-[90dvh] flex-col rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 py-3">
          <div>
            <h2 className="font-heading text-lg font-bold">New Meal Post</h2>
            <p className="text-xs text-muted-foreground">
              Add ingredients to auto-calculate macros
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Meal name */}
          <div>
            <label
              htmlFor="meal-title"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Meal name{" "}
              <span className="text-rose-500" aria-hidden>
                *
              </span>
            </label>
            <input
              id="meal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grilled Chicken Bowl"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="meal-desc"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Description{" "}
              <span className="text-muted-foreground/50">(optional)</span>
            </label>
            <input
              id="meal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
              maxLength={100}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">
                Ingredients{" "}
                <span className="text-rose-500" aria-hidden>
                  *
                </span>
              </label>
              <span className="text-xs text-muted-foreground">
                {rows.length} row{rows.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-3">
              {rows.map((row, idx) => (
                <IngredientRowWidget
                  key={row.id}
                  row={row}
                  index={idx}
                  canRemove={rows.length > 1}
                  onIngredientChange={(key) => setRowIngredient(row.id, key)}
                  onQtyChange={(qty) => setRowQty(row.id, qty)}
                  onRemove={() => removeRow(row.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="size-4" />
              Add ingredient
            </button>
          </div>

          {/* Live macro preview */}
          {hasValidRows ? (
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated totals
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    {
                      label: "Protein",
                      value: `${liveTotal.proteinG}g`,
                      nc: NUTRIENT_COLORS.protein,
                    },
                    {
                      label: "Carbs",
                      value: `${liveTotal.carbsG}g`,
                      nc: NUTRIENT_COLORS.carbs,
                    },
                    {
                      label: "Fat",
                      value: `${liveTotal.fatG}g`,
                      nc: NUTRIENT_COLORS.fat,
                    },
                    {
                      label: "Cal",
                      value: `${liveTotal.caloriesKcal}`,
                      nc: NUTRIENT_COLORS.calories,
                    },
                  ] as const
                ).map(({ label, value, nc }) => (
                  <div
                    key={label}
                    className={`rounded-xl border px-2 py-3 text-center ${nc.bgClass} ${nc.borderClass}`}
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
            </div>
          ) : null}

          {/* Error banner */}
          {error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : null}

          {/* Spacer so last element isn't flush with footer */}
          <div className="h-2" />
        </div>

        {/* Sticky submit footer */}
        <div className="shrink-0 border-t border-border/40 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition ${
              success
                ? "bg-green-600 text-white"
                : canSubmit
                  ? "bg-primary text-white hover:opacity-90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {success ? (
              <>
                <Check className="size-4" /> Posted!
              </>
            ) : submitting ? (
              "Posting…"
            ) : (
              "Post Meal"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Ingredient row widget ────────────────────────────────────────────────────

type IngredientRowWidgetProps = {
  row: IngredientRow;
  index: number;
  canRemove: boolean;
  onIngredientChange: (key: string) => void;
  onQtyChange: (qty: string) => void;
  onRemove: () => void;
};

function IngredientRowWidget({
  row,
  index,
  canRemove,
  onIngredientChange,
  onQtyChange,
  onRemove,
}: IngredientRowWidgetProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-3.5">
      {/* Row header: index + ingredient select + remove */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {index + 1}
        </span>

        <select
          value={row.ingredientKey}
          onChange={(e) => onIngredientChange(e.target.value)}
          className="flex-1 rounded-lg border border-input bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select ingredient…</option>
          {PREDEFINED_INGREDIENTS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name}
            </option>
          ))}
        </select>

        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove ingredient"
          >
            <Trash2 className="size-3.5" />
          </button>
        ) : null}
      </div>

      {/* Quantity row */}
      <div className="mt-3 pl-[34px]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              type="number"
              min={1}
              step={1}
              value={row.quantity}
              onChange={(e) => onQtyChange(e.target.value)}
              className="w-20 rounded-lg border border-input bg-white py-2 pl-3 pr-8 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              g
            </span>
          </div>

          {/* Quick-select chips */}
          {QUICK_GRAMS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onQtyChange(String(g))}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                row.quantity === String(g)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Per-ingredient nutrition hint */}
        {row.ingredientKey && parseFloat(row.quantity) > 0 ? (
          <NutritionHint
            ingredientKey={row.ingredientKey}
            quantity={parseFloat(row.quantity)}
          />
        ) : null}
      </div>
    </div>
  );
}

// ── Nutrition hint ───────────────────────────────────────────────────────────

function NutritionHint({
  ingredientKey,
  quantity,
}: {
  ingredientKey: string;
  quantity: number;
}) {
  const preset = PREDEFINED_INGREDIENTS.find((p) => p.key === ingredientKey);
  if (!preset) return null;

  const f = quantity / 100;
  const p = round1(preset.proteinPer100g * f);
  const c = round1(preset.carbsPer100g * f);
  const fa = round1(preset.fatPer100g * f);
  const cal = Math.round(preset.caloriesPer100g * f);

  return (
    <p className="mt-2 flex flex-wrap gap-x-2.5 text-xs">
      <span className={`font-semibold ${NUTRIENT_COLORS.protein.textClass}`}>
        P {p}g
      </span>
      <span className={`font-semibold ${NUTRIENT_COLORS.carbs.textClass}`}>
        C {c}g
      </span>
      <span className={`font-semibold ${NUTRIENT_COLORS.fat.textClass}`}>
        F {fa}g
      </span>
      <span className={`font-semibold ${NUTRIENT_COLORS.calories.textClass}`}>
        {cal} kcal
      </span>
    </p>
  );
}
