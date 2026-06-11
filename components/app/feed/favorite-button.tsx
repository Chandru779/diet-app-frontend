"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { addFavorite, removeFavorite } from "@/lib/api/favorites";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import {
  resolveFavorited,
  useFavoritesStore,
} from "@/lib/store/favorites-store";
import { useRouter } from "next/navigation";

type FavoriteButtonProps = {
  mealId: string;
  initialFavorited?: boolean;
  className?: string;
};

export function FavoriteButton({
  mealId,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const overrides = useFavoritesStore((s) => s.overrides);
  const setFavoritedInStore = useFavoritesStore((s) => s.setFavorited);
  const clearOverride = useFavoritesStore((s) => s.clearOverride);
  const favorited = resolveFavorited(mealId, initialFavorited, overrides);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!getAuthAccessTokenFromCookie()) {
      router.push("/login");
      return;
    }

    if (loading) return;
    setLoading(true);
    const next = !favorited;
    setFavoritedInStore(mealId, next);

    try {
      if (next) {
        await addFavorite(mealId);
      } else {
        await removeFavorite(mealId);
      }
    } catch {
      if (next) {
        clearOverride(mealId);
      } else {
        setFavoritedInStore(mealId, true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      disabled={loading}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition active:scale-95",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-[18px] transition-colors",
          favorited ? "fill-rose-500 text-rose-500" : "text-foreground/70",
        )}
        strokeWidth={2}
      />
    </button>
  );
}
