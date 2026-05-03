import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "client";

type AuthState = {
  isLoggedIn: boolean;
  role: UserRole;
  displayName: string | null;
  email: string | null;
  login: (email: string, displayName?: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: "client",
      displayName: null,
      email: null,
      login: (email, displayName) =>
        set({
          isLoggedIn: true,
          role: "client",
          email,
          displayName: displayName ?? "Friend",
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          role: "client",
          displayName: null,
          email: null,
        }),
    }),
    { name: "dietician-auth" },
  ),
);
