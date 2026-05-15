/** Cookie name for JWT returned by POST /auth/signin and /auth/signup */
export const AUTH_ACCESS_TOKEN_COOKIE = "pb_access_token";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function secureSuffix(): string {
  if (typeof window === "undefined") return "";
  return window.location.protocol === "https:" ? "; Secure" : "";
}

export function setAuthAccessTokenCookie(token: string): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(token);
  document.cookie = `${AUTH_ACCESS_TOKEN_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secureSuffix()}`;
}

export function clearAuthAccessTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secureSuffix()}`;
}

export function getAuthAccessTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${AUTH_ACCESS_TOKEN_COOKIE}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}
