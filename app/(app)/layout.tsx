import { AuthBootstrap } from "@/components/app/auth-bootstrap";
import { BottomNav } from "@/components/app/bottom-nav";
import { CreateMealSheet } from "@/components/app/create-meal-sheet";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthBootstrap>
      <div className="mx-auto w-full max-w-2xl px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
      <BottomNav />
      <CreateMealSheet />
    </AuthBootstrap>
  );
}
