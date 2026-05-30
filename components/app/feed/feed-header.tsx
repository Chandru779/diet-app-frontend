"use client";

import Link from "next/link";
import { Moon, UserRound } from "lucide-react";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useAuthStore } from "@/lib/store/auth-store";

type FeedHeaderProps = {
  greeting: string;
};

export function FeedHeader({ greeting }: FeedHeaderProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.user?.username);
  const { initial, firstName } = deriveDisplayName(username);

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[13px] text-muted-foreground">
        <span>{greeting}</span>
        <Moon
          className="size-3.5 fill-amber-200/90 stroke-amber-500"
          strokeWidth={1.75}
          aria-hidden
        />
      </p>
      <div className="mt-0.5 flex items-center gap-2">
        <h1 className="min-w-0 flex-1 font-heading text-[1.75rem] font-bold leading-[1.12] tracking-tight text-foreground">
          {isLoggedIn ? `Hey, ${firstName}` : "Track macros effortlessly"}
        </h1>
        {isLoggedIn ? (
          <Link
            href="/profile"
            aria-label={`Open ${firstName}'s profile`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-95"
          >
            {initial}
          </Link>
        ) : (
          <Link
            href="/login"
            aria-label="Sign in"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition hover:bg-muted/40 active:scale-95"
          >
            <UserRound className="size-[18px]" strokeWidth={2.25} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
