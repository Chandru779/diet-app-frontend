import { http } from "./http";
import type { FeedHomeResponse } from "@/lib/types/feed";

let pendingHome: Promise<FeedHomeResponse> | null = null;

export async function fetchFeedHome(): Promise<FeedHomeResponse> {
  if (pendingHome) return pendingHome;

  pendingHome = http
    .get<FeedHomeResponse>("/feed", {
      headers: { "Cache-Control": "no-store" },
    })
    .then((res) => res.data)
    .finally(() => {
      pendingHome = null;
    });

  return pendingHome;
}
