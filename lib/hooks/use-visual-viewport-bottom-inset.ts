"use client";

import { useEffect } from "react";

const CSS_VAR = "--vv-bottom-inset";

function isIosWebKit(): boolean {
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function shouldTrackVisualViewportInset(): boolean {
  if (!window.visualViewport) {
    return false;
  }

  // Desktop browsers fire visualViewport events during page scroll even though
  // inset is always 0 — skip to avoid fixed-bottom UI jitter.
  return (
    isIosWebKit() ||
    window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
}

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
 *
 * Only listens to resize — not visualViewport scroll. Page scroll changes
 * offsetTop and would fight fixed positioning, causing bottom-bar jitter.
 */
export function useVisualViewportBottomInset() {
  useEffect(() => {
    if (!shouldTrackVisualViewportInset()) {
      return;
    }

    const viewport = window.visualViewport;
    let rafId = 0;
    let lastInset = -1;

    const applyInset = (inset: number) => {
      if (inset === lastInset) {
        return;
      }
      lastInset = inset;
      document.documentElement.style.setProperty(CSS_VAR, `${inset}px`);
    };

    const sync = () => {
      if (rafId !== 0) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        applyInset(readVisualViewportBottomInset());
      });
    };

    applyInset(readVisualViewportBottomInset());
    viewport?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      viewport?.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      document.documentElement.style.removeProperty(CSS_VAR);
    };
  }, []);
}
