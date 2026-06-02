"use client";

import { useState } from "react";
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
      setError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        Edit profile
      </p>
      <AuthFormError message={error} />
      {success ? (
        <p className="text-xs font-medium text-primary">{success}</p>
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

      <AuthSubmitButton loading={loading}>Save changes</AuthSubmitButton>
    </form>
  );
}
