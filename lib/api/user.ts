import { http } from "./http";
import type { AuthUser } from "@/lib/types/auth";

export type UpdateProfileBody = {
  username?: string;
  firstName?: string;
  lastName?: string;
};

export async function updateProfile(body: UpdateProfileBody): Promise<AuthUser> {
  const res = await http.patch<AuthUser>("/users/me", body);
  return res.data;
}
