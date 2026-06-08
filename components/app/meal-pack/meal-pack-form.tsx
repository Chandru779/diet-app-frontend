"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppPageHeader } from "@/components/app/app-page-header";
import { MealPackMealPicker } from "@/components/app/meal-pack/meal-pack-meal-picker";
import { MealPackSelectedBar } from "@/components/app/meal-pack/meal-pack-selected-bar";
import {
  createMealPack,
  fetchMealPackById,
  updateMealPack,
} from "@/lib/api/meal-packs";
import { useFeedStore } from "@/lib/store/feed-store";
import {
  toPickableMeal,
  type PickableMeal,
} from "@/lib/types/meal-pack";

type MealPackFormProps = {
  packId?: string;
};

export function MealPackForm({ packId }: MealPackFormProps) {
  const router = useRouter();
  const bumpRefresh = useFeedStore((s) => s.bumpRefresh);
  const isEdit = Boolean(packId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMeals, setSelectedMeals] = useState<PickableMeal[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packId) return;

    let cancelled = false;
    setLoading(true);
    fetchMealPackById(packId)
      .then((pack) => {
        if (cancelled) return;
        if (!pack.isOwner) {
          router.replace(`/meal-packs/${packId}`);
          return;
        }
        setTitle(pack.title);
        setDescription(pack.description ?? "");
        const meals = pack.items.map(toPickableMeal);
        setSelectedMeals(meals);
        setSelectedIds(new Set(meals.map((m) => m.id)));
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
  }, [packId, router]);

  function handleSelectionChange(ids: Set<string>, meals: PickableMeal[]) {
    setSelectedIds(ids);
    setSelectedMeals(meals);
  }

  function removeSelected(mealId: string) {
    const nextIds = new Set(selectedIds);
    nextIds.delete(mealId);
    setSelectedIds(nextIds);
    setSelectedMeals((prev) => prev.filter((m) => m.id !== mealId));
  }

  async function save(andCreateAnother = false) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Enter a pack name.");
      return;
    }
    if (selectedIds.size === 0) {
      setError("Select at least one meal.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: trimmedTitle,
        description: description.trim() || undefined,
        mealIds: [...selectedIds],
      };

      if (isEdit && packId) {
        await updateMealPack(packId, payload);
        bumpRefresh();
        router.push(`/meal-packs/${packId}`);
        return;
      }

      await createMealPack(payload);
      bumpRefresh();

      if (andCreateAnother) {
        setTitle("");
        setDescription("");
        setSelectedIds(new Set());
        setSelectedMeals([]);
        setExpanded(false);
        return;
      }

      router.push("/meal-packs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save meal pack.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="meal-card flex min-h-[40vh] items-center justify-center rounded-2xl bg-white">
        <p className="text-sm text-muted-foreground">Loading meal pack…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-40">
      <AppPageHeader
        title={isEdit ? "Edit meal pack" : "Create meal pack"}
        subtitle="Name your pack, then add meals from any source"
      >
        <Link
          href={isEdit && packId ? `/meal-packs/${packId}` : "/meal-packs"}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
      </AppPageHeader>

      <div className="meal-card flex flex-col gap-3 rounded-2xl bg-white p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            Pack name
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly prep"
            className="rounded-xl border border-border/70 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">
            Description (optional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What's this pack for?"
            className="resize-none rounded-xl border border-border/70 px-3 py-2.5 text-sm outline-none ring-primary/20 focus:ring-2"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <MealPackMealPicker
        selectedIds={selectedIds}
        selectedMeals={selectedMeals}
        onSelectionChange={handleSelectionChange}
      />

      <MealPackSelectedBar
        selectedMeals={selectedMeals}
        expanded={expanded}
        onToggleExpanded={() => setExpanded((v) => !v)}
        onRemove={removeSelected}
        onSave={() => void save(false)}
        onSaveAndCreateAnother={
          isEdit ? undefined : () => void save(true)
        }
        saving={saving}
        saveLabel={isEdit ? "Save changes" : "Save pack"}
        showSaveAndCreate={!isEdit}
      />
    </div>
  );
}
