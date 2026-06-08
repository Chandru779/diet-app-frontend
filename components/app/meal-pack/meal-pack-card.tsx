"use client";

import Link from "next/link";
import { Eye, Package } from "lucide-react";
import { MealCoverImage } from "@/components/app/meal-cover-image";
import { ShareMealPackButton } from "@/components/app/meal-pack/share-meal-pack-button";
import type { MealPackSummary } from "@/lib/api/meal-packs";

type MealPackCardProps = {
  pack: MealPackSummary;
};

export function MealPackCard({ pack }: MealPackCardProps) {
  return (
    <div className="meal-card group relative overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link
        href={`/meal-packs/${pack.id}`}
        className="flex gap-3 p-3.5 pr-12"
      >
        <div className="relative size-[76px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-emerald-50">
          {pack.coverImage ? (
            <MealCoverImage
              src={pack.coverImage}
              mealId={pack.id}
              alt=""
              fill
              className="object-cover transition group-hover:scale-[1.03]"
              sizes="76px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-primary/50">
              <Package className="size-7" strokeWidth={2} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-heading text-[15px] font-bold leading-snug text-foreground">
            {pack.title}
          </h3>
          {pack.description ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {pack.description}
            </p>
          ) : null}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
              {pack.mealCount} meal{pack.mealCount === 1 ? "" : "s"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Eye className="size-3" strokeWidth={2.25} />
              {pack.viewCount} view{pack.viewCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3">
        <ShareMealPackButton
          packId={pack.id}
          title={pack.title}
          variant="icon"
        />
      </div>
    </div>
  );
}
