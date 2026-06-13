import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  /** Must match the `id` of the control for label association. */
  htmlFor: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
};

/** Label + control wrapper with consistent spacing, hint, and error messaging. */
export function Field({
  htmlFor,
  label,
  children,
  hint,
  error,
  required,
  optional,
  className,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-sm font-semibold text-foreground"
      >
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden>
            *
          </span>
        ) : null}
        {optional ? (
          <span className="font-normal text-muted-foreground/60">
            (optional)
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
