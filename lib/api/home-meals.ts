import { http } from "./http";
import { getApiBaseUrl } from "./base-url";
import { HOME_PAGE_REVALIDATE_SEC } from "@/lib/query/constants";
import type { ApiMeal } from "@/lib/types/meal";

type MealsEnvelope = {
  data?: ApiMeal[];
};

function unwrapMealsPayload(payload: unknown): ApiMeal[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as MealsEnvelope).data;
    if (Array.isArray(data)) return data;
  }
  return [];
}

/** Server fetch with ISR — pre-renders home meal showcases at build/revalidate time. */
export async function fetchHomeMealsServer(): Promise<ApiMeal[]> {
  const res = await fetch(`${getApiBaseUrl()}/meals`, {
    next: { revalidate: HOME_PAGE_REVALIDATE_SEC },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch meals (${res.status})`);
  }

  const json: unknown = await res.json();
  return unwrapMealsPayload(json);
}

/** Client fetch for React Query — shared by home landing sections. */
export async function fetchHomeMealsClient(): Promise<ApiMeal[]> {
  const res = await http.get<ApiMeal[]>("/meals");
  return res.data;
}
