import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign in | Protein Bar",
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in with your username to continue
        </p>
      </div>
      <LoginForm />
    </>
  );
}
