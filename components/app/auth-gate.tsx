"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { useAuthStore } from "@/lib/store/auth-store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (api.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = api.onFinishHydration(() => setHydrated(true));
    void api.rehydrate();
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) router.replace("/login");
  }, [hydrated, isLoggedIn, router]);

  if (!hydrated) {
    return (
      <div
        className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
        aria-busy="true"
        aria-live="polite"
      >
        <MealLoadingIllustration
          className="h-14 w-14 animate-pulse text-primary/55"
          label="Loading"
        />
      </div>
    );
  }
  if (!isLoggedIn) return null;
  return <>{children}</>;
}
