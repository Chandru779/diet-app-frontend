"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { useFeedStore } from "@/lib/store/feed-store";
import {
  defaultQuantityFieldsForCatalogItem,
  getCatalogItemByKey,
  type MealCatalogItem,
} from "@/lib/types/meal-catalog";
import { NUTRIENT_COLORS } from "@/lib/constants/nutrients";
import { createMeal, fetchMealCatalog } from "@/lib/api/meal";

// ── Types ────────────────────────────────────────────────────────────────────

type IngredientRow = {
  id: string;
  ingredientKey: string;
  quantity: string;
  quantityUnit: "grams" | "count" | "ml";
};

function rowIsNutritionValid(
  catalog: readonly MealCatalogItem[],
  r: IngredientRow,
): boolean {
  const qty = parseFloat(r.quantity);
  const item = getCatalogItemByKey(catalog, r.ingredientKey);
  if (!r.ingredientKey || !item || !qty || qty <= 0) return false;
  if (r.quantityUnit === "count") {
    return Boolean(item.countOption);
  }
  if (r.quantityUnit === "ml") {
    return item.densityGPerMl != null && item.densityGPerMl > 0;
  }
  return true;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

const QUICK_GRAMS = [50, 100, 150, 200, 250] as const;
const QUICK_COUNT = [1, 2, 3, 4] as const;
const QUICK_ML = [50, 100, 150, 200, 250] as const;

const MEAL_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

// ── Main component ───────────────────────────────────────────────────────────

export function CreateMealSheet() {
  const displayName = useAuthStore((s) => s.displayName);
  const bumpRefresh = useFeedStore((s) => s.bumpRefresh);
  const isOpen = useFeedStore((s) => s.isCreateSheetOpen);
  const closeStoreSheet = useFeedStore((s) => s.closeCreateSheet);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<IngredientRow[]>([
    { id: uid(), ingredientKey: "", quantity: "100", quantityUnit: "grams" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mealImageFile, setMealImageFile] = useState<File | null>(null);
  const [mealImagePreviewUrl, setMealImagePreviewUrl] = useState<string | null>(
    null,
  );
  const mealImageInputRef = useRef<HTMLInputElement>(null);
  /** Full catalog (GET /meals/catalog with no query) — used for resolution & macro math. */
  const [catalog, setCatalog] = useState<MealCatalogItem[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<
    "idle" | "loading" | "ok" | "error"
  >("idle");

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!mealImageFile) {
      setMealImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(mealImageFile);
    setMealImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [mealImageFile]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setCatalogStatus("loading");

    fetchMealCatalog()
      .then((items) => {
        if (!cancelled) {
          setCatalog(items);
          setCatalogStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalog([]);
          setCatalogStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // ── Derived state ──────────────────────────────────────────────────────────

  const liveTotal = useMemo(() => {
    let proteinG = 0,
      carbsG = 0,
      fatG = 0,
      caloriesKcal = 0;
    for (const row of rows) {
      const preset = getCatalogItemByKey(catalog, row.ingredientKey);
      const qty = parseFloat(row.quantity);
      if (!preset || !qty || qty <= 0) continue;
      if (row.quantityUnit === "count") {
        const per = preset.countOption?.perUnit;
        if (!per) continue;
        proteinG += per.proteinG * qty;
        carbsG += per.carbsG * qty;
        fatG += per.fatG * qty;
        caloriesKcal += per.caloriesKcal * qty;
      } else if (row.quantityUnit === "ml") {
        const d = preset.densityGPerMl;
        if (!d) continue;
        const f = (qty * d) / 100;
        proteinG += preset.proteinPer100g * f;
        carbsG += preset.carbsPer100g * f;
        fatG += preset.fatPer100g * f;
        caloriesKcal += preset.caloriesPer100g * f;
      } else {
        const f = qty / 100;
        proteinG += preset.proteinPer100g * f;
        carbsG += preset.carbsPer100g * f;
        fatG += preset.fatPer100g * f;
        caloriesKcal += preset.caloriesPer100g * f;
      }
    }
    return {
      proteinG: round1(proteinG),
      carbsG: round1(carbsG),
      fatG: round1(fatG),
      caloriesKcal: Math.round(caloriesKcal),
    };
  }, [rows, catalog]);

  const hasValidRows = rows.some((r) => rowIsNutritionValid(catalog, r));
  const canSubmit =
    title.trim().length > 0 &&
    catalogStatus === "ok" &&
    catalog.length > 0 &&
    hasValidRows &&
    !submitting;

  // ── Row helpers ────────────────────────────────────────────────────────────

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      { id: uid(), ingredientKey: "", quantity: "100", quantityUnit: "grams" },
    ]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const setRowIngredient = (id: string, ingredientKey: string) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (!ingredientKey) {
          return { ...r, ingredientKey: "" };
        }
        const item = getCatalogItemByKey(catalog, ingredientKey);
        const { quantity, quantityUnit } =
          defaultQuantityFieldsForCatalogItem(item);
        return { ...r, ingredientKey, quantity, quantityUnit };
      }),
    );

  const setRowQuantityUnit = (id: string, quantityUnit: "grams" | "count" | "ml") =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const preset = getCatalogItemByKey(catalog, r.ingredientKey);
        if (quantityUnit === "count" && !preset?.countOption) return r;
        if (quantityUnit === "ml" && !preset?.densityGPerMl) return r;
        return {
          ...r,
          quantityUnit,
          quantity: quantityUnit === "count" ? "1" : "100",
        };
      }),
    );

  const setRowQty = (id: string, quantity: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantity } : r)),
    );

  // ── Sheet lifecycle ────────────────────────────────────────────────────────

  function resetForm() {
    setTitle("");
    setDescription("");
    setRows([
      { id: uid(), ingredientKey: "", quantity: "100", quantityUnit: "grams" },
    ]);
    setMealImageFile(null);
    setError(null);
    setSuccess(false);
  }

  function onMealImageSelected(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPEG, PNG, WebP, or GIF).");
      return;
    }
    if (file.size > MEAL_IMAGE_MAX_BYTES) {
      setError("Meal photo must be 2 MB or smaller.");
      return;
    }
    setError(null);
    setMealImageFile(file);
  }

  function close() {
    closeStoreSheet();
    setTimeout(resetForm, 350);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const validRows = rows.filter((r) => rowIsNutritionValid(catalog, r));

    let image: string | undefined;
    if (mealImageFile) {
      try {
        image = await readFileAsDataURL(mealImageFile);
      } catch {
        setError("Could not read the meal photo. Try another image.");
        setSubmitting(false);
        return;
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      isVegetarian: true,
      ...(image ? { image } : {}),
      ingredients: validRows.map((row) => ({
        catalogItemKey: row.ingredientKey,
        quantity: parseFloat(row.quantity),
        quantityUnit: row.quantityUnit,
      })),
    };

    try {
      await createMeal(payload, displayName ?? "guest");
      setSuccess(true);
      bumpRefresh();
      setTimeout(close, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create meal. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>

      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden
      />

      {/* ── Sheet panel ── */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] flex max-h-[90dvh] flex-col rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-5 py-3">
          <div>
            <h2 className="font-heading text-lg font-bold">New Meal Post</h2>
            <p className="text-xs text-muted-foreground">
              Add ingredients to auto-calculate macros
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* Meal name */}
          <div>
            <label
              htmlFor="meal-title"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Meal name{" "}
              <span className="text-rose-500" aria-hidden>
                *
              </span>
            </label>
            <input
              id="meal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grilled Chicken Bowl"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="meal-desc"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Description{" "}
              <span className="text-muted-foreground/50">(optional)</span>
            </label>
            <input
              id="meal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description…"
              maxLength={100}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-semibold text-foreground">
                Ingredients{" "}
                <span className="text-rose-500" aria-hidden>
                  *
                </span>
              </label>
              <span className="shrink-0 rounded-md bg-muted/80 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
                {rows.length} item{rows.length === 1 ? "" : "s"}
              </span>
            </div>

            <div
              className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm"
              role="list"
              aria-label="Meal ingredients"
            >
              {rows.map((row, idx) => (
                <IngredientRowWidget
                  key={row.id}
                  catalog={catalog}
                  catalogStatus={catalogStatus}
                  row={row}
                  position={idx + 1}
                  total={rows.length}
                  canRemove={rows.length > 1}
                  onIngredientChange={(key) => setRowIngredient(row.id, key)}
                  onQtyChange={(qty) => setRowQty(row.id, qty)}
                  onQuantityUnitChange={(u) =>
                    setRowQuantityUnit(row.id, u)
                  }
                  onRemove={() => removeRow(row.id)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              disabled={catalogStatus === "idle" || catalogStatus === "loading"}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-4" />
              Add ingredient
            </button>
          </div>

          {catalogStatus === "error" ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">
                Could not load ingredient list. Check your connection and try
                closing and reopening this sheet.
              </p>
            </div>
          ) : null}

          {/* Shown once there is at least one valid ingredient: between ingredients and macro summary */}
          {hasValidRows ? (
            <div className="rounded-xl border border-border/80 bg-muted/15 p-3 sm:p-3.5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Meal photo{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </label>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    Add a picture of the finished dish for the feed — you can skip
                    this and post with text only.
                  </p>
                </div>
                <ImagePlus
                  className="mt-0.5 size-5 shrink-0 text-primary/70"
                  aria-hidden
                />
              </div>

              <input
                ref={mealImageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                aria-label="Choose meal photo"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  onMealImageSelected(f);
                  e.target.value = "";
                }}
              />

              {mealImagePreviewUrl ? (
                <div className="space-y-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/60 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob preview */}
                    <img
                      src={mealImagePreviewUrl}
                      alt="Meal preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => mealImageInputRef.current?.click()}
                      className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
                    >
                      Change photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMealImageFile(null)}
                      className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => mealImageInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/25 bg-background py-8 transition hover:border-primary/45 hover:bg-primary/[0.04]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ImagePlus className="size-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Tap to add meal photo
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    JPEG, PNG, WebP or GIF · max 2 MB
                  </span>
                </button>
              )}
            </div>
          ) : null}

          {/* Live macro preview */}
          {hasValidRows ? (
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated totals
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    {
                      label: "Protein",
                      value: `${liveTotal.proteinG}g`,
                      nc: NUTRIENT_COLORS.protein,
                    },
                    {
                      label: "Carbs",
                      value: `${liveTotal.carbsG}g`,
                      nc: NUTRIENT_COLORS.carbs,
                    },
                    {
                      label: "Fat",
                      value: `${liveTotal.fatG}g`,
                      nc: NUTRIENT_COLORS.fat,
                    },
                    {
                      label: "Cal",
                      value: `${liveTotal.caloriesKcal}`,
                      nc: NUTRIENT_COLORS.calories,
                    },
                  ] as const
                ).map(({ label, value, nc }) => (
                  <div
                    key={label}
                    className={`rounded-xl border px-2 py-3 text-center ${nc.bgClass} ${nc.borderClass}`}
                  >
                    <div
                      className={`text-sm font-bold tabular-nums ${nc.textClass}`}
                    >
                      {value}
                    </div>
                    <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Error banner */}
          {error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : null}

          {/* Spacer so last element isn't flush with footer */}
          <div className="h-2" />
        </div>

        {/* Sticky submit footer */}
        <div className="shrink-0 border-t border-border/40 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold transition ${
              success
                ? "bg-green-600 text-white"
                : canSubmit
                  ? "bg-primary text-white hover:opacity-90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {success ? (
              <>
                <Check className="size-4" /> Posted!
              </>
            ) : submitting ? (
              "Posting…"
            ) : (
              "Post Meal"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Catalog combobox (search + list; empty query uses full catalog from parent) ─

type IngredientCatalogComboboxProps = {
  allCatalog: readonly MealCatalogItem[];
  bootstrapStatus: "idle" | "loading" | "ok" | "error";
  valueKey: string;
  onSelectKey: (key: string) => void;
};

function IngredientCatalogCombobox({
  allCatalog,
  bootstrapStatus,
  valueKey,
  onSelectKey,
}: IngredientCatalogComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [remoteList, setRemoteList] = useState<MealCatalogItem[]>([]);
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "loading" | "ok" | "error"
  >("idle");
  const [panelBox, setPanelBox] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const portalPanelRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const showRemote = trimmed.length > 0;

  const selected =
    getCatalogItemByKey(allCatalog, valueKey) ??
    getCatalogItemByKey(remoteList, valueKey);

  function updatePanelPosition() {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 8;
    const maxHeight = Math.max(
      120,
      Math.min(256, window.innerHeight - r.bottom - margin * 2),
    );
    setPanelBox({
      top: r.bottom + 4,
      left: r.left,
      width: r.width,
      maxHeight,
    });
  }

  useLayoutEffect(() => {
    if (!open) {
      setPanelBox(null);
      return;
    }
    updatePanelPosition();
  }, [open, valueKey]);

  useEffect(() => {
    if (!open) return;
    const onReposition = () => updatePanelPosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (portalPanelRef.current?.contains(t)) return;
      setOpen(false);
      setQuery("");
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (!showRemote) {
      setRemoteList([]);
      setSearchStatus("idle");
      return;
    }
    let cancelled = false;
    setSearchStatus("loading");
    const t = setTimeout(() => {
      fetchMealCatalog(trimmed)
        .then((items) => {
          if (!cancelled) {
            setRemoteList(items);
            setSearchStatus("ok");
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRemoteList([]);
            setSearchStatus("error");
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [trimmed]);

  const options: MealCatalogItem[] = showRemote ? remoteList : [...allCatalog];

  const listLoading =
    bootstrapStatus === "loading" ||
    (showRemote && searchStatus === "loading");
  const listError =
    bootstrapStatus === "error" || (showRemote && searchStatus === "error");
  const searchInputBusy = showRemote && searchStatus === "loading";

  const triggerDisabled =
    bootstrapStatus !== "ok" || allCatalog.length === 0;

  const dropdown =
    open && !triggerDisabled && panelBox
      ? createPortal(
          <div
            ref={portalPanelRef}
            className="fixed z-[80] flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg"
            style={{
              top: panelBox.top,
              left: panelBox.left,
              width: panelBox.width,
              maxHeight: panelBox.maxHeight,
            }}
            role="listbox"
          >
            <div className="shrink-0 border-b border-border/70 p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  autoFocus
                  aria-label="Filter ingredients"
                  className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {searchInputBusy ? (
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
              {listError && showRemote ? (
                <p className="px-3 py-2 text-xs text-destructive">
                  Could not search. Try again.
                </p>
              ) : null}
              {showRemote && searchStatus === "loading" ? (
                <p className="flex items-center gap-2 px-3 py-3 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 shrink-0 animate-spin" />
                  Searching…
                </p>
              ) : null}
              {!listLoading &&
              !listError &&
              options.length === 0 &&
              showRemote ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No matches for &ldquo;{trimmed}&rdquo;
                </p>
              ) : null}
              {!listLoading && !showRemote && options.length === 0 ? (
                <p className="px-3 py-2 text-xs text-muted-foreground">
                  No ingredients in catalog.
                </p>
              ) : null}

              {!(showRemote && searchStatus === "loading")
                ? options.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      role="option"
                      aria-selected={p.key === valueKey}
                      onClick={() => {
                        onSelectKey(p.key);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition hover:bg-muted/80 ${
                        p.key === valueKey
                          ? "bg-primary/10 font-medium text-primary"
                          : ""
                      }`}
                    >
                      {p.name}
                    </button>
                  ))
                : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        disabled={triggerDisabled}
        onClick={() => {
          if (triggerDisabled) return;
          setOpen((o) => {
            if (o) setQuery("");
            return !o;
          });
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`min-w-0 flex-1 truncate ${valueKey ? "text-foreground" : "text-muted-foreground"}`}
        >
          {bootstrapStatus === "loading"
            ? "Loading ingredients…"
            : bootstrapStatus === "error"
              ? "Ingredients unavailable"
              : valueKey
                ? (selected?.name ?? valueKey)
                : "Choose ingredient…"}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground opacity-70" />
      </button>

      {dropdown}
    </div>
  );
}

// ── Ingredient row widget ────────────────────────────────────────────────────

type IngredientRowWidgetProps = {
  catalog: readonly MealCatalogItem[];
  catalogStatus: "idle" | "loading" | "ok" | "error";
  row: IngredientRow;
  position: number;
  total: number;
  canRemove: boolean;
  onIngredientChange: (key: string) => void;
  onQtyChange: (qty: string) => void;
  onQuantityUnitChange: (unit: "grams" | "count" | "ml") => void;
  onRemove: () => void;
};

function IngredientRowWidget({
  catalog,
  catalogStatus,
  row,
  position,
  total,
  canRemove,
  onIngredientChange,
  onQtyChange,
  onQuantityUnitChange,
  onRemove,
}: IngredientRowWidgetProps) {
  const preset = getCatalogItemByKey(catalog, row.ingredientKey);
  const countOpt = preset?.countOption;
  const canMl = preset?.densityGPerMl != null && preset.densityGPerMl > 0;
  const countLabel =
    row.quantityUnit === "count" && countOpt
      ? parseFloat(row.quantity) === 1
        ? countOpt.singular
        : countOpt.plural
      : null;

  return (
    <div
      role="listitem"
      aria-label={`Ingredient ${position} of ${total}`}
      className="border-b border-border/60 px-3 py-3 last:border-b-0 sm:px-3.5"
    >
      <div className="flex gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <IngredientCatalogCombobox
            allCatalog={catalog}
            bootstrapStatus={catalogStatus}
            valueKey={row.ingredientKey}
            onSelectKey={onIngredientChange}
          />

          {countOpt || canMl ? (
            <div
              className="inline-flex rounded-lg border border-border/70 bg-muted/20 p-0.5"
              role="group"
              aria-label="Quantity unit"
            >
              <button
                type="button"
                onClick={() => onQuantityUnitChange("grams")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                  row.quantityUnit === "grams"
                    ? "bg-background text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                g
              </button>
              {countOpt ? (
                <button
                  type="button"
                  onClick={() => onQuantityUnitChange("count")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                    row.quantityUnit === "count"
                      ? "bg-background text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {countOpt.plural}
                </button>
              ) : null}
              {canMl ? (
                <button
                  type="button"
                  onClick={() => onQuantityUnitChange("ml")}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                    row.quantityUnit === "ml"
                      ? "bg-background text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ml
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-stretch gap-2">
            <div className="relative flex shrink-0">
              <input
                type="number"
                min={row.quantityUnit === "count" ? 0.25 : 1}
                step={row.quantityUnit === "count" ? 0.25 : 1}
                value={row.quantity}
                onChange={(e) => onQtyChange(e.target.value)}
                aria-label={
                  row.quantityUnit === "count"
                    ? `Number of ${countOpt?.plural ?? "items"}`
                    : row.quantityUnit === "ml"
                      ? "Volume in milliliters"
                      : "Weight in grams"
                }
                className="h-8 w-[4.5rem] rounded-lg border border-input bg-background py-0 pl-2.5 pr-7 text-sm tabular-nums outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 max-w-[3rem] -translate-y-1/2 truncate text-[11px] font-medium text-muted-foreground">
                {row.quantityUnit === "count"
                  ? (countLabel ?? "ct")
                  : row.quantityUnit === "ml"
                    ? "ml"
                    : "g"}
              </span>
            </div>

            <div
              className="inline-flex h-8 flex-1 min-w-[min(100%,11rem)] items-center rounded-lg border border-border/70 bg-muted/25 p-0.5"
              role="group"
              aria-label={
                row.quantityUnit === "count"
                  ? "Quick amounts"
                  : row.quantityUnit === "ml"
                    ? "Quick ml amounts"
                    : "Quick gram amounts"
              }
            >
              {(
                row.quantityUnit === "count"
                  ? QUICK_COUNT
                  : row.quantityUnit === "ml"
                    ? QUICK_ML
                    : QUICK_GRAMS
              ).map(
                (n) => {
                  const active = row.quantity === String(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => onQtyChange(String(n))}
                      className={`min-w-0 flex-1 rounded-md px-1 text-[11px] font-semibold tabular-nums transition ${
                        active
                          ? "bg-background text-primary shadow-sm ring-1 ring-primary/25"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {rowIsNutritionValid(catalog, row) ? (
            <NutritionHint
              item={preset!}
              quantity={parseFloat(row.quantity)}
              quantityUnit={row.quantityUnit}
            />
          ) : null}
        </div>

        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove ingredient"
          >
            <Trash2 className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ── Nutrition hint ───────────────────────────────────────────────────────────

function NutritionHint({
  item,
  quantity,
  quantityUnit,
}: {
  item: MealCatalogItem;
  quantity: number;
  quantityUnit: "grams" | "count" | "ml";
}) {
  let p: number;
  let c: number;
  let fa: number;
  let cal: number;
  if (quantityUnit === "count" && item.countOption) {
    const u = item.countOption.perUnit;
    p = round1(u.proteinG * quantity);
    c = round1(u.carbsG * quantity);
    fa = round1(u.fatG * quantity);
    cal = Math.round(u.caloriesKcal * quantity);
  } else if (quantityUnit === "ml") {
    const d = item.densityGPerMl;
    if (!d) return null;
    const f = (quantity * d) / 100;
    p = round1(item.proteinPer100g * f);
    c = round1(item.carbsPer100g * f);
    fa = round1(item.fatPer100g * f);
    cal = Math.round(item.caloriesPer100g * f);
  } else {
    const f = quantity / 100;
    p = round1(item.proteinPer100g * f);
    c = round1(item.carbsPer100g * f);
    fa = round1(item.fatPer100g * f);
    cal = Math.round(item.caloriesPer100g * f);
  }

  return (
    <p className="text-[10px] leading-snug text-muted-foreground">
      <span className="font-medium text-foreground/65">Line total</span>
      <span className="mx-1.5 text-border" aria-hidden>
        ·
      </span>
      <span className={NUTRIENT_COLORS.protein.textClass}>
        <span className="font-medium">P</span> {p}g
      </span>
      <span className="mx-1 text-muted-foreground/50" aria-hidden>
        ·
      </span>
      <span className={NUTRIENT_COLORS.carbs.textClass}>
        <span className="font-medium">C</span> {c}g
      </span>
      <span className="mx-1 text-muted-foreground/50" aria-hidden>
        ·
      </span>
      <span className={NUTRIENT_COLORS.fat.textClass}>
        <span className="font-medium">F</span> {fa}g
      </span>
      <span className="mx-1 text-muted-foreground/50" aria-hidden>
        ·
      </span>
      <span className={NUTRIENT_COLORS.calories.textClass}>
        <span className="font-medium tabular-nums">{cal}</span> kcal
      </span>
    </p>
  );
}
