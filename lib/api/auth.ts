import { http } from "./http";
import type { AuthSessionPayload, AuthUser } from "@/lib/types/auth";

export type SignInBody = {
  email: string;
  password: string;
};

export type SignUpBody = {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
};

export async function signIn(body: SignInBody): Promise<AuthSessionPayload> {
  const res = await http.post<AuthSessionPayload>("/auth/signin", body);
  return res.data;
}

export async function signUp(body: SignUpBody): Promise<AuthSessionPayload> {
  const res = await http.post<AuthSessionPayload>("/auth/signup", body);
  return res.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await http.get<AuthUser>("/auth/me", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
