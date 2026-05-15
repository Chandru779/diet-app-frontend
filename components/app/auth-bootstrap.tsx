"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import {
  clearAuthAccessTokenCookie,
  getAuthAccessTokenFromCookie,
} from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Rehydrates the auth store on mount and, if a session cookie is present,
 * validates it against `GET /auth/me`. Never blocks rendering — pages that
 * truly require auth should wrap themselves in `<RequireAuth>` instead.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const api = useAuthStore.persist;
    const validate = () => {
      const token = getAuthAccessTokenFromCookie();
      if (!token) {
        if (useAuthStore.getState().isLoggedIn) logout();
        return;
      }
      fetchCurrentUser()
        .then((user) => setSession(user, token))
        .catch(() => {
          clearAuthAccessTokenCookie();
          logout();
        });
    };

    if (api.hasHydrated()) {
      validate();
      return;
    }
    const unsub = api.onFinishHydration(validate);
    void api.rehydrate();
    return unsub;
  }, [logout, setSession]);

  return <>{children}</>;
}
