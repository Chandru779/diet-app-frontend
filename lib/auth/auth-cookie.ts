/** Cookie name for the short-lived access token (Bearer credential). */
export const AUTH_ACCESS_TOKEN_COOKIE = "pb_access_token";
/** Cookie name for the long-lived refresh token. */
export const AUTH_REFRESH_TOKEN_COOKIE = "pb_refresh_token";

// Cookies only gate browser persistence; the server still enforces the JWT
// `exp`. We keep both cookies alive for the refresh-token window so a returning
// user can silently refresh instead of being forced back to the login screen.
const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function secureSuffix(): string {
  if (typeof window === "undefined") return "";
  return window.location.protocol === "https:" ? "; Secure" : "";
}

function writeCookie(name: string, token: string, maxAgeSec: number): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(token);
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${secureSuffix()}`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secureSuffix()}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}

export function setAuthAccessTokenCookie(token: string): void {
  writeCookie(AUTH_ACCESS_TOKEN_COOKIE, token, REFRESH_MAX_AGE_SEC);
}

export function clearAuthAccessTokenCookie(): void {
  deleteCookie(AUTH_ACCESS_TOKEN_COOKIE);
}

export function getAuthAccessTokenFromCookie(): string | null {
  return readCookie(AUTH_ACCESS_TOKEN_COOKIE);
}

export function setAuthRefreshTokenCookie(token: string): void {
  writeCookie(AUTH_REFRESH_TOKEN_COOKIE, token, REFRESH_MAX_AGE_SEC);
}

export function clearAuthRefreshTokenCookie(): void {
  deleteCookie(AUTH_REFRESH_TOKEN_COOKIE);
}

export function getAuthRefreshTokenFromCookie(): string | null {
  return readCookie(AUTH_REFRESH_TOKEN_COOKIE);
}

/** Clears both the access and refresh cookies (full local sign-out). */
export function clearAuthTokens(): void {
  clearAuthAccessTokenCookie();
  clearAuthRefreshTokenCookie();
}
