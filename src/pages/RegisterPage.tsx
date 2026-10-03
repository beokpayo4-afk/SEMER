import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { apiErrorMessage } from "../utils/errors.ts";

export function RegisterPage() {
  usePageTitle("Create account");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await register(fullName, email, password);
      navigate("/");
    } catch (caught) {
      setError(apiErrorMessage(caught, "Registration failed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <h1 className="text-4xl">Create an account</h1>
      <p className="mt-2 text-sm text-muted">
        Already registered? <Link to="/login" className="text-wine">Sign in</Link>
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />
        <p className="text-xs text-muted">Use at least 8 characters, including a letter and a number.</p>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account" : "Create account"}
        </Button>
      </form>
    </section>
  );
}
