import { Suspense } from "react";
import { MealList } from "./meal-list";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";

export const metadata = {
  title: "Feed | Dietician",
};

function FeedListFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <MealLoadingIllustration
        className="h-16 w-16 animate-pulse text-primary/50"
        label="Loading meals"
      />
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<FeedListFallback />}>
      <MealList />
    </Suspense>
  );
}
