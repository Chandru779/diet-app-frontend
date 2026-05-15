/** Matches backend `AuthUser` + optional Clerk id from JWT payload */
export type AuthUser = {
  id: string;
  extId?: string;
  username: string;
  email: string;
};

export type AuthSessionPayload = {
  token: string;
  user: AuthUser;
};
