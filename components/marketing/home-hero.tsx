"use client";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import {
  MARKETING_ASSETS,
  MARKETING_COPY,
} from "@/lib/constants/marketing-copy";

export function HomeHero() {
  return (
    <section className="space-y-5 pt-1">
      <div className="flex items-center justify-between">
        <Logo size="md" href={undefined} />
        <Link
          href="/login"
          className="text-sm font-semibold text-primary transition hover:opacity-80"
        >
          {MARKETING_COPY.signIn}
        </Link>
      </div>

      <div className="relative flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-2.5 pr-2">
          <h1 className="font-heading text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
            {MARKETING_COPY.headlineLine1}
            <br />
            <span className="text-primary">{MARKETING_COPY.headlineLine2}</span>
          </h1>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {MARKETING_COPY.heroSubtext}
          </p>
        </div>

        <div className="relative shrink-0">
          <div
            className="pointer-events-none absolute right-0 top-4 size-16 rounded-full bg-primary/10 blur-xl"
            aria-hidden
          />
          <div className="relative size-[108px] overflow-hidden rounded-full border-4 border-white shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
            <Image
              src={MARKETING_ASSETS.heroBowl}
              alt="Healthy grain bowl"
              fill
              className="object-cover"
              sizes="108px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
