"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Drumstick } from "lucide-react";
import { MARKETING_ASSETS, MARKETING_COPY } from "@/lib/constants/marketing-copy";

const cardImageClass =
  "relative float-right ml-1 size-[4.5rem] overflow-hidden rounded-full border-2 border-white bg-white shadow-md";

export function HomeCategoryCards() {
  return (
    <section className="grid min-w-0 grid-cols-2 gap-2">
      {/* Vegetarian */}
      <Link
        href="/feed?category=veg"
        className="group relative flex min-h-[200px] min-w-0 flex-col rounded-3xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-100/50 py-3 pl-3 pr-2 shadow-soft transition hover:shadow-card"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700">
          <Leaf className="size-4" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="mt-2 min-w-0 flow-root">
          <div className={`${cardImageClass} ring-1 ring-emerald-100/80`}>
            <Image
              src={MARKETING_ASSETS.vegMeal}
              alt="Vegetarian meal"
              fill
              className="object-cover object-center"
              sizes="72px"
              quality={95}
              priority
            />
          </div>
          <p className="text-balance text-[11px] leading-tight text-foreground">
            {MARKETING_COPY.vegCardTitle}{" "}
            <span className="font-bold text-primary">
              {MARKETING_COPY.vegCardHighlight}
            </span>{" "}
            {MARKETING_COPY.vegCardSuffix}
          </p>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
            {MARKETING_COPY.vegCardSub}
          </p>
        </div>
        <span className="mt-auto inline-flex w-full min-w-0 items-center justify-center gap-1 rounded-full border border-emerald-200 bg-white py-2 text-[10px] font-semibold leading-tight text-primary shadow-sm transition group-hover:bg-emerald-50">
          {MARKETING_COPY.vegExplore}
          <ArrowRight className="size-3 shrink-0" aria-hidden />
        </span>
      </Link>

      {/* Non-vegetarian */}
      <Link
        href="/feed?category=non-veg"
        className="group relative flex min-h-[200px] min-w-0 flex-col rounded-3xl border border-orange-100/80 bg-gradient-to-br from-orange-50/90 via-white to-amber-50/60 py-3 pl-3 pr-2 shadow-soft transition hover:shadow-card"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-700">
          <Drumstick className="size-4" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="mt-2 min-w-0 flow-root">
          <div className={`${cardImageClass} ring-1 ring-orange-100/80`}>
            <Image
              src={MARKETING_ASSETS.nonVegCategory}
              alt="Non-vegetarian meal"
              fill
              className="object-cover object-center"
              sizes="72px"
              quality={95}
            />
          </div>
          <p className="text-balance text-[11px] leading-tight text-foreground">
            {MARKETING_COPY.nonVegCardTitle}{" "}
            <span className="font-bold text-orange-600">
              {MARKETING_COPY.nonVegCardHighlight}
            </span>
          </p>
          <p className="mt-1 text-[10px] leading-snug text-muted-foreground">
            {MARKETING_COPY.nonVegCardSub}
          </p>
        </div>
        <span className="mt-auto inline-flex w-full min-w-0 items-center justify-center gap-1 rounded-full border border-orange-200 bg-white py-2 text-[10px] font-semibold leading-tight text-orange-600 shadow-sm transition group-hover:bg-orange-50">
          {MARKETING_COPY.nonVegExplore}
          <ArrowRight className="size-3 shrink-0" aria-hidden />
        </span>
      </Link>
    </section>
  );
}
