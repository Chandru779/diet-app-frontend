"use client";

type AuthSubmitButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
};

export function AuthSubmitButton({ children, loading }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
