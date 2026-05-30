import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";

export default function MealDetailLoading() {
  return (
    <div
      className="-mx-4 -mt-5 flex min-h-[55vh] flex-col items-center justify-center gap-3"
      aria-busy="true"
      aria-live="polite"
    >
      <MealLoadingIllustration
        className="h-14 w-14 animate-pulse text-primary/50"
        label="Loading meal"
      />
      <p className="text-sm font-medium text-muted-foreground">Loading meal…</p>
    </div>
  );
}
