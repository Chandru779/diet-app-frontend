import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account | Protein Bar",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="font-heading text-2xl font-bold leading-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Just a username to get started — add the rest later.
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
