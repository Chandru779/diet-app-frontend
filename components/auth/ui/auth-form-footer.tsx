"use client";

import Link from "next/link";

type AuthFormFooterProps = {
  prompt: string;
  href: string;
  linkLabel: string;
};

export function AuthFormFooter({ prompt, href, linkLabel }: AuthFormFooterProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
      </Link>
    </p>
  );
}
