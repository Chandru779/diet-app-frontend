"use client";

import { Bookmark } from "lucide-react";
import { RequireAuth } from "@/components/app/require-auth";
import { useFeedStore } from "@/lib/store/feed-store";

function SavedContent() {
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);

  return (
    <div className="pb-4">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-foreground">
          Saved
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Meals you bookmark will appear here.
        </p>
      </div>

      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center"
        role="status"
      >
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/8">
          <Bookmark className="size-9 text-primary/50" strokeWidth={1.5} />
        </div>
        <p className="font-heading text-lg font-semibold text-foreground">
          Nothing saved yet
        </p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Tap the bookmark on any meal to save it for later. Coming soon.
        </p>
        <button
          type="button"
          onClick={openCreateSheet}
          className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
        >
          Log a meal instead
        </button>
      </div>
    </div>
  );
}

export default function SavedPage() {
  return (
    <RequireAuth
      title="Sign in to see saved meals"
      description="Bookmark meals you love — they’ll appear here once you sign in."
    >
      <SavedContent />
    </RequireAuth>
  );
}
