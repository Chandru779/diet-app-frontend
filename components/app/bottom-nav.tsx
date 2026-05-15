"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, ClipboardList, Home, Plus, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";
import { useFeedStore } from "@/lib/store/feed-store";

// ── NavTab ────────────────────────────────────────────────────────────────────

function NavTab({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex min-w-0 max-w-full flex-col items-center justify-end gap-0.5"
      aria-current={active ? "page" : undefined}
      aria-label={label}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${active
          ? "bg-primary text-primary-foreground shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
          : "text-muted-foreground/70 hover:bg-muted hover:text-foreground"
          }`}
      >
        <Icon className="size-6" strokeWidth={active ? 2.25 : 2} />
      </span>
      <span
        className={`max-w-full truncate text-center text-[10px] font-medium leading-tight tracking-tight transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground/55"
          }`}
      >
        {label}
      </span>
    </Link>
  );
}

// ── BottomNav ─────────────────────────────────────────────────────────────────

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  function handleLogMeal() {
    const authed = isLoggedIn && Boolean(getAuthAccessTokenFromCookie());
    if (!authed) {
      router.push("/login");
      return;
    }
    openCreateSheet();
  }

  const homeActive = pathname === "/feed" || pathname.startsWith("/feed/");
  const myMealsActive =
    pathname === "/my-meals" || pathname.startsWith("/my-meals/");
  const savedActive =
    pathname === "/saved" || pathname.startsWith("/saved/");
  const profileActive = pathname.startsWith("/profile");

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto relative mx-auto max-w-2xl">
        <div className="rounded-t-3xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="grid min-h-[72px] grid-cols-5 items-stretch gap-x-1 px-1 py-3 sm:gap-x-2 sm:px-3">
            <div className="flex h-full min-w-0 flex-col items-center justify-end">
              <NavTab
                href="/feed"
                label="Home"
                icon={Home}
                active={homeActive}
              />
            </div>
            <div className="flex h-full min-w-0 flex-col items-center justify-end">
              <NavTab
                href="/my-meals"
                label="My meals"
                icon={ClipboardList}
                active={myMealsActive}
              />
            </div>
            <div className="flex h-full min-w-0 flex-col items-center justify-end gap-0.5">
              <button
                type="button"
                onClick={handleLogMeal}
                aria-label="Log a meal"
                className="nav-fab flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary transition active:scale-95"
              >
                <Plus className="size-6" strokeWidth={2.5} />
              </button>
              {/* Same line box as NavTab labels so icons share one baseline row */}
              <span
                className="invisible max-w-full truncate text-center text-[10px] font-medium leading-tight tracking-tight"
                aria-hidden
              >
                Log
              </span>
            </div>
            <div className="flex h-full min-w-0 flex-col items-center justify-end">
              <NavTab
                href="/saved"
                label="Saved"
                icon={Bookmark}
                active={savedActive}
              />
            </div>
            <div className="flex h-full min-w-0 flex-col items-center justify-end">
              <NavTab
                href="/profile"
                label="Profile"
                icon={User}
                active={profileActive}
              />
            </div>
          </div>
        </div>

        <div
          className="bg-white"
          style={{ height: "env(safe-area-inset-bottom, 0px)" }}
        />
      </div>
    </nav>
  );
}
