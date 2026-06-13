"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  resendEmailAuth,
  setUsername as saveUsername,
  startEmailAuth,
  startGoogleAuth,
  verifyEmailAuth,
} from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthFormError } from "@/components/auth/ui/auth-form-error";
import { AuthSubmitButton } from "@/components/auth/ui/auth-submit-button";
import { LabeledTextField } from "@/components/auth/ui/labeled-text-field";
import { OtpInput } from "@/components/auth/ui/otp-input";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";

type Step = "email" | "otp" | "username";

const USERNAME_PATTERN = "^[a-zA-Z0-9_]+$";
const USERNAME_TITLE =
  "Use letters, numbers, and underscores only (min. 3 characters)";

export function AuthFlow() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [username, setUsernameValue] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function finishSession(
    token: string,
    user: Parameters<typeof setSession>[0],
    refreshToken?: string,
  ) {
    setSession(user, token, refreshToken);
    router.push("/feed");
    router.refresh();
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await startEmailAuth(email.trim());
      setFlowId(result.flowId);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code.");
    } finally {
      setLoading(false);
    }
  }

  async function onOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!flowId) return;
    setError(null);
    setLoading(true);
    try {
      const result = await verifyEmailAuth(flowId, code);
      if (result.status === "needs_username" && result.token && result.user) {
        setPendingToken(result.token);
        setSession(result.user, result.token, result.refreshToken);
        setStep("username");
        return;
      }
      if (result.token && result.user) {
        await finishSession(result.token, result.user, result.refreshToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code.");
    } finally {
      setLoading(false);
    }
  }

  async function onUsernameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user, refreshToken } = await saveUsername(username.trim());
      await finishSession(token, user, refreshToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save username.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleClick() {
    setError(null);
    setLoading(true);
    try {
      const { redirectUrl } = await startGoogleAuth();
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  async function onResend() {
    if (!flowId) return;
    setError(null);
    setLoading(true);
    try {
      await resendEmailAuth(flowId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <RedirectIfAuthed />
      <AuthFormError message={error} />

      {step === "email" ? (
        <form onSubmit={onEmailSubmit} className="flex flex-col gap-4">
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

          <AuthSubmitButton loading={loading}>
            Continue with email
          </AuthSubmitButton>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoogleClick}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background py-3 text-sm font-semibold transition hover:bg-muted/40 disabled:opacity-60"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-center text-xs text-muted-foreground">
            We&apos;ll email you a 6-digit code. New here? Same flow — pick a
            username after verification.
          </p>
        </form>
      ) : null}

      {step === "otp" ? (
        <form onSubmit={onOtpSubmit} className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Enter the code sent to
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {email}
            </p>
          </div>

          <OtpInput value={code} onChange={setCode} disabled={loading} />

          <AuthSubmitButton loading={loading} disabled={code.length !== 6}>
            Verify code
          </AuthSubmitButton>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
              }}
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="font-medium text-primary hover:opacity-80 disabled:opacity-60"
            >
              Resend code
            </button>
          </div>
        </form>
      ) : null}

      {step === "username" ? (
        <form onSubmit={onUsernameSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Almost done — choose a username for your profile.
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
            pattern={USERNAME_PATTERN}
            title={USERNAME_TITLE}
          />

          <AuthSubmitButton loading={loading}>Continue</AuthSubmitButton>

          {pendingToken ? (
            <p className="text-xs text-muted-foreground">
              You can add your name and other details from your profile later.
            </p>
          ) : null}
        </form>
      ) : null}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
