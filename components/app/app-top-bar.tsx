"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useAuthStore } from "@/lib/store/auth-store";

export function AppTopBar() {
  const pathname = usePathname();
  const username = useAuthStore((s) => s.user?.username);
  const { initial } = deriveDisplayName(username);

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-white">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Logo href="/feed" size="sm" />

        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              pathname.startsWith("/feed")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Feed
          </Link>

          <Link
            href="/profile"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition ${
              pathname.startsWith("/profile")
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
            aria-label="Open profile"
          >
            {initial}
          </Link>
        </div>
      </div>
    </header>
  );
}
