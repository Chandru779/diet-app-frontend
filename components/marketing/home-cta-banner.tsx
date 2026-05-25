"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBasket, Users } from "lucide-react";
import { MARKETING_ASSETS, MARKETING_COPY } from "@/lib/constants/marketing-copy";

const STATS = [
  {
    icon: ShoppingBasket,
    value: MARKETING_COPY.statMeals,
    label: MARKETING_COPY.statMealsLabel,
  },
  {
    icon: Users,
    value: MARKETING_COPY.statUsers,
    label: MARKETING_COPY.statUsersLabel,
  },
  {
    icon: Heart,
    value: MARKETING_COPY.statFree,
    label: MARKETING_COPY.statFreeLabel,
  },
] as const;

export function HomeCtaBanner() {
  return (
    <section className="overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-emerald-50/95 via-emerald-50/50 to-white shadow-soft">
      {/* Top: illustration + copy + button side by side */}
      <div className="flex items-end gap-3 p-4 pb-3">
        <div className="relative h-[132px] w-[108px] shrink-0">
          <Image
            src={MARKETING_ASSETS.ctaCharacter}
            alt="Person enjoying a healthy meal"
            fill
            className="object-contain object-bottom"
            sizes="108px"
            quality={95}
            priority
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-end gap-3 pb-1">
          <p className="text-[12px] leading-snug text-muted-foreground">
            {MARKETING_COPY.ctaText}
          </p>
          <Link
            href="/login"
            className="inline-flex w-fit items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
          >
            {MARKETING_COPY.ctaButton}
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Bottom: stats row */}
      <div className="grid grid-cols-3 gap-2 border-t border-primary/10 bg-white/50 px-4 py-3">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <Icon className="size-4 text-primary" strokeWidth={2} aria-hidden />
            <p className="text-[12px] font-bold leading-none text-foreground">
              {value}
            </p>
            <p className="text-[9px] leading-tight text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
