/**
 * Predefined ingredients. Gram mode uses USDA-style values per 100 g.
 * Count mode (when `countOption` is set) uses nutrients for one typical item;
 * the backend scales with quantity / nutritionBaseQuantity (base 1 for count).
 */
export type PerItemNutrition = {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export type PredefinedIngredient = {
  key: string;
  name: string;
  /** kcal per 100 g (gram mode) */
  caloriesPer100g: number;
  /** g protein per 100 g */
  proteinPer100g: number;
  /** g carbohydrates per 100 g */
  carbsPer100g: number;
  /** g fat per 100 g */
  fatPer100g: number;
  /** g fiber per 100 g */
  fiberPer100g: number;
  /** If set, the user may enter quantity as whole items (1 egg, 2 bananas, …). */
  countOption?: {
    /** One large egg (~50 g), rounded */
    perUnit: PerItemNutrition;
    singular: string;
    plural: string;
  };
  /** Used when `countOption` exists — default unit when this ingredient is selected */
  preferredQuantityUnit?: "grams" | "count";
};

export const PREDEFINED_INGREDIENTS: readonly PredefinedIngredient[] = [
  // ── Proteins ──────────────────────────────────────────────────────────────
  {
    key: "chicken_breast",
    name: "Chicken breast",
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    fiberPer100g: 0,
  },
  {
    key: "eggs_whole",
    name: "Eggs (whole)",
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
    fiberPer100g: 0,
    preferredQuantityUnit: "count",
    countOption: {
      singular: "egg",
      plural: "eggs",
      perUnit: {
        caloriesKcal: 72,
        proteinG: 6.3,
        carbsG: 0.4,
        fatG: 5,
        fiberG: 0,
      },
    },
  },
  {
    key: "salmon_fillet",
    name: "Salmon fillet",
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    fiberPer100g: 0,
  },
  {
    key: "firm_tofu",
    name: "Firm tofu",
    caloriesPer100g: 144,
    proteinPer100g: 15.8,
    carbsPer100g: 2.8,
    fatPer100g: 8.7,
    fiberPer100g: 1.2,
  },
  {
    key: "greek_yogurt",
    name: "Greek yogurt",
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 0,
  },
  {
    key: "cottage_cheese",
    name: "Cottage cheese",
    caloriesPer100g: 98,
    proteinPer100g: 11,
    carbsPer100g: 3.4,
    fatPer100g: 4.3,
    fiberPer100g: 0,
  },
  {
    key: "whey_protein",
    name: "Whey protein powder",
    caloriesPer100g: 375,
    proteinPer100g: 80,
    carbsPer100g: 8,
    fatPer100g: 3,
    fiberPer100g: 0,
  },
  // ── Carbs & Grains ────────────────────────────────────────────────────────
  {
    key: "quinoa_cooked",
    name: "Quinoa (cooked)",
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 22,
    fatPer100g: 1.9,
    fiberPer100g: 2.8,
  },
  {
    key: "brown_rice_cooked",
    name: "Brown rice (cooked)",
    caloriesPer100g: 112,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 1.8,
    fiberPer100g: 1.8,
  },
  {
    key: "oats_dry",
    name: "Rolled oats",
    caloriesPer100g: 389,
    proteinPer100g: 17,
    carbsPer100g: 66,
    fatPer100g: 7,
    fiberPer100g: 10.6,
  },
  {
    key: "sweet_potato",
    name: "Sweet potato",
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20,
    fatPer100g: 0.1,
    fiberPer100g: 3,
  },
  {
    key: "banana",
    name: "Banana",
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    preferredQuantityUnit: "count",
    countOption: {
      singular: "banana",
      plural: "bananas",
      perUnit: {
        caloriesKcal: 105,
        proteinG: 1.3,
        carbsG: 27,
        fatG: 0.4,
        fiberG: 3.1,
      },
    },
  },
  {
    key: "lentils_cooked",
    name: "Lentils (cooked)",
    caloriesPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20,
    fatPer100g: 0.4,
    fiberPer100g: 7.9,
  },
  // ── Vegetables ────────────────────────────────────────────────────────────
  {
    key: "broccoli",
    name: "Broccoli",
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    fiberPer100g: 2.6,
  },
  {
    key: "spinach",
    name: "Spinach",
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    fiberPer100g: 2.2,
  },
  // ── Fats & Nuts ───────────────────────────────────────────────────────────
  {
    key: "avocado",
    name: "Avocado",
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 9,
    fatPer100g: 15,
    fiberPer100g: 7,
  },
  {
    key: "almonds",
    name: "Almonds",
    caloriesPer100g: 579,
    proteinPer100g: 21,
    carbsPer100g: 22,
    fatPer100g: 50,
    fiberPer100g: 12.5,
  },
  {
    key: "peanut_butter",
    name: "Peanut butter",
    caloriesPer100g: 588,
    proteinPer100g: 25,
    carbsPer100g: 20,
    fatPer100g: 50,
    fiberPer100g: 6,
  },
  {
    key: "olive_oil",
    name: "Olive oil",
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    fiberPer100g: 0,
  },
] as const;

export function getPresetByKey(key: string): PredefinedIngredient | undefined {
  return PREDEFINED_INGREDIENTS.find((p) => p.key === key);
}

export function defaultQuantityFieldsForPreset(
  key: string,
): { quantity: string; quantityUnit: "grams" | "count" } {
  const preset = getPresetByKey(key);
  if (!preset?.countOption) {
    return { quantity: "100", quantityUnit: "grams" };
  }
  const unit = preset.preferredQuantityUnit ?? "count";
  if (unit === "count") {
    return { quantity: "1", quantityUnit: "count" };
  }
  return { quantity: "100", quantityUnit: "grams" };
}
