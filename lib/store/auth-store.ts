import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearAuthTokens,
  setAuthAccessTokenCookie,
  setAuthRefreshTokenCookie,
} from "@/lib/auth/auth-cookie";
import type { AuthUser } from "@/lib/types/auth";

type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  /**
   * Persists a session. `refreshToken` is optional so callers that only refresh
   * the user/access token (e.g. profile updates) don't wipe the refresh cookie.
   */
  setSession: (user: AuthUser, token: string, refreshToken?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      refreshToken: null,
      setSession: (user, token, refreshToken) => {
        setAuthAccessTokenCookie(token);
        if (refreshToken) setAuthRefreshTokenCookie(refreshToken);
        set((state) => ({
          isLoggedIn: true,
          user,
          token,
          refreshToken: refreshToken ?? state.refreshToken,
        }));
      },
      logout: () => {
        clearAuthTokens();
        set({
          isLoggedIn: false,
          user: null,
          token: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: "dietician-auth",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        token: s.token,
        refreshToken: s.refreshToken,
      }),
    },
  ),
);
