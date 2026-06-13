"use client";

import { useRouter } from "next/navigation";
import { LogOut, Mail, User } from "lucide-react";
import { AppMenuRow } from "@/components/app/app-menu-row";
import { AppPageHeader } from "@/components/app/app-page-header";
import { InstallAppBanner } from "@/components/app/install-app-banner";
import { ProfileEditForm } from "@/components/app/profile-edit-form";
import { RequireAuth } from "@/components/app/require-auth";
import { deriveDisplayName } from "@/lib/auth/display-name";
import { useAuthStore } from "@/lib/store/auth-store";

function ProfileContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const username = user?.username;
  const email = user?.email;
  const display = deriveDisplayName(
    user?.firstName
      ? [user.firstName, user.lastName].filter(Boolean).join(" ")
      : username,
  );

  return (
    <div className="flex flex-col gap-4 pb-4">
      <AppPageHeader title="Profile" subtitle="Manage your account">
        <div className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/65 p-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-md ring-2 ring-white/80">
            {display.initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-xl font-bold leading-tight text-foreground">
              {display.firstName}
            </p>
            {username ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <User className="size-3 shrink-0" aria-hidden />
                {username}
              </span>
            ) : null}
            {email ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <Mail className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{email}</span>
              </p>
            ) : null}
          </div>
        </div>
      </AppPageHeader>

      <InstallAppBanner />

      <ProfileEditForm />

      <section className="flex flex-col gap-2" aria-label="Account actions">
        <p className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
          Account
        </p>
        <AppMenuRow
          icon={LogOut}
          title="Sign out"
          description="You will be redirected to login"
          variant="destructive"
          onClick={() => {
            logout();
            router.push("/login");
            router.refresh();
          }}
        />
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth
      title="Sign in to view your profile"
      description="Your profile, shortcuts, and sign-out live behind a quick sign-in."
    >
      <ProfileContent />
    </RequireAuth>
  );
}
