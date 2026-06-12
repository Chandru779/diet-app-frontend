"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, ClipboardList, Home, Package, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";
import { useFeedStore } from "@/lib/store/feed-store";
import { cn } from "@/lib/utils";

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
      className={cn(
        "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "bg-primary/[0.11] text-primary shadow-lg"
          : "text-muted-foreground/75 hover:bg-white/50 hover:text-foreground",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className="size-[22px] shrink-0"
        strokeWidth={active ? 2.35 : 2}
        aria-hidden
      />
      <span
        className={cn(
          "max-w-full truncate text-[10px] font-semibold leading-tight tracking-tight",
          active ? "text-primary" : "text-muted-foreground/65",
        )}
      >
        {label}
      </span>
    </Link>
  );
}

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
  const savedActive = pathname === "/saved" || pathname.startsWith("/saved/");
  const mealPacksActive =
    pathname === "/meal-packs" || pathname.startsWith("/meal-packs/");

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 translate-y-[calc(-1*var(--vv-bottom-inset,0px))] will-change-transform"
      aria-label="Main navigation"
    >
      <div className="bg-feed-header pointer-events-auto relative rounded-t-[2rem] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--vv-bottom-inset,0px)] after:bg-feed-header">
        <div className="mx-auto grid max-w-2xl grid-cols-5 items-center gap-0.5 px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))]">
          <NavTab href="/feed" label="Home" icon={Home} active={homeActive} />
          <NavTab
            href="/my-meals"
            label="My Meals"
            icon={ClipboardList}
            active={myMealsActive}
          />
          <div className="flex items-center justify-center py-2">
            <button
              type="button"
              onClick={handleLogMeal}
              aria-label="Log a meal"
              className={cn(
                "nav-fab flex size-12 shrink-0 items-center justify-center rounded-full transition-transform duration-200",
                "active:scale-95",
              )}
            >
              <Plus className="size-6" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
          <NavTab
            href="/saved"
            label="Saved"
            icon={Bookmark}
            active={savedActive}
          />
          <NavTab
            href="/meal-packs"
            label="Packs"
            icon={Package}
            active={mealPacksActive}
          />
        </div>
      </div>
    </nav>
  );
}
