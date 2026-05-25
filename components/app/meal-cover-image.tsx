"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { getMealPlaceholderImage } from "@/lib/media/meal-placeholder";
import { shouldUnoptimizeMealImage } from "@/lib/media/meal-image";

type MealCoverImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  /** Stable id (meal id) to pick a consistent placeholder on load failure. */
  mealId: string;
};

export function MealCoverImage({
  src,
  alt,
  mealId,
  ...props
}: MealCoverImageProps) {
  const placeholder = getMealPlaceholderImage(mealId);
  const trimmed = src?.trim();
  const [displaySrc, setDisplaySrc] = useState(trimmed || placeholder);

  useEffect(() => {
    if (!trimmed) {
      setDisplaySrc(placeholder);
      return;
    }

    if (!trimmed.includes("supabase.co/storage/")) {
      setDisplaySrc(trimmed);
      return;
    }

    let cancelled = false;
    fetch(trimmed, { method: "HEAD" })
      .then((res) => {
        if (!cancelled) setDisplaySrc(res.ok ? trimmed : placeholder);
      })
      .catch(() => {
        if (!cancelled) setDisplaySrc(placeholder);
      });

    return () => {
      cancelled = true;
    };
  }, [trimmed, placeholder]);

  return (
    <Image
      {...props}
      src={displaySrc}
      alt={alt}
      unoptimized={shouldUnoptimizeMealImage(displaySrc)}
      onError={() => {
        if (displaySrc !== placeholder) {
          setDisplaySrc(placeholder);
        }
      }}
    />
  );
}
