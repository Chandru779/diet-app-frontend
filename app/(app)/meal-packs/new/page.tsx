import { RequireAuth } from "@/components/app/require-auth";
import { MealPackForm } from "@/components/app/meal-pack/meal-pack-form";

export const metadata = {
  title: "Create Meal Pack | Dietician",
};

export default function NewMealPackPage() {
  return (
    <RequireAuth
      title="Sign in to create meal packs"
      description="Bundle meals from My Meals, Saved, Discover, and collections."
    >
      <MealPackForm />
    </RequireAuth>
  );
}
