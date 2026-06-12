"use client";

import { useRouter } from "next/navigation";
import {
  Bookmark,
  ClipboardList,
  Home,
  LogOut,
  Mail,
  Package,
} from "lucide-react";
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
    <div className="flex flex-col gap-3 pb-4">
      <AppPageHeader title="Profile" subtitle="Your account and shortcuts">
        <div className="flex items-center gap-3">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-sm ring-2 ring-white">
            {display.initial}
          </div>
          <div className="min-w-0">
            <p className="font-heading text-lg font-bold leading-tight text-foreground">
              {display.firstName}
            </p>
            {username ? (
              <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
                @{username}
              </p>
            ) : null}
            {email ? (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/80">
                <Mail className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{email}</span>
              </p>
            ) : null}
          </div>
        </div>
      </AppPageHeader>

      <InstallAppBanner />

      <ProfileEditForm />

      <section className="flex flex-col gap-2" aria-label="Account menu">
        <p className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
          Navigate
        </p>
        <AppMenuRow
          href="/feed"
          icon={Home}
          title="Meal Feed"
          description="Discover meals and track macros"
        />
        <AppMenuRow
          href="/my-meals"
          icon={ClipboardList}
          title="My Meals"
          description="Meals you have logged"
        />
        <AppMenuRow
          href="/saved"
          icon={Bookmark}
          title="Saved"
          description="Meals you have hearted"
        />
        <AppMenuRow
          href="/meal-packs"
          icon={Package}
          title="Meal Packs"
          description="Bundles of meals you create"
        />
      </section>

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
