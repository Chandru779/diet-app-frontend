"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "pwa-install-dismissed";

export function InstallAppBanner() {
  const { canInstall, isInstalled, isIOS, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(true);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (isInstalled || dismissed || (!canInstall && !isIOS)) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const handleInstall = async () => {
    if (!canInstall || installing) {
      return;
    }

    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/8 p-4 shadow-sm",
      )}
      role="region"
      aria-label="Install app"
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        aria-label="Dismiss install banner"
      >
        <X className="size-4" aria-hidden />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          {isIOS ? (
            <Share className="size-5" strokeWidth={2.25} aria-hidden />
          ) : (
            <Download className="size-5" strokeWidth={2.25} aria-hidden />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-foreground">
            Install {isIOS ? "on your home screen" : "the app"}
          </p>
          {isIOS ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Tap the Share button in Safari, then choose{" "}
              <span className="font-medium text-foreground">
                Add to Home Screen
              </span>
              .
            </p>
          ) : (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                Open Dietician from your home screen like a native app.
              </p>
              <button
                type="button"
                onClick={handleInstall}
                disabled={installing}
                className="mt-3 inline-flex items-center rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {installing ? "Opening install…" : "Install app"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
