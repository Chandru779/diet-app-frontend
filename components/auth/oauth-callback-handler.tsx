"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { completeGoogleAuth, setUsername } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthFormError } from "@/components/auth/ui/auth-form-error";
import { AuthSubmitButton } from "@/components/auth/ui/auth-submit-button";
import { LabeledTextField } from "@/components/auth/ui/labeled-text-field";

function OAuthCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [username, setUsernameValue] = useState("");

  useEffect(() => {
    const flowId = params.get("flowId");
    const clerkSessionId =
      params.get("__clerk_created_session") ?? params.get("created_session_id");

    if (!flowId) {
      setError("Missing auth flow. Please try signing in again.");
      setLoading(false);
      return;
    }

    completeGoogleAuth(flowId, clerkSessionId ?? undefined)
      .then((result) => {
        if (
          result.status === "needs_username" &&
          result.token &&
          result.user
        ) {
          setSession(result.user, result.token);
          setNeedsUsername(true);
          setLoading(false);
          return;
        }
        if (result.token && result.user) {
          setSession(result.user, result.token);
          router.replace("/feed");
          router.refresh();
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : "Google sign-in failed.",
        );
        setLoading(false);
      });
  }, [params, router, setSession]);

  async function onUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await setUsername(username.trim());
      setSession(user, token);
      router.replace("/feed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save username.");
      setLoading(false);
    }
  }

  if (needsUsername) {
    return (
      <form onSubmit={onUsernameSubmit} className="flex flex-col gap-4">
        <AuthFormError message={error} />
        <p className="text-sm text-muted-foreground">
          Choose a username to finish setting up your account.
        </p>
        <LabeledTextField
          id="username"
          label="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={setUsernameValue}
          placeholder="your_handle"
          required
          disabled={loading}
          minLength={3}
          pattern="^[a-zA-Z0-9_]+$"
        />
        <AuthSubmitButton loading={loading}>Continue</AuthSubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <AuthFormError message={error} />
      {loading && !error ? (
        <>
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Finishing Google sign-in…
          </p>
        </>
      ) : null}
    </div>
  );
}

export function OAuthCallbackHandler() {
  return (
    <Suspense
      fallback={
        <p className="py-6 text-center text-sm text-muted-foreground">
          Finishing sign-in…
        </p>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
