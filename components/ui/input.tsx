import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Shared field styling so inputs, selects, and textareas stay visually consistent. */
export const fieldBaseClass =
  "w-full rounded-xl border border-input bg-background text-sm outline-none transition placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/30";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(fieldBaseClass, "h-11 px-3.5", className)}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea">
>(function Textarea({ className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(fieldBaseClass, "resize-none px-3.5 py-3", className)}
      {...props}
    />
  );
});
