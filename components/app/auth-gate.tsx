"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="flex min-h-[40vh] items-center justify-center font-nunito text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }
  if (!isLoggedIn) return null;
  return <>{children}</>;
}
