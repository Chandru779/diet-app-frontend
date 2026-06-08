import { RequireAuth } from "@/components/app/require-auth";
import { MealPacksList } from "./meal-packs-list";

export const metadata = {
  title: "Meal Packs | Dietician",
};

export default function MealPacksPage() {
  return (
    <RequireAuth
      title="Sign in to manage meal packs"
      description="Create and organize meal packs once you sign in."
    >
      <MealPacksList />
    </RequireAuth>
  );
}
