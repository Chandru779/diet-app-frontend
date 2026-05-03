import Link from "next/link";
import { BRAND } from "@/lib/constants/branding";
import { Logo } from "@/components/brand/logo";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-hero-wash">
      <div
        className="pointer-events-none absolute inset-0 bg-dot-grid opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-10 px-6 py-16">
        {/* Brand */}
        <div className="space-y-5">
          <Logo size="lg" href={undefined} />

          <div className="space-y-3">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              Nutrition · Clarity · Confidence
            </span>

            <p className="text-base leading-relaxed text-muted-foreground">
              {BRAND.tagline} Explore real meal data with full macro breakdowns
              and ingredient details.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "Color-coded macros",
              "Real ingredient data",
              "Instant search",
            ].map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex h-12 items-center justify-center rounded-xl border border-border bg-card/80 text-sm font-medium backdrop-blur-sm transition hover:bg-muted/70"
          >
            Create account
          </Link>
          <Link
            href="/feed"
            className="flex h-12 items-center justify-center rounded-xl text-sm text-muted-foreground transition hover:text-foreground"
          >
            Browse as guest →
          </Link>
        </div>
      </div>
    </main>
  );
}
