import { create } from "zustand";
import { fetchCollections, type MealCollectionSummary } from "@/lib/api/collections";
import { fetchFeedHome } from "@/lib/api/feed";
import type { FeedSection } from "@/lib/types/feed";
import type { ApiMeal } from "@/lib/types/meal";

type FeedState = {
  /** Increment to trigger a re-fetch in MealList */
  refreshKey: number;
  bumpRefresh: () => void;
  /** Controls Create Meal bottom sheet visibility */
  isCreateSheetOpen: boolean;
  /** When set, the sheet opens in edit mode for this meal */
  editingMeal: ApiMeal | null;
  openCreateSheet: () => void;
  openEditSheet: (meal: ApiMeal) => void;
  closeCreateSheet: () => void;
  homeSections: FeedSection[];
  homeLoading: boolean;
  homeError: string | null;
  homeLoadedKey: number | null;
  ensureHomeLoaded: () => void;
  collections: MealCollectionSummary[];
  collectionsLoadedKey: number | null;
  ensureCollectionsLoaded: () => void;
};

let homeRequest: Promise<void> | null = null;
let homeRequestKey: number | null = null;
let collectionsRequest: Promise<void> | null = null;
let collectionsRequestKey: number | null = null;

export const useFeedStore = create<FeedState>((set, get) => ({
  refreshKey: 0,
  bumpRefresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
  isCreateSheetOpen: false,
  editingMeal: null,
  openCreateSheet: () => set({ isCreateSheetOpen: true, editingMeal: null }),
  openEditSheet: (meal) => set({ isCreateSheetOpen: true, editingMeal: meal }),
  closeCreateSheet: () => set({ isCreateSheetOpen: false, editingMeal: null }),
  homeSections: [],
  homeLoading: false,
  homeError: null,
  homeLoadedKey: null,
  collections: [],
  collectionsLoadedKey: null,
  ensureCollectionsLoaded: () => {
    const { refreshKey, collectionsLoadedKey } = get();

    if (collectionsLoadedKey === refreshKey) return;
    if (collectionsRequest && collectionsRequestKey === refreshKey) return;

    collectionsRequestKey = refreshKey;

    collectionsRequest = fetchCollections()
      .then((data) => {
        if (get().refreshKey !== refreshKey) return;
        set({
          collections: data.slice(0, 6),
          collectionsLoadedKey: refreshKey,
        });
      })
      .catch(() => {
        if (get().refreshKey !== refreshKey) return;
        set({ collections: [], collectionsLoadedKey: refreshKey });
      })
      .finally(() => {
        if (collectionsRequestKey === refreshKey) {
          collectionsRequest = null;
          collectionsRequestKey = null;
        }
      });
  },
  ensureHomeLoaded: () => {
    const { refreshKey, homeLoadedKey, homeLoading } = get();

    if (homeLoadedKey === refreshKey && !homeLoading) return;
    if (homeRequest && homeRequestKey === refreshKey) return;

    set({ homeLoading: true, homeError: null });
    homeRequestKey = refreshKey;

    homeRequest = fetchFeedHome()
      .then((data) => {
        if (get().refreshKey !== refreshKey) return;
        set({
          homeSections: data.sections,
          homeLoading: false,
          homeLoadedKey: refreshKey,
        });
      })
      .catch(() => {
        if (get().refreshKey !== refreshKey) return;
        set({
          homeError: "Could not load feed. Make sure the backend is running.",
          homeLoading: false,
          homeLoadedKey: refreshKey,
        });
      })
      .finally(() => {
        if (homeRequestKey === refreshKey) {
          homeRequest = null;
          homeRequestKey = null;
        }
      });
  },
}));
