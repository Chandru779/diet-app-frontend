import { create } from "zustand";

type FeedState = {
  /** Increment to trigger a re-fetch in MealList */
  refreshKey: number;
  bumpRefresh: () => void;
  /** Controls Create Meal bottom sheet visibility */
  isCreateSheetOpen: boolean;
  openCreateSheet: () => void;
  closeCreateSheet: () => void;
};

export const useFeedStore = create<FeedState>((set) => ({
  refreshKey: 0,
  bumpRefresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
  isCreateSheetOpen: false,
  openCreateSheet: () => set({ isCreateSheetOpen: true }),
  closeCreateSheet: () => set({ isCreateSheetOpen: false }),
}));
