import { AuthFlow } from "@/components/auth/auth-flow";

export const metadata = {
  title: "Sign in | Protein Bar",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">
          Welcome
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in or create an account with your email or Google.
        </p>
      </div>
      <AuthFlow />
    </>
  );
}
