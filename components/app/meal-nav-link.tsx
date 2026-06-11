"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { cn } from "@/lib/utils";

type MealNavLinkProps = ComponentProps<typeof Link>;

function MealLinkContent({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? (
        <>
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] bg-white/75 backdrop-blur-[2px]"
            aria-hidden
          >
            <MealLoadingIllustration
              className="h-9 w-9 animate-pulse text-primary/60"
              label=""
            />
          </div>
          <span className="sr-only">Opening meal…</span>
        </>
      ) : null}
      <span
        className={cn("contents", pending && "pointer-events-none opacity-90")}
      >
        {children}
      </span>
    </>
  );
}

export function MealNavLink({
  className,
  children,
  ...props
}: MealNavLinkProps) {
  return (
    <Link prefetch className={cn("relative", className)} {...props}>
      <MealLinkContent>{children}</MealLinkContent>
    </Link>
  );
}
