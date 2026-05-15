"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuthAccessTokenFromCookie } from "@/lib/auth/auth-cookie";

/**
 * When a session cookie exists, send users away from auth pages (e.g. to the app).
 * Full validation happens in `AuthGate`.
 */
export function RedirectIfAuthed({ to = "/feed" }: { to?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (getAuthAccessTokenFromCookie()) {
      router.replace(to);
    }
  }, [router, to]);

  return null;
}
