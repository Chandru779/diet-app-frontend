"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MealCollectionSummary } from "@/lib/api/collections";

const BANNER_STYLES = [
  "from-emerald-700 to-emerald-900",
  "from-sky-700 to-sky-900",
  "from-amber-700 to-orange-900",
];

type FeedCollectionBannerProps = {
  collection: MealCollectionSummary;
  index?: number;
};

export function FeedCollectionBanner({
  collection,
  index = 0,
}: FeedCollectionBannerProps) {
  const gradient = BANNER_STYLES[index % BANNER_STYLES.length];

  return (
    <Link
      href={`/feed?cat=${collection.slug}`}
      className={cn(
        "relative flex h-[7.5rem] w-[11.5rem] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-white shadow-md transition active:scale-[0.98]",
        gradient,
      )}
    >
      {collection.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={collection.coverImage}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-30"
        />
      ) : null}
      <div className="relative z-10">
        <h3 className="font-heading text-sm font-bold leading-tight">
          {collection.title}
        </h3>
        <p className="mt-0.5 text-[10px] font-medium text-white/85">
          {collection.mealCount} meals
        </p>
        <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-white/90">
          Explore
          <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}
