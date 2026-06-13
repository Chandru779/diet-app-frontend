import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  clearAuthTokens,
  getAuthAccessTokenFromCookie,
  getAuthRefreshTokenFromCookie,
  setAuthAccessTokenCookie,
  setAuthRefreshTokenCookie,
} from "@/lib/auth/auth-cookie";
import { useAuthStore } from "@/lib/store/auth-store";
import type { AuthSessionPayload } from "@/lib/types/auth";
import { getApiBaseUrl } from "./base-url";

type ApiEnvelope<T = unknown> = {
  statusCode?: number;
  message?: string;
  data?: T;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const http = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

// Bare client used only for POST /auth/refresh so the refresh call itself can
// never trigger the 401 interceptor and recurse.
const refreshClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getAuthAccessTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-flight refresh shared across concurrent 401s so we only hit /auth/refresh
// once even when several requests fail at the same time.
let refreshPromise: Promise<string | null> | null = null;

function unwrap<T>(payload: unknown): T | undefined {
  if (payload && typeof payload === "object" && "data" in payload) {
    const env = payload as ApiEnvelope<T>;
    if (env.data !== undefined) return env.data;
  }
  return payload as T | undefined;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getAuthRefreshTokenFromCookie();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh", { refreshToken })
      .then((res) => {
        const session = unwrap<AuthSessionPayload>(res.data);
        if (!session?.token) throw new Error("Malformed refresh response");

        setAuthAccessTokenCookie(session.token);
        if (session.refreshToken) {
          setAuthRefreshTokenCookie(session.refreshToken);
        }
        useAuthStore.setState((state) => ({
          isLoggedIn: true,
          user: session.user ?? state.user,
          token: session.token,
          refreshToken: session.refreshToken ?? state.refreshToken,
        }));
        return session.token;
      })
      .catch(() => {
        // Refresh token is invalid/expired — drop the session entirely.
        clearAuthTokens();
        useAuthStore.getState().logout();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

http.interceptors.response.use(
  (response) => {
    const data = unwrap(response.data);
    if (data !== undefined) {
      response.data = data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetriableConfig | undefined;

    // On an expired/invalid access token, try one silent refresh then replay
    // the original request transparently.
    if (
      status === 401 &&
      original &&
      !original._retry &&
      getAuthRefreshTokenFromCookie()
    ) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return http(original as AxiosRequestConfig);
      }
    }

    const url = error.config?.url;
    const serverMessage =
      (error.response?.data as { message?: string; error?: string })?.message ??
      (error.response?.data as { message?: string; error?: string })?.error;

    const message =
      serverMessage ??
      error.message ??
      `Request failed${status ? ` (${status})` : ""}${url ? `: ${url}` : ""}`;

    return Promise.reject(new Error(message));
  },
);
