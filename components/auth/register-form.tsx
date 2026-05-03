"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

export function RegisterForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = username.trim() || "guest-user";
    login(`${next}@proteinbar.local`, next);
    router.push("/feed");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="username"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Choose a username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your-name"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:ring-offset-1"
        />
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Password login isn&apos;t enabled yet. Enter any username to explore
          the app.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
      >
        Create account &amp; continue
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
