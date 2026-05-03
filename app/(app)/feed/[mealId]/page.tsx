import { notFound } from "next/navigation";
import { fetchMealById } from "@/lib/api/meal";
import { MealDetails } from "@/components/app/meal-details";

type MealDetailPageProps = {
  params: Promise<{ mealId: string }>;
};

export default async function MealDetailPage({ params }: MealDetailPageProps) {
  const { mealId } = await params;

  try {
    const meal = await fetchMealById(mealId);
    return <MealDetails meal={meal} />;
  } catch {
    notFound();
  }
}
