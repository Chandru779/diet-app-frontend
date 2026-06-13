"use client";

import { useState } from "react";
import { CheckCircle2, UserCog } from "lucide-react";
import { updateProfile } from "@/lib/api/user";
import { useAuthStore } from "@/lib/store/auth-store";
import { AuthFormError } from "@/components/auth/ui/auth-form-error";
import { AuthSubmitButton } from "@/components/auth/ui/auth-submit-button";
import { LabeledTextField } from "@/components/auth/ui/labeled-text-field";

export function ProfileEditForm() {
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);

  const [username, setUsername] = useState(user?.username ?? "");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const updated = await updateProfile({
        username: username.trim() || undefined,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      if (token) setSession(updated, token);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col gap-2" aria-label="User details">
      <p className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        User details
      </p>
      <form
        onSubmit={onSubmit}
        className="meal-card flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCog className="size-5" strokeWidth={2.25} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Edit your details
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Update how your name appears across the app
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-border" aria-hidden />

        <AuthFormError message={error} />
        {success ? (
          <p className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            {success}
          </p>
        ) : null}

        <LabeledTextField
          id="profile-username"
          label="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={setUsername}
          placeholder="your_handle"
          required
          disabled={loading}
          minLength={3}
          pattern="^[a-zA-Z0-9_]+$"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabeledTextField
            id="profile-first-name"
            label="First name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Optional"
            disabled={loading}
          />

          <LabeledTextField
            id="profile-last-name"
            label="Last name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={setLastName}
            placeholder="Optional"
            disabled={loading}
          />
        </div>

        <AuthSubmitButton loading={loading}>Save changes</AuthSubmitButton>
      </form>
    </section>
  );
}
