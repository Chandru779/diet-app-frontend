import Link from "next/link";
import { BRAND } from "@/lib/constants/branding";

type LogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const textSize = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} as const;

const dotSize = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
} as const;

export function Logo({ href = "/", size = "md", className = "" }: LogoProps) {
  const inner = (
    <span
      className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight text-foreground ${textSize[size]} ${className}`}
    >
      <span
        className={`shrink-0 rounded-full bg-primary ${dotSize[size]}`}
        aria-hidden
      />
      {BRAND.name}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-75">
        {inner}
      </Link>
    );
  }
  return inner;
}
