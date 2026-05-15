"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthFormError } from "@/components/auth/ui/auth-form-error";
import { AuthFormFooter } from "@/components/auth/ui/auth-form-footer";
import { AuthSubmitButton } from "@/components/auth/ui/auth-submit-button";
import { LabeledTextField } from "@/components/auth/ui/labeled-text-field";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

const USERNAME_PATTERN = "^[a-zA-Z0-9_]+$";
const USERNAME_TITLE =
  "Use letters, numbers, and underscores only (min. 3 characters)";

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await signUp({
        email: email.trim(),
        password,
        username: username.trim(),
      });
      setSession(user, token);
      router.push("/feed");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create account.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <RedirectIfAuthed />
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <AuthFormError message={error} />

        <LabeledTextField
          id="username"
          label="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={setUsername}
          placeholder="your_handle"
          required
          disabled={loading}
          minLength={3}
          pattern={USERNAME_PATTERN}
          title={USERNAME_TITLE}
        />

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
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          required
          disabled={loading}
          minLength={8}
        />

        <p className="text-xs text-muted-foreground">
          You can add your name and other details from your profile later.
        </p>

        <AuthSubmitButton loading={loading}>
          Create account
        </AuthSubmitButton>

        <AuthFormFooter
          prompt="Already have an account?"
          href="/login"
          linkLabel="Sign in"
        />
      </form>
    </>
  );
}
