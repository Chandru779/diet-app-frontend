"use client";

import { useEffect, useState, type ReactNode } from "react";

type MealDetailScrollShellProps = {
  hero: ReactNode;
  backButton: ReactNode;
  children: ReactNode;
};

export function MealDetailScrollShell({
  hero,
  backButton,
  children,
}: MealDetailScrollShellProps) {
  const [collapseProgress, setCollapseProgress] = useState(0);

  useEffect(() => {
    const sync = () => {
      const spacer = document.getElementById("meal-detail-collapse-spacer");
      const distance = spacer?.offsetHeight ?? 224;
      setCollapseProgress(Math.min(1, window.scrollY / distance));
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const heroHidden = collapseProgress > 0.98;

  return (
    <div className="-mx-4 pb-10">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-0"
        style={{
          opacity: 1 - collapseProgress,
          visibility: heroHidden ? "hidden" : "visible",
        }}
        aria-hidden={heroHidden}
      >
        <div className="mx-auto max-w-2xl">
          <div className="relative -mx-4 h-[240px] overflow-hidden sm:h-[280px]">
            {hero}
          </div>
        </div>
      </div>

      {backButton}

      <div
        id="meal-detail-collapse-spacer"
        className="h-[224px] sm:h-[264px]"
        aria-hidden
      />

      <div className="sticky top-0 z-10 mx-4 -mt-4 rounded-3xl bg-card px-5 pb-8 pt-5 shadow-[0_4px_28px_rgba(0,0,0,0.12)] will-change-transform">
        {children}
      </div>
    </div>
  );
}
