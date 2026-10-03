import { useEffect, useState } from "react";
import { Button } from "../../components/Button.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { useToast } from "../../hooks/useToast.ts";
import {
  adminEventEnquiries,
  updateEventEnquiry,
  type EnquiryStatus,
  type EventEnquiryAdmin,
} from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";

const statuses: EnquiryStatus[] = ["new", "contacted", "closed"];

export function EventEnquiriesPage() {
  usePageTitle("Event enquiries");
  const { showToast } = useToast();
  const [items, setItems] = useState<EventEnquiryAdmin[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminEventEnquiries()
      .then((result) => {
        if (!active) {
          return;
        }
        setItems(result.items);
        setNotes(Object.fromEntries(result.items.map((item) => [item.id, item.internal_notes])));
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

  async function change(item: EventEnquiryAdmin, status: EnquiryStatus) {
    try {
      const updated = await updateEventEnquiry(item.id, { status });
      setItems((current) => current.map((row) => (row.id === item.id ? updated : row)));
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The enquiry could not be updated."));
    }
  }

  async function saveNotes(item: EventEnquiryAdmin) {
    try {
      const updated = await updateEventEnquiry(item.id, { internal_notes: notes[item.id] ?? "" });
      setItems((current) => current.map((row) => (row.id === item.id ? updated : row)));
      showToast("Note saved.");
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The note could not be saved."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Event enquiries</h1>
      {loading ? <Loading label="Loading enquiries" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {!loading && !error && items.length === 0 ? <p className="mt-6 text-muted">No event enquiries yet.</p> : null}
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-3xl border border-line bg-white p-4 text-sm">
            <p>
              {item.name} · {item.event_type} · {item.location} · {item.event_date}
            </p>
            <p className="mt-1 text-muted">
              {item.expected_guests} guests · Budget {formatPaise(item.budget)}
            </p>
            <p className="mt-2">{item.requirements}</p>
            <p className="mt-2 text-muted">{item.message}</p>
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
            <label className="mt-3 block">
              <span className="mb-1 block font-medium">Internal notes</span>
              <textarea
                value={notes[item.id] ?? ""}
                onChange={(event) => setNotes((current) => ({ ...current, [item.id]: event.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-line px-3 py-2"
              />
            </label>
            <Button type="button" className="mt-3" onClick={() => void saveNotes(item)}>
              Save note
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
