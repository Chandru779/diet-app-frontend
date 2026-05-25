/** Local covers used when storage object is missing or still loading. */
export const MEAL_COVER_PLACEHOLDERS = [
  "/assets/home/meal-1.png",
  "/assets/home/meal-2.png",
  "/assets/home/meal-3.png",
] as const;

export function getMealPlaceholderImage(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % MEAL_COVER_PLACEHOLDERS.length;
  return MEAL_COVER_PLACEHOLDERS[index];
}
