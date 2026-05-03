"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api/meal";
import { useAuthStore } from "@/lib/store/auth-store";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [knownUsers, setKnownUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchUsers()
      .then((users) => {
        if (cancelled) return;
        setKnownUsers(users.map((u) => u.username));
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not reach backend.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. alex-rivera"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring focus:ring-offset-1"
        />

        {/* Quick-select chips from backend */}
        {knownUsers.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {knownUsers.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setUsername(name)}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {name}
              </button>
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{error}</p>
        ) : null}
      </div>

      <div className="rounded-lg bg-muted/60 px-4 py-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          No password required — username-only access for this version.
        </p>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
      >
        Sign in
      </button>

      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
