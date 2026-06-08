import { create } from "zustand";

type FavoritesState = {
  /** Optimistic favorite state keyed by meal id */
  overrides: Record<string, boolean>;
  setFavorited: (mealId: string, favorited: boolean) => void;
  clearOverride: (mealId: string) => void;
};

export const useFavoritesStore = create<FavoritesState>((set) => ({
  overrides: {},
  setFavorited: (mealId, favorited) =>
    set((s) => ({
      overrides: { ...s.overrides, [mealId]: favorited },
    })),
  clearOverride: (mealId) =>
    set((s) => {
      const { [mealId]: _, ...rest } = s.overrides;
      return { overrides: rest };
    }),
}));

export function resolveFavorited(
  mealId: string,
  serverFavorited: boolean | undefined,
  overrides: Record<string, boolean>,
): boolean {
  if (mealId in overrides) {
    return overrides[mealId];
  }
  return serverFavorited ?? false;
}
