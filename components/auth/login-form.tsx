"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthFormError } from "@/components/auth/ui/auth-form-error";
import { AuthFormFooter } from "@/components/auth/ui/auth-form-footer";
import { AuthSubmitButton } from "@/components/auth/ui/auth-submit-button";
import { LabeledTextField } from "@/components/auth/ui/labeled-text-field";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await signIn({ email: email.trim(), password });
      setSession(user, token);
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign in failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <RedirectIfAuthed />
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <AuthFormError message={error} />

        <LabeledTextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <LabeledTextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          disabled={loading}
        />

        <AuthSubmitButton loading={loading}>Sign in</AuthSubmitButton>

        <AuthFormFooter
          prompt="No account?"
          href="/register"
          linkLabel="Create one"
        />
      </form>
    </>
  );
}
