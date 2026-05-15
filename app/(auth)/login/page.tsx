import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in | Protein Bar",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to pick up where you left off.
        </p>
      </div>
      <LoginForm />
    </>
  );
}
