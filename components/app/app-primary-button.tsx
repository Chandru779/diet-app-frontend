import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type AppPrimaryButtonProps = ComponentProps<"button"> & {
  asChild?: false;
};

export function AppPrimaryButton({
  className,
  children,
  type = "button",
  ...props
}: AppPrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
