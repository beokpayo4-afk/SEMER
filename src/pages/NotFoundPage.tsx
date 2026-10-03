import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.ts";

export function NotFoundPage() {
  usePageTitle("Not found");
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-5xl">Page not found</h1>
      <Link to="/" className="mt-6 inline-block text-wine">
        Return home
      </Link>
    </section>
  );
}
