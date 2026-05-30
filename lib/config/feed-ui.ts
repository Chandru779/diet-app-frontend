import type { LucideIcon } from "lucide-react";
import {
  Droplets,
  Flame,
  Gauge,
  LayoutGrid,
  Leaf,
  MilkOff,
  BicepsFlexed,
  Zap,
  Wheat,
} from "lucide-react";

export type PrimaryCategoryId =
  | "popular"
  | "high-protein"
  | "under-500-kcal"
  | "veg-meals"
  | "quick-meals"
  | "more";

export type PrimaryCategory = {
  id: PrimaryCategoryId;
  label: string;
  slug?: string;
  icon: LucideIcon;
  opensFilters?: boolean;
};

export const FEED_PRIMARY_CATEGORIES: PrimaryCategory[] = [
  { id: "popular", label: "Popular", slug: "popular", icon: Flame },
  { id: "high-protein", label: "High Protein", slug: "high-protein", icon: BicepsFlexed },
  {
    id: "under-500-kcal",
    label: "Under 500 kcal",
    slug: "under-500-kcal",
    icon: Gauge,
  },
  { id: "veg-meals", label: "Veg Meals", slug: "veg-meals", icon: Leaf },
  { id: "quick-meals", label: "Quick Meals", slug: "quick-meals", icon: Zap },
  { id: "more", label: "More", opensFilters: true, icon: LayoutGrid },
];

export const FEED_CATEGORY_GROUP_LABELS: Record<string, string> = {
  goal: "Top Goals",
  dietary: "Dietary Preferences",
  lifestyle: "Lifestyle",
  health_focus: "Health Focus",
  quick_filter: "Quick Filters",
  macro_chip: "Macro Filters",
};

export type MacroChipId =
  | "protein-30g-plus"
  | "low-carb"
  | "keto"
  | "gluten-free"
  | "dairy-free";

export type MacroChip = {
  id: MacroChipId;
  label: string;
  slug: string;
  icon: LucideIcon;
  borderClass: string;
  textClass: string;
  bgActiveClass: string;
};

export const FEED_MACRO_CHIPS: MacroChip[] = [
  {
    id: "protein-30g-plus",
    label: "30g+ Protein",
    slug: "protein-30g-plus",
    icon: BicepsFlexed,
    borderClass: "border-gray-100",
    textClass: "text-emerald-800",
    bgActiveClass: "bg-emerald-50",
  },
  {
    id: "low-carb",
    label: "Low Carb",
    slug: "low-carb",
    icon: Leaf,
    borderClass: "border-gray-100",
    textClass: "text-sky-800",
    bgActiveClass: "bg-sky-50",
  },
  {
    id: "keto",
    label: "Keto",
    slug: "keto",
    icon: Droplets,
    borderClass: "border-gray-100",
    textClass: "text-amber-900",
    bgActiveClass: "bg-amber-50",
  },
  {
    id: "gluten-free",
    label: "Gluten-Free",
    slug: "gluten-free",
    icon: Wheat,
    borderClass: "border-gray-100",
    textClass: "text-orange-800",
    bgActiveClass: "bg-orange-50",
  },
  {
    id: "dairy-free",
    label: "Dairy-Free",
    slug: "dairy-free",
    icon: MilkOff,
    borderClass: "border-gray-100",
    textClass: "text-violet-800",
    bgActiveClass: "bg-violet-50",
  },
];

export const EXPLORE_TILE_STYLES: Record<
  string,
  { bg: string; accent: string }
> = {
  "quick-meals": { bg: "bg-sky-100", accent: "text-sky-700" },
  "muscle-gain": { bg: "bg-emerald-100", accent: "text-emerald-700" },
  "fat-loss": { bg: "bg-rose-100", accent: "text-rose-700" },
  "budget-meals": { bg: "bg-amber-100", accent: "text-amber-800" },
};
