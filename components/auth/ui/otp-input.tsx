"use client";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const digits = value.padEnd(6, " ").slice(0, 6).split("");

  function handleChange(index: number, next: string) {
    const char = next.replace(/\D/g, "").slice(-1);
    const chars = value.padEnd(6, " ").slice(0, 6).split("");
    chars[index] = char || " ";
    const joined = chars.join("").trimEnd();
    onChange(joined.replace(/\s/g, ""));

    if (char && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index]?.trim() && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digits[i]?.trim() ? digits[i] : ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e.key)}
          className="size-11 rounded-lg border border-input bg-background text-center text-lg font-semibold outline-none transition focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      ))}
    </div>
  );
}
