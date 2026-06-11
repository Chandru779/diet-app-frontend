"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { AppPageHeader } from "@/components/app/app-page-header";
import { FeedPostCard } from "@/components/app/feed-post-card";
import { MealLoadingIllustration } from "@/components/app/meal-loading-illustration";
import { MealPackStats } from "@/components/app/meal-pack/meal-pack-stats";
import { ShareMealPackButton } from "@/components/app/meal-pack/share-meal-pack-button";
import {
  deleteMealPack,
  fetchMealPackById,
  recordMealPackView,
  type MealPackDetail,
} from "@/lib/api/meal-packs";
import type { ApiMeal } from "@/lib/types/meal";
import { useFeedStore } from "@/lib/store/feed-store";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function MealPackDetailView() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const bumpRefresh = useFeedStore((s) => s.bumpRefresh);
  const [pack, setPack] = useState<MealPackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMealPackById(params.id)
      .then((data) => {
        if (!cancelled) {
          setPack(data);
          void recordMealPackView(params.id)
            .then(() => {
              if (!cancelled) {
                setPack((current) =>
                  current
                    ? { ...current, viewCount: current.viewCount + 1 }
                    : current,
                );
              }
            })
            .catch(() => undefined);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load meal pack.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function handleDelete() {
    if (!pack || deleting || !pack.isOwner) return;
    const ok = window.confirm(`Delete "${pack.title}"? This cannot be undone.`);
    if (!ok) return;

    setDeleting(true);
    try {
      await deleteMealPack(pack.id);
      bumpRefresh();
      router.push("/meal-packs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete pack.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div
        className="meal-card flex min-h-[40vh] flex-col items-center justify-center rounded-2xl bg-white py-12"
        aria-busy
      >
        <MealLoadingIllustration
          className="h-12 w-12 animate-pulse text-primary/55"
          label="Loading meal pack"
        />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="flex flex-col gap-3 pb-4">
        <AppPageHeader title="Meal pack" subtitle="Something went wrong">
          <Link
            href="/meal-packs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <ArrowLeft className="size-3.5" />
            Back to packs
          </Link>
        </AppPageHeader>
        <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error ?? "Meal pack not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      <AppPageHeader
        title={pack.title}
        subtitle={
          pack.description ??
          (pack.isOwner
            ? "Your meal pack"
            : `Shared by @${pack.owner.username}`)
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {pack.isOwner ? (
            <Link
              href="/meal-packs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <ArrowLeft className="size-3.5" />
              All packs
            </Link>
          ) : (
            <Link
              href="/feed"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <ArrowLeft className="size-3.5" />
              Explore feed
            </Link>
          )}

          <ShareMealPackButton packId={pack.id} title={pack.title} />

          {pack.isOwner ? (
            <>
              <Link
                href={`/meal-packs/${pack.id}/edit`}
                className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
              >
                <Pencil className="size-3.5" />
                Edit
              </Link>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <UserRound className="size-3.5" />
              View only
            </span>
          )}
        </div>
      </AppPageHeader>

      <div className="meal-card rounded-2xl bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {!pack.isOwner ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <UserRound className="size-3" />@{pack.owner.username}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <CalendarDays className="size-3" />
            Updated {formatDate(pack.updatedAt)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <Eye className="size-3" />
            {pack.viewCount} view{pack.viewCount === 1 ? "" : "s"}
          </span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
          Nutrition overview
        </p>
        <MealPackStats pack={pack} className="mt-2" />
      </div>

      <div className="px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
          Meals in this pack ({pack.items.length})
        </p>
      </div>

      {pack.items.length === 0 ? (
        <p className="meal-card rounded-2xl bg-white px-4 py-6 text-center text-sm text-muted-foreground">
          {pack.isOwner
            ? "This pack has no meals yet. Edit it to add some."
            : "No public meals are visible in this pack."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pack.items.map((item) => (
            <li key={item.id}>
              <FeedPostCard post={item as unknown as ApiMeal} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
