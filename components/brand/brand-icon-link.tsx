import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants/branding";
import { cn } from "@/lib/utils";

type BrandIconLinkProps = {
  href?: string;
  size?: number;
  /** Drop the logo’s white matte so only the mark shows on tinted headers */
  blend?: boolean;
  className?: string;
};

export function BrandIconLink({
  href = "/",
  size = 28,
  blend = false,
  className = "",
}: BrandIconLinkProps) {
  return (
    <Link
      href={href}
      aria-label={`${BRAND.name} home`}
      className={cn(
        "inline-flex shrink-0 transition-opacity hover:opacity-80 active:scale-95",
        className,
      )}
    >
      <Image
        src={BRAND.logoSrc}
        alt=""
        width={size}
        height={size}
        className={cn(
          "object-contain",
          blend ? "mix-blend-multiply" : "rounded-full",
        )}
        aria-hidden
      />
    </Link>
  );
}