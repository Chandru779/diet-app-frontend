import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-hero-wash px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50"
        aria-hidden
      />

      <div className="relative mb-8 flex flex-col items-center gap-2">
        <Logo href="/" size="lg" />
        <Link
          href="/"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Back to home
        </Link>
      </div>

      <div className="relative w-full max-w-sm rounded-2xl border border-border/80 bg-card p-7 shadow-card">
        {children}
      </div>
    </div>
  );
}
