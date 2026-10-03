import { type FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { apiErrorMessage } from "../utils/errors.ts";

export function LoginPage() {
  usePageTitle("Sign in");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from);
    } catch (caught) {
      setError(apiErrorMessage(caught, "Sign in failed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:py-16">
      <h1 className="text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        New here? <Link to="/register" className="text-wine">Create an account</Link>
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </section>
  );
}
