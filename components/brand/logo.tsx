import Image from "next/image";
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

const iconSize = {
  sm: 20,
  md: 24,
  lg: 28,
} as const;

export function Logo({ href = "/", size = "sm", className = "" }: LogoProps) {
  const px = iconSize[size];

  const inner = (
    <span
      className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight text-foreground ${textSize[size]} ${className}`}
    >
      <Image
        src={BRAND.logoSrc}
        alt=""
        width={px}
        height={px}
        className="shrink-0 rounded-full"
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
