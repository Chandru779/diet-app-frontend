"use client";

import { useCallback, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareMealPackButtonProps = {
  packId: string;
  title: string;
  className?: string;
  variant?: "icon" | "pill";
  onClick?: (event: React.MouseEvent) => void;
};

export function ShareMealPackButton({
  packId,
  title,
  className,
  variant = "pill",
  onClick,
}: ShareMealPackButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(
    async (event: React.MouseEvent) => {
      onClick?.(event);
      event.preventDefault();
      event.stopPropagation();

      const url = `${window.location.origin}/meal-packs/${packId}`;

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: `${title} · Meal Pack`, url });
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        window.prompt("Copy this link:", url);
      }
    },
    [onClick, packId, title],
  );

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={(e) => void share(e)}
        aria-label={copied ? "Link copied" : "Share meal pack"}
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-muted-foreground shadow-sm transition hover:bg-white hover:text-primary",
          className,
        )}
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-600" strokeWidth={2.5} />
        ) : (
          <Share2 className="size-3.5" strokeWidth={2.25} />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => void share(e)}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition hover:bg-primary/5 hover:text-primary",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-emerald-600" strokeWidth={2.5} />
          Copied
        </>
      ) : (
        <>
          <Share2 className="size-3.5" strokeWidth={2.25} />
          Share
        </>
      )}
    </button>
  );
}
