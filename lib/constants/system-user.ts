/**
 * Mirror of the backend reserved "system" user (see
 * `backend/src/constants/system-user.ts`). Used to render a friendly
 * label for meals authored by the system user — these are curated /
 * script-seeded meals that exist so the feed has content before real
 * users sign up.
 *
 * Keep `username` in sync with the backend constant. If you change one,
 * change both.
 */
export const SYSTEM_USER = {
  username: "system",
  displayName: "System",
} as const;

export function isSystemUser(username: string | null | undefined): boolean {
  return username === SYSTEM_USER.username;
}
