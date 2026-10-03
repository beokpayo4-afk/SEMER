import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { useToast } from "../../hooks/useToast.ts";
import { adminTravelEnquiries, updateTravelEnquiry, type EnquiryStatus, type TravelEnquiryAdmin } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";

const statuses: EnquiryStatus[] = ["new", "contacted", "closed"];

export function TravelEnquiriesPage() {
  usePageTitle("Travel enquiries");
  const { showToast } = useToast();
  const [items, setItems] = useState<TravelEnquiryAdmin[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminTravelEnquiries()
      .then((result) => {
        if (active) {
          setItems(result.items);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Enquiries could not be loaded."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function change(item: TravelEnquiryAdmin, status: EnquiryStatus) {
    try {
      const updated = await updateTravelEnquiry(item.id, status);
      setItems((current) => current.map((row) => (row.id === item.id ? updated : row)));
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The enquiry could not be updated."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Travel enquiries</h1>
      {loading ? <Loading label="Loading enquiries" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {!loading && !error && items.length === 0 ? <p className="mt-6 text-muted">No travel enquiries yet.</p> : null}
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-3xl border border-line bg-white p-4 text-sm">
            <p>
              {item.name} · {item.destination} · {item.travel_date}
            </p>
            <p className="mt-1 text-muted">
              {item.travelers} travelers · Budget {formatPaise(item.budget)} · {item.email}
            </p>
            <p className="mt-2">{item.message}</p>
            <select
              className="mt-3 rounded-lg border border-line px-2 py-1"
              value={item.status}
              aria-label={`Status for ${item.name}`}
              onChange={(event) => void change(item, event.target.value as EnquiryStatus)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}
