"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import {
  getAuthAccessTokenFromCookie,
  getAuthRefreshTokenFromCookie,
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
      const accessToken = getAuthAccessTokenFromCookie();
      const refreshToken = getAuthRefreshTokenFromCookie();
      // No credentials at all — make sure we aren't showing a stale session.
      if (!accessToken && !refreshToken) {
        if (useAuthStore.getState().isLoggedIn) logout();
        return;
      }
      // `http` transparently refreshes on a 401, so this both validates the
      // access token and renews it when expired.
      fetchCurrentUser()
        .then((user) => {
          const token = getAuthAccessTokenFromCookie();
          if (token) setSession(user, token);
        })
        .catch(() => {
          // The refresh interceptor already logs out when the refresh token is
          // rejected. Any error reaching here with credentials still present is
          // transient (offline, 5xx, timeout) — keep the session so the user
          // isn't bounced to /login over a network blip.
          if (!getAuthRefreshTokenFromCookie()) {
            logout();
          }
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
