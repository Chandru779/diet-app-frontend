"use client";

import { useVisualViewportBottomInset } from "@/lib/hooks/use-visual-viewport-bottom-inset";

export function VisualViewportSync() {
  useVisualViewportBottomInset();
  return null;
}
