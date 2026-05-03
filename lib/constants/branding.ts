/**
 * Brand tokens — single source of truth for naming.
 * Visual values are implemented in `app/globals.css` as CSS variables
 * (oklch) and consumed via Tailwind `primary`, `background`, etc.
 * Hex values below are approximations for design handoff / docs.
 */
export const BRAND = {
  name: "Dietician",
  tagline: "Eat with clarity. Train with confidence.",
} as const;

/** Approximate hex matches for the current theme (see globals.css). */
export const brandColors = {
  /** Primary actions, nav active, key accents */
  primary: "#0f766e",
  /** Text on primary buttons */
  primaryForeground: "#f8faf9",
  /** Page canvas — soft mint-tinted white */
  background: "#f7faf8",
  /** Body text */
  foreground: "#15211e",
  /** Cards & sheets */
  card: "#ffffff",
  /** Secondary surfaces & chips */
  muted: "#e8f2ef",
  /** Secondary text */
  mutedForeground: "#5c6f6a",
  /** Borders */
  border: "#d5e0dc",
  /** Focus rings */
  ring: "#0f766e",
  /** Success / verified (badges) */
  success: "#15803d",
  /** Warm accent (optional highlights) */
  accentWarm: "#ea580c",
} as const;

export type BrandColorKey = keyof typeof brandColors;
