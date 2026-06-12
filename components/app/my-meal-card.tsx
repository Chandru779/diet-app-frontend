"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { deleteMeal } from "@/lib/api/meal";
import { invalidateMyMeals } from "@/lib/query/invalidate";
import { useFeedStore } from "@/lib/store/feed-store";
import type { ApiMeal } from "@/lib/types/meal";

type MyMealCardProps = {
  meal: ApiMeal;
  onDeleted: () => void;
};

export function MyMealCard({ meal, onDeleted }: MyMealCardProps) {
  const queryClient = useQueryClient();
  const openEditSheet = useFeedStore((s) => s.openEditSheet);
  const bumpRefresh = useFeedStore((s) => s.bumpRefresh);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  async function handleDelete() {
    if (deleting) return;
    const ok = window.confirm(
      `Delete "${meal.title}"? This cannot be undone.`,
    );
    if (!ok) return;

    setDeleting(true);
    setMenuOpen(false);
    try {
      await deleteMeal(meal.id);
      await invalidateMyMeals(queryClient);
      bumpRefresh();
      onDeleted();
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Could not delete meal.",
      );
      setDeleting(false);
    }
  }

  function handleEdit() {
    setMenuOpen(false);
    openEditSheet(meal);
  }

  return (
    <div className="relative">
      <FeedPostCard post={meal} />

      <div ref={menuRef} className="absolute right-2 top-2 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((open) => !open);
          }}
          disabled={deleting}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Meal actions"
          className="flex size-8 items-center justify-center rounded-full bg-white/95 text-muted-foreground shadow-sm ring-1 ring-black/5 transition hover:text-foreground disabled:opacity-50"
        >
          <MoreVertical className="size-4" />
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1 min-w-[9.5rem] overflow-hidden rounded-xl border border-border/80 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdit();
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-muted/60"
            >
              <Pencil className="size-4 text-primary" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void handleDelete();
              }}
              disabled={deleting}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
