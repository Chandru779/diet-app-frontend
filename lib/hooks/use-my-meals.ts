"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMealsByUserId, fetchMealsByUsername } from "@/lib/api/meal";
import { USER_LIBRARY_STALE_MS } from "@/lib/query/constants";
import { myMealsQueryKey } from "@/lib/query/query-keys";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiMeal } from "@/lib/types/meal";

async function fetchMyMeals(
  userId: string | null,
  username: string | null,
): Promise<ApiMeal[]> {
  if (userId) return fetchMealsByUserId(userId);
  if (username) return fetchMealsByUsername(username);
  return [];
}

export function useMyMeals() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const username = useAuthStore((s) => s.user?.username ?? null);

  return useQuery<ApiMeal[]>({
    queryKey: myMealsQueryKey(userId, username),
    queryFn: () => fetchMyMeals(userId, username),
    enabled: Boolean(userId || username),
    staleTime: USER_LIBRARY_STALE_MS,
    gcTime: USER_LIBRARY_STALE_MS,
  });
}
