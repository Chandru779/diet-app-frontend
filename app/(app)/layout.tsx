import { AuthBootstrap } from "@/components/app/auth-bootstrap";
import { BottomNav } from "@/components/app/bottom-nav";
import { CreateMealSheet } from "@/components/app/create-meal-sheet";
import { RouteChangeIndicator } from "@/components/app/route-change-indicator";
import { VisualViewportSync } from "@/components/app/visual-viewport-sync";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthBootstrap>
      <VisualViewportSync />
      <RouteChangeIndicator />
      <div className="mx-auto w-full max-w-2xl px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </div>
      <BottomNav />
      <CreateMealSheet />
    </AuthBootstrap>
  );
}
