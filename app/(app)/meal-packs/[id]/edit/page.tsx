import { RequireAuth } from "@/components/app/require-auth";
import { MealPackForm } from "@/components/app/meal-pack/meal-pack-form";

export const metadata = {
  title: "Edit Meal Pack | Dietician",
};

type EditMealPackPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMealPackPage({
  params,
}: EditMealPackPageProps) {
  const { id } = await params;

  return (
    <RequireAuth
      title="Sign in to edit meal packs"
      description="Update your meal packs after you sign in."
    >
      <MealPackForm packId={id} />
    </RequireAuth>
  );
}
