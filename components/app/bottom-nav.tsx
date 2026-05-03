"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User } from "lucide-react";
import { useFeedStore } from "@/lib/store/feed-store";

export function BottomNav() {
  const pathname = usePathname();
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);

  const homeActive = pathname === "/feed" || pathname.startsWith("/feed/");
  const profileActive = pathname.startsWith("/profile");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 rounded-t-[1.75rem] bg-white"
      style={{ boxShadow: "0 -2px 20px rgba(0,0,0,0.07)" }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-around pb-safe px-10 pt-2 pb-4">
        {/* Home */}
        <Link
          href="/feed"
          className="flex flex-col items-center gap-1"
          aria-label="Home"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              homeActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Home className="size-5" />
          </span>
          <span
            className={`text-[10px] font-semibold ${homeActive ? "text-primary" : "text-muted-foreground"}`}
          >
            Home
          </span>
        </Link>

        {/* FAB */}
        <button
          type="button"
          onClick={openCreateSheet}
          aria-label="Create new meal"
          className="flex h-13 w-13 -mt-5 h-[52px] w-[52px] items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_18px_rgba(0,0,0,0.20)] transition hover:opacity-90 active:scale-95"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>

        {/* Profile */}
        <Link
          href="/profile"
          className="flex flex-col items-center gap-1"
          aria-label="Profile"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
              profileActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <User className="size-5" />
          </span>
          <span
            className={`text-[10px] font-semibold ${profileActive ? "text-primary" : "text-muted-foreground"}`}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
