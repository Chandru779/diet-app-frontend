import { AuthGate } from "@/components/app/auth-gate";
import { BottomNav } from "@/components/app/bottom-nav";
import { CreateMealSheet } from "@/components/app/create-meal-sheet";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      {/* pb-28 keeps content above the bottom nav */}
      <div className="mx-auto w-full max-w-2xl px-4 pb-28">{children}</div>
      <BottomNav />
      <CreateMealSheet />
    </AuthGate>
  );
}
