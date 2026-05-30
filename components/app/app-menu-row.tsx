"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AppMenuRowProps = {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function AppMenuRow({
  href,
  onClick,
  icon: Icon,
  iconClassName,
  title,
  description,
  variant = "default",
}: AppMenuRowProps) {
  const isDestructive = variant === "destructive";

  const content = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          isDestructive
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary",
          iconClassName,
        )}
      >
        <Icon className="size-5" strokeWidth={2.25} aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span
          className={cn(
            "block text-sm font-semibold",
            isDestructive ? "text-destructive" : "text-foreground",
          )}
        >
          {title}
        </span>
        {description ? (
          <span
            className={cn(
              "mt-0.5 block text-xs",
              isDestructive
                ? "text-destructive/65"
                : "text-muted-foreground",
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
      <ChevronRight
        className={cn(
          "size-4 shrink-0",
          isDestructive ? "text-destructive/50" : "text-muted-foreground/40",
        )}
        aria-hidden
      />
    </>
  );

  const className = cn(
    "meal-card flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm transition active:scale-[0.99]",
    isDestructive
      ? "hover:bg-destructive/5"
      : "hover:bg-muted/20",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
