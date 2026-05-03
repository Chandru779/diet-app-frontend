/**
 * Nutrient color constants — single source of truth.
 *
 * Hex values are the exact Tailwind palette hex codes for the chosen shade,
 * used for design handoff, inline styles, or anything outside Tailwind classes.
 * Full Tailwind class strings are provided so the JIT compiler can detect them
 * (this file is included in tailwind.config.ts content paths).
 */
export const NUTRIENT_COLORS = {
  protein: {
    /** #d97706 — Tailwind amber-600 */
    hex: "#d97706",
    textClass: "text-amber-600",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-100",
  },
  carbs: {
    /** #2563eb — Tailwind blue-600 */
    hex: "#2563eb",
    textClass: "text-blue-600",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
  },
  fat: {
    /** #ca8a04 — Tailwind yellow-600 */
    hex: "#ca8a04",
    textClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
    borderClass: "border-yellow-100",
  },
  calories: {
    /** #e11d48 — Tailwind rose-600 */
    hex: "#e11d48",
    textClass: "text-rose-600",
    bgClass: "bg-rose-50",
    borderClass: "border-rose-100",
  },
  fiber: {
    /** #15803d — Tailwind green-700 */
    hex: "#15803d",
    textClass: "text-green-700",
    bgClass: "bg-green-50",
    borderClass: "border-green-100",
  },
} as const;

export type NutrientKey = keyof typeof NUTRIENT_COLORS;
