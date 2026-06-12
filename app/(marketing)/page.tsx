import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { HomeLanding } from "@/components/marketing/home-landing";
import { fetchHomeMealsServer } from "@/lib/api/home-meals";
import { HOME_PAGE_REVALIDATE_SEC } from "@/lib/query/constants";
import { homeMealsQueryKey } from "@/lib/query/query-keys";

export const metadata = {
  title: "Dietician — Eat Clean. Build Clean.",
  description:
    "Millions of veg and non-veg meals with full macro breakdowns. 100% free.",
};

/** ISR: static shell revalidates every 5 minutes — fits mostly-static marketing content. */
export const revalidate = HOME_PAGE_REVALIDATE_SEC;

export default async function Home() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: homeMealsQueryKey,
      queryFn: fetchHomeMealsServer,
    });
  } catch {
    // Client falls back to static showcase meals when prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeLanding />
    </HydrationBoundary>
  );
}
