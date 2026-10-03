import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Pagination } from "../../components/Pagination.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { getAdminPayments, type AdminPaymentPage } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";

export function PaymentsPage() {
  usePageTitle("Admin payments");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminPaymentPage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminPayments(page)
      .then((next) => {
        if (active) {
          setResult(next);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Payments could not be loaded."));
        }
      });
    return () => {
      active = false;
    };
  }, [page]);

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Payments</h1>
      <p className="mt-2 text-sm text-muted">Amounts come from the order. Card numbers and payment secrets are not stored here.</p>
      {error ? <ErrorMessage message={error} /> : null}
      {!result && !error ? <Loading label="Loading payments" /> : null}
      {result && result.items.length === 0 ? <p className="mt-6 text-muted">No payments yet.</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Method</th>
              <th className="py-2 font-medium">Provider</th>
            </tr>
          </thead>
          <tbody>
            {result?.items.map((payment) => (
              <tr key={payment.id} className="border-t border-line">
                <td className="py-3">{formatPaise(payment.amount)}</td>
                <td>{payment.status}</td>
                <td>{payment.payment_method}</td>
                <td>{payment.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {result ? <Pagination page={page} pageSize={20} total={result.total} onPage={setPage} /> : null}
    </section>
  );
}
