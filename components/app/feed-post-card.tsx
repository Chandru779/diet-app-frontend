"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Utensils } from "lucide-react";
import type { ApiMeal } from "@/lib/types/meal";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";

export function FeedPostCard({ post }: { post: ApiMeal }) {
  return (
    <Link href={`/feed/${post.id}`} className="group block">
      <article className="flex gap-3 overflow-hidden rounded-2xl bg-card p-3.5 shadow-[0_1px_12px_rgba(0,0,0,0.06)] border border-border/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
        {/* Square thumbnail */}
        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-muted">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
              sizes="88px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Utensils className="size-6 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top row: author + arrow */}
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
              @{post.user.username}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
          </div>

          {/* Title */}
          <h3 className="mt-1 line-clamp-1 font-heading text-[15px] font-bold leading-snug text-foreground">
            {post.title}
          </h3>

          {/* Description */}
          {post.description ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
              {post.description}
            </p>
          ) : null}

          {/* Macro strip */}
          <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-0.5 pt-2">
            <span
              className={`text-[11px] font-bold tabular-nums ${NUTRIENT_COLORS.calories.textClass}`}
            >
              {post.caloriesKcal}
              <span className="ml-0.5 text-[9px] font-normal">kcal</span>
            </span>
            <span className="text-border">·</span>
            <span
              className={`text-[11px] font-semibold tabular-nums ${NUTRIENT_COLORS.protein.textClass}`}
            >
              P {post.proteinG}g
            </span>
            <span
              className={`text-[11px] font-semibold tabular-nums ${NUTRIENT_COLORS.carbs.textClass}`}
            >
              C {post.carbsG}g
            </span>
            <span
              className={`text-[11px] font-semibold tabular-nums ${NUTRIENT_COLORS.fat.textClass}`}
            >
              F {post.fatG}g
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
