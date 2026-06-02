import { http } from "./http";
import type {
  AuthSessionPayload,
  AuthUser,
  AuthVerifyResponse,
  EmailStartResponse,
  GoogleOAuthStartResponse,
} from "@/lib/types/auth";

export async function startEmailAuth(
  email: string,
  captchaToken?: string,
): Promise<EmailStartResponse> {
  const res = await http.post<EmailStartResponse>("/auth/email/start", {
    email,
    captchaToken,
  });
  return res.data;
}

export async function verifyEmailAuth(
  flowId: string,
  code: string,
): Promise<AuthVerifyResponse> {
  const res = await http.post<AuthVerifyResponse>("/auth/email/verify", {
    flowId,
    code,
  });
  return res.data;
}

export async function resendEmailAuth(flowId: string): Promise<void> {
  await http.post("/auth/email/resend", { flowId });
}

export async function startGoogleAuth(): Promise<GoogleOAuthStartResponse> {
  const res = await http.get<GoogleOAuthStartResponse>("/auth/oauth/google");
  return res.data;
}

export async function completeGoogleAuth(
  flowId: string,
  clerkSessionId?: string,
): Promise<AuthVerifyResponse> {
  const res = await http.post<AuthVerifyResponse>("/auth/oauth/complete", {
    flowId,
    clerkSessionId,
  });
  return res.data;
}

export async function setUsername(username: string): Promise<AuthSessionPayload> {
  const res = await http.post<AuthSessionPayload>("/auth/username", {
    username,
  });
  return res.data;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await http.get<AuthUser>("/auth/me", {
    headers: { "Cache-Control": "no-store" },
  });
  return res.data;
}
