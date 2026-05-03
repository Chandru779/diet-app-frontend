import axios, { AxiosError } from "axios";
import { getApiBaseUrl } from "./base-url";

type ApiEnvelope<T = unknown> = {
  statusCode?: number;
  message?: string;
  data?: T;
};

export const http = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (response) => {
    const payload = response.data as unknown;
    // Unwrap the backend's `{ statusCode, message, data }` envelope if present.
    if (payload && typeof payload === "object" && "data" in payload) {
      const env = payload as ApiEnvelope<unknown>;
      if (env.data !== undefined) {
        response.data = env.data;
      }
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;

    const serverMessage =
      (error.response?.data as any)?.message ??
      (error.response?.data as any)?.error;

    const message =
      serverMessage ??
      error.message ??
      `Request failed${status ? ` (${status})` : ""}${url ? `: ${url}` : ""}`;

    return Promise.reject(new Error(message));
  },
);

