"use client";

import Link from "next/link";
import { Bookmark, ChefHat, ChevronRight } from "lucide-react";
import { MARKETING_COPY } from "@/lib/constants/marketing-copy";

const tiles = [
  {
    href: "/my-meals",
    label: MARKETING_COPY.myCreations,
    description: MARKETING_COPY.myCreationsDesc,
    icon: ChefHat,
    iconWrap: "bg-primary/10 text-primary",
    accent: "meal-card bg-card hover:border-gray-200 hover:bg-primary/[0.03]",
  },
  {
    href: "/saved",
    label: MARKETING_COPY.savedMeals,
    description: MARKETING_COPY.savedMealsDesc,
    icon: Bookmark,
    iconWrap: "bg-amber-500/10 text-amber-700",
    accent: "meal-card bg-card hover:border-gray-200 hover:bg-amber-50/30",
  },
] as const;

export function HomeQuickTiles() {
  return (
    <section className="grid grid-cols-2 gap-3">
      {tiles.map(({ href, label, description, icon: Icon, iconWrap, accent }) => (
        <Link
          key={href}
          href={href}
          className={`group flex min-h-[108px] flex-col justify-between rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-card active:scale-[0.99] ${accent}`}
        >
          <div className="flex items-start justify-between">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${iconWrap}`}
            >
              <Icon className="size-5" strokeWidth={2.25} aria-hidden />
            </span>
            <ChevronRight
              className="size-4 text-muted-foreground/35 transition group-hover:text-primary"
              aria-hidden
            />
          </div>
          <div className="space-y-0.5">
            <p className="font-heading text-[13px] font-bold leading-tight text-foreground">
              {label}
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {description}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
