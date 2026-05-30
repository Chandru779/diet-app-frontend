"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";

type RequireAuthProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

/**
 * Gate that renders a friendly "sign in to continue" card instead of
 * children when the user is not authenticated. Use on pages like
 * /profile, /my-meals, /saved.
 */
export function RequireAuth({
  children,
  title = "Sign in to continue",
  description = "Create an account or sign in to access this page.",
}: RequireAuthProps) {
  const [hydrated, setHydrated] = useState(false);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (api.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = api.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div
        className="meal-card flex min-h-[40vh] flex-col items-center justify-center rounded-2xl bg-white"
        aria-busy
      >
        <div className="h-2 w-24 animate-pulse rounded-full bg-primary/20" />
      </div>
    );
  }

  const hasToken = Boolean(getAuthAccessTokenFromCookie());
  if (isLoggedIn && hasToken) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-2 py-10">
      <div className="w-full max-w-sm rounded-3xl border border-border/70 bg-card p-7 text-center shadow-card">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LogIn className="size-5" strokeWidth={2.25} />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99]"
          >
            <LogIn className="size-4" strokeWidth={2.25} />
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-muted/40"
          >
            <UserPlus className="size-4" strokeWidth={2.25} />
            Create account
          </Link>
        </div>

        <Link
          href="/feed"
          className="mt-5 inline-block text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Keep exploring meals
        </Link>
      </div>
    </div>
  );
}
