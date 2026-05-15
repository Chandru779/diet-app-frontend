"use client";

import Link from "next/link";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useAuthStore } from "@/lib/store/auth-store";

type FeedAppBarProps = {
  greeting: string;
  headline: string;
};

export function FeedAppBar({ greeting, headline }: FeedAppBarProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.user?.username);
  const { initial, firstName } = deriveDisplayName(username);

  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{greeting}</p>
        <h1 className="font-heading text-2xl font-bold leading-tight">
          {headline}
        </h1>
      </div>

      {isLoggedIn ? (
        <Link
          href="/profile"
          aria-label={`Open ${firstName}'s profile`}
          className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground shadow-sm ring-2 ring-white/85 transition hover:bg-primary/90 active:scale-95"
        >
          <span className="leading-none">{initial}</span>
          <span
            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
            aria-hidden
          />
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.98]"
        >
          Sign in
        </Link>
      )}
    </div>
  );
}
