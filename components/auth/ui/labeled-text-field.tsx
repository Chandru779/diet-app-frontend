"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type LabeledTextFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minLength?: number;
  pattern?: string;
  title?: string;
};

export function LabeledTextField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  minLength,
  pattern,
  title,
}: LabeledTextFieldProps) {
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const effectiveType = isPassword && revealed ? "text" : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={effectiveType}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          minLength={minLength}
          pattern={pattern}
          title={title}
          className={`w-full rounded-lg border border-input bg-background py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-60 ${
            isPassword ? "pl-4 pr-11" : "px-4"
          }`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            disabled={disabled}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground transition hover:text-foreground focus:outline-none focus-visible:text-foreground disabled:opacity-60"
          >
            {revealed ? (
              <EyeOff className="size-4" aria-hidden />
            ) : (
              <Eye className="size-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
