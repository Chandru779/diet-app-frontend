/**
 * Predefined common ingredients with nutrition values per 100 g.
 * The backend service scales these by (quantity / nutritionBaseQuantity)
 * so we always send nutritionBaseQuantity: 100 alongside these values.
 */
export type PredefinedIngredient = {
  key: string;
  name: string;
  /** kcal per 100 g */
  caloriesPer100g: number;
  /** g protein per 100 g */
  proteinPer100g: number;
  /** g carbohydrates per 100 g */
  carbsPer100g: number;
  /** g fat per 100 g */
  fatPer100g: number;
  /** g fiber per 100 g */
  fiberPer100g: number;
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
