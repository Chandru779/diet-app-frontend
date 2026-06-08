"use client";

import { useEffect } from "react";

const CSS_VAR = "--vv-bottom-inset";

function readVisualViewportBottomInset(): number {
  const viewport = window.visualViewport;
  if (!viewport) {
    return 0;
  }

  const inset = window.innerHeight - viewport.height - viewport.offsetTop;
  return Math.max(0, Math.round(inset));
}

/**
 * Keeps fixed bottom UI flush with the visible screen on iOS Safari, where the
 * browser toolbar shrinks the visual viewport without moving layout-fixed elements.
 */
export function useVisualViewportBottomInset() {
  useEffect(() => {
    const viewport = window.visualViewport;

    const sync = () => {
      document.documentElement.style.setProperty(
        CSS_VAR,
        `${readVisualViewportBottomInset()}px`,
      );
    };

    sync();
    viewport?.addEventListener("resize", sync);
    viewport?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      viewport?.removeEventListener("resize", sync);
      viewport?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      document.documentElement.style.removeProperty(CSS_VAR);
    };
  }, []);
}
