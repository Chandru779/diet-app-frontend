"use client";

import Link from "next/link";
import { Bell, Moon } from "lucide-react";
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
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1 text-[13px] text-muted-foreground">
          <span>{greeting}</span>
          <Moon className="size-3.5 opacity-80" aria-hidden />
        </p>
        <h1 className="mt-1 font-heading text-[1.75rem] font-bold leading-[1.12] tracking-tight text-foreground">
          Track macros effortlessly
        </h1>
        <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
          Discover high-protein meals tailored to your goals.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-full border border-border/40 bg-white shadow-sm transition hover:bg-muted/30 active:scale-95"
        >
          <Bell className="size-[18px] text-foreground/80" strokeWidth={2} />
          <span
            className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-white"
            aria-hidden
          />
        </button>

        {isLoggedIn ? (
          <Link
            href="/profile"
            aria-label={`Open ${firstName}'s profile`}
            className="relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm ring-2 ring-white transition hover:bg-primary/90 active:scale-95"
          >
            {initial}
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex h-10 shrink-0 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
