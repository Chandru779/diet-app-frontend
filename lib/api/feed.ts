import { http } from "./http";
import type { FeedHomeResponse } from "@/lib/types/feed";

export async function fetchFeedHome(): Promise<FeedHomeResponse> {
  const res = await http.get<FeedHomeResponse>("/feed", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
