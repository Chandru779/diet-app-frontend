import { RequireAuth } from "@/components/app/require-auth";
import { MyMealsList } from "./my-meals-list";

export const metadata = {
  title: "My meals | Dietician",
};

export default function MyMealsPage() {
  return (
    <RequireAuth
      title="Sign in to see your meals"
      description="Once you sign in, every meal you log shows up here."
    >
      <MyMealsList />
    </RequireAuth>
  );
}
