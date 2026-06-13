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
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl pb-0.5 pt-2.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
      )}
    >
      {/* Active indicator bar */}
      <span
        aria-hidden
        className={cn(
          "absolute top-0 h-[3px] w-7 rounded-full bg-primary transition-all duration-300 ease-out",
          active
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 group-hover:scale-50 group-hover:opacity-40",
        )}
      />

      {/* Icon chip */}
      <span
        className={cn(
          "flex h-9 w-[3.4rem] items-center justify-center rounded-2xl transition-all duration-300 ease-out",
          active
            ? "bg-primary/[0.12] text-primary"
            : "text-muted-foreground/70 group-hover:bg-foreground/[0.04] group-hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "size-[21px] shrink-0 transition-transform duration-300 ease-out",
            active ? "-translate-y-px scale-[1.06]" : "group-active:scale-90",
          )}
          strokeWidth={active ? 2.4 : 2}
          aria-hidden
        />
      </span>

      <span
        className={cn(
          "max-w-full truncate text-[10px] font-semibold leading-none tracking-tight transition-colors duration-200",
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
      <div
        className={cn(
          "bg-nav-bar pointer-events-auto relative rounded-t-[1.75rem] border-t border-white/70 backdrop-blur-xl",
          "shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.12),0_-1px_0_0_rgba(255,255,255,0.6)_inset]",
          "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--vv-bottom-inset,0px)] after:bg-nav-bar",
        )}
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5 items-end px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-1">
          <NavTab href="/feed" label="Home" icon={Home} active={homeActive} />
          <NavTab
            href="/my-meals"
            label="My Meals"
            icon={ClipboardList}
            active={myMealsActive}
          />

          {/* Center docked action */}
          <div className="flex flex-col items-center justify-end">
            <button
              type="button"
              onClick={handleLogMeal}
              aria-label="Log a meal"
              className={cn(
                "nav-fab -mt-5 flex size-14 shrink-0 items-center justify-center rounded-full",
                "ring-4 ring-background transition-transform duration-200 ease-out",
                "hover:-translate-y-0.5 active:scale-95",
              )}
            >
              <Plus className="size-6" strokeWidth={2.6} aria-hidden />
            </button>
            <span className="mt-1 text-[10px] font-semibold leading-none tracking-tight text-primary/80">
              Log
            </span>
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
