import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account | Protein Bar",
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold">Create account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Choose a username to get started
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
