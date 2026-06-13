/** Client React Query stale window and Next.js ISR revalidate interval (5 minutes). */
export const HOME_MEALS_STALE_MS = 5 * 60 * 1000;
export const HOME_PAGE_REVALIDATE_SEC = 300;

/** Infrequently changing reference data (e.g. meal category taxonomy). */
export const MEAL_CATEGORIES_STALE_MS = 5 * 60 * 1000;

/** Meal builder ingredient catalog (bootstrap list + per-search results). */
export const MEAL_CATALOG_STALE_MS = 5 * 60 * 1000;

/** Feed discover results + counts (per search/filter combination). */
export const DISCOVER_STALE_MS = 2 * 60 * 1000;

/** User library tabs (My Meals, Saved, Packs) — cached until invalidated by mutations. */
export const USER_LIBRARY_STALE_MS = 5 * 60 * 1000;
