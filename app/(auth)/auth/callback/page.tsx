import { OAuthCallbackHandler } from "@/components/auth/oauth-callback-handler";

export const metadata = {
  title: "Signing in | Protein Bar",
};

export default function AuthCallbackPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">
          One moment
        </h1>
      </div>
      <OAuthCallbackHandler />
    </>
  );
}
