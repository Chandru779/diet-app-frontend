"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { RequireAuth } from "@/components/app/require-auth";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useAuthStore } from "@/lib/store/auth-store";

function ProfileContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const username = user?.username;
  const email = user?.email;

  const { firstName, initial } = deriveDisplayName(username);

  return (
    <div className="pb-10">
      {/* ── Gradient hero header (like the 3rd screen in the image) ── */}
      <div className="bg-avatar-gradient -mx-4 -mt-5 mb-0 rounded-b-[2.5rem] px-6 pb-8 pt-8">
        <div className="flex flex-col items-center gap-3 text-center">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            {initial}
          </div>

          {/* Name + handle */}
          <div>
            <h1 className="font-heading text-2xl font-bold">{firstName}</h1>
            {username ? (
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                @{username}
              </p>
            ) : null}
            {email ? (
              <p className="mt-0.5 text-xs text-muted-foreground/70">{email}</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* ── Content below hero ── */}
      <div className="mt-5 space-y-2.5">
        <Link
          href="/feed"
          className="flex items-center justify-between rounded-2xl border border-border/30 bg-card px-4 py-4 shadow-sm transition hover:bg-muted/30"
        >
          <div>
            <p className="text-sm font-semibold">Meal Feed</p>
            <p className="text-xs text-muted-foreground">
              Browse all meal posts
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            →
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/login");
            router.refresh();
          }}
          className="flex w-full items-center justify-between rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-left transition hover:bg-destructive/10"
        >
          <div>
            <p className="text-sm font-semibold text-destructive">Sign out</p>
            <p className="text-xs text-destructive/60">
              You will be redirected to login
            </p>
          </div>
          <LogOut className="size-5 text-destructive/70" />
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth
      title="Sign in to view your profile"
      description="Your profile, sign-out, and account settings live behind a quick sign-in."
    >
      <ProfileContent />
    </RequireAuth>
  );
}
