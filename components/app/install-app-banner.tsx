"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePwaInstall } from "@/lib/hooks/use-pwa-install";

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

  const description = isIOS
    ? "Tap Share, then Add to Home Screen"
    : "Use it like a native app from your home screen";

  return (
    <div
      className="meal-card flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
      role="region"
      aria-label="Install app"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {isIOS ? (
          <Share className="size-5" strokeWidth={2.25} aria-hidden />
        ) : (
          <Download className="size-5" strokeWidth={2.25} aria-hidden />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">
          Install the app
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      {!isIOS ? (
        <button
          type="button"
          onClick={handleInstall}
          disabled={installing}
          className="shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {installing ? "Opening…" : "Install"}
        </button>
      ) : null}

      <button
        type="button"
        onClick={handleDismiss}
        className="-mr-1 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        aria-label="Dismiss install banner"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
