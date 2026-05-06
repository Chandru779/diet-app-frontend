export type PerItemNutrition = {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export type MealCatalogCountOption = {
  singular: string;
  plural: string;
  perUnit: PerItemNutrition;
};

/** Response item from GET /meals/catalog (name = display name). */
export type MealCatalogItem = {
  id: string;
  key: string;
  name: string;
  isVegetarian: boolean;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  countOption?: MealCatalogCountOption;
  preferredQuantityUnit?: "grams" | "count" | "ml";
  densityGPerMl?: number;
};

export function getCatalogItemByKey(
  items: readonly MealCatalogItem[],
  key: string,
): MealCatalogItem | undefined {
  return items.find((p) => p.key === key);
}

export function defaultQuantityFieldsForCatalogItem(
  item: MealCatalogItem | undefined,
): { quantity: string; quantityUnit: "grams" | "count" | "ml" } {
  const unit = item?.preferredQuantityUnit;
  if (unit === "ml" && item?.densityGPerMl != null) {
    return { quantity: "100", quantityUnit: "ml" };
  }
  if (unit === "count" && item?.countOption) {
    return { quantity: "1", quantityUnit: "count" };
  }
  if (item?.countOption) {
    // default behavior for count-capable items
    return { quantity: "1", quantityUnit: "count" };
  }
  return { quantity: "100", quantityUnit: "grams" };
}
