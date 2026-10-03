import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Pagination } from "../../components/Pagination.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { getCustomers, type CustomerPage } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

export function CustomersPage() {
  usePageTitle("Admin customers");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CustomerPage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getCustomers(page)
      .then((next) => {
        if (active) {
          setResult(next);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Customers could not be loaded."));
        }
      });
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Customers</h1>
      {error ? <ErrorMessage message={error} /> : null}
      {!result && !error ? <Loading label="Loading customers" /> : null}
      {result && result.items.length === 0 ? <p className="mt-6 text-muted">No customers yet.</p> : null}
      <ul className="mt-4 divide-y divide-line rounded-3xl border border-line bg-white">
        {result?.items.map((customer) => (
          <li key={customer.id} className="px-4 py-3 text-sm">
            <p>{customer.full_name}</p>
            <p className="text-muted">
              {customer.email} · {customer.is_active ? "Active" : "Inactive"}
            </p>
          </li>
        ))}
      </ul>
      {result ? <Pagination page={page} pageSize={20} total={result.total} onPage={setPage} /> : null}
    </section>
  );
}
