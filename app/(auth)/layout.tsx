import Link from "next/link";
import { AuthBackground } from "@/components/auth/auth-background";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background">
      <AuthBackground />

      {/* Top bar — Logo (which is itself the home link) on the left,
          subtle "Explore" link on the right. Sits over the dark top
          gradient, so text is white for legibility. */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5 sm:px-8 sm:pt-7">
        <Logo href="/feed" size="md" className="!text-white drop-shadow-sm" />

        <Link
          href="/feed"
          className="inline-flex h-9 items-center rounded-full bg-card px-3.5 text-xs font-semibold text-foreground transition hover:bg-card/90"
        >
          Explore meals
        </Link>
      </header>

      {/* Centered auth card — uses design-system surface + border tokens
          so it sits flush within the brand theme. No drop shadow: the
          dark top gradient already gives the card lift. */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl border border-border bg-card p-7 sm:p-8">
            <div
              className="pointer-events-none absolute inset-x-6 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.40 0.13 152 / 0.35), transparent)",
              }}
              aria-hidden
            />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
