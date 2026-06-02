import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  clearAuthAccessTokenCookie,
  setAuthAccessTokenCookie,
} from "@/lib/auth/auth-cookie";
import type { AuthUser } from "@/lib/types/auth";

type AuthState = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      setSession: (user, token) => {
        setAuthAccessTokenCookie(token);
        set({ isLoggedIn: true, user, token });
      },
      logout: () => {
        clearAuthAccessTokenCookie();
        set({ isLoggedIn: false, user: null, token: null });
      },
    }),
    {
      name: "dietician-auth",
      partialize: (s) => ({
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        token: s.token,
      }),
    },
  ),
);
