import { RequireAuth } from "@/components/app/require-auth";
import { SavedList } from "./saved-list";

export const metadata = {
  title: "Saved | Dietician",
};

export default function SavedPage() {
  return (
    <RequireAuth
      title="Sign in to see saved meals"
      description="Save meals you love — they will appear here once you sign in."
    >
      <SavedList />
    </RequireAuth>
  );
}
