"use client";

import { Plus, Salad } from "lucide-react";
import { useFeedStore } from "@/lib/store/feed-store";
import { useRouter } from "next/navigation";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";

export function FeedCreateMealBanner() {
  const router = useRouter();
  const openCreateSheet = useFeedStore((s) => s.openCreateSheet);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  function handleCreate() {
    const authed = isLoggedIn && Boolean(getAuthAccessTokenFromCookie());
    if (!authed) {
      router.push("/login");
      return;
    }
    openCreateSheet();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Salad className="size-7" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold text-foreground">
            Create Your Own Meal
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add ingredients and we&apos;ll calculate macros for you.
          </p>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:opacity-95 active:scale-[0.98]"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
            Create Meal
          </button>
        </div>
      </div>
    </div>
  );
}
