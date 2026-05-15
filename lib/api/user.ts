import { http } from "./http";
import type { ApiUser } from "@/lib/types/meal";

/** GET /users — public list (id, username, timestamps). */
export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await http.get<ApiUser[]>("/users", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}

/** GET /users/:id */
export async function fetchUserById(id: string): Promise<ApiUser> {
  const res = await http.get<ApiUser>(`/users/${encodeURIComponent(id)}`, {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
