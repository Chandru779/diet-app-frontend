/** Matches backend `AuthUser` */
export type AuthUser = {
  id: string;
  extId?: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type AuthSessionPayload = {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
  user: AuthUser;
};

export type EmailStartResponse = {
  flowId: string;
  mode: "sign_in" | "sign_up";
};

export type AuthVerifyResponse = {
  status: "complete" | "needs_username";
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: AuthUser;
};

export type GoogleOAuthStartResponse = {
  flowId: string;
  redirectUrl: string;
};
