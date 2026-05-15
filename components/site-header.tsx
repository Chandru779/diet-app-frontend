"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";

export function SiteHeader() {
  const router = useRouter();
  const isLoggedIn =
    useAuthStore((s) => s.isLoggedIn) && Boolean(getAuthAccessTokenFromCookie());
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-20 border-border/60 border-b bg-background/85 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 pt-safe">
        <Logo href="/" size="sm" />
        <nav className="flex flex-wrap items-center justify-end gap-1 font-nunito text-sm sm:gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/feed"
                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Feed
              </Link>
              <Link
                href="/profile"
                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                  router.refresh();
                }}
                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground shadow-sm transition hover:bg-primary/92 active:scale-[0.98]"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
