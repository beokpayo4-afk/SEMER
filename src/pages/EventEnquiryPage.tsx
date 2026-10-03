import { type FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { Select } from "../components/Select.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { useToast } from "../hooks/useToast.ts";
import {
  eventCategories,
  getEventService,
  submitEventEnquiry,
  type EventCategory,
} from "../services/events.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { rupeesToPaise } from "../utils/money.ts";
import { isUuid } from "../utils/product.ts";

function isCategory(value: string): value is EventCategory {
  return eventCategories.some((item) => item.value === value);
}

export function EventEnquiryPage() {
  usePageTitle("Event enquiry");
  const { user } = useAuth();
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const serviceId = params.get("service");
  const validService = serviceId !== null && isUuid(serviceId);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState<EventCategory | null>(null);
  const [serviceCategory, setServiceCategory] = useState<EventCategory | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("50");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const nameValue = name ?? user?.full_name ?? "";
  const emailValue = email ?? user?.email ?? "";
  const eventTypeValue = eventType ?? serviceCategory ?? "wedding";

  useEffect(() => {
    if (!validService || !serviceId) {
      return;
    }
    let active = true;
    getEventService(serviceId)
      .then((service) => {
        if (active) {
          setServiceCategory(service.category);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [serviceId, validService]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const guestCount = Number(guests);
    const budgetPaise = rupeesToPaise(budget);
    if (!nameValue || !emailValue || !phone || !eventDate || !location || !requirements.trim() || !message.trim()) {
      showToast("Complete the enquiry.");
      return;
    }
    if (!isCategory(eventTypeValue)) {
      showToast("Choose an event type.");
      return;
    }
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      showToast("Enter the number of guests.");
      return;
    }
    if (budgetPaise === undefined) {
      showToast("Enter a budget in rupees.");
      return;
    }
    setSubmitting(true);
    try {
      await submitEventEnquiry({
        service_id: validService && serviceId ? serviceId : undefined,
        name: nameValue,
        email: emailValue,
        phone,
        event_type: eventTypeValue,
        event_date: eventDate,
        location,
        expected_guests: guestCount,
        budget: budgetPaise,
        requirements: requirements.trim(),
        message: message.trim(),
      });
      setSent(true);
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The enquiry could not be sent."));
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Enquiry sent</h1>
        <p className="mt-4 leading-7 text-muted">
          The team will reply with a quote. Nothing is booked until you accept that quote.
        </p>
        <Link to="/events" className="mt-6 inline-block text-wine">
          Back to events
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link to={validService && serviceId ? `/events/${serviceId}` : "/events"} className="text-sm text-muted">
        Events
      </Link>
      <h1 className="mt-4 text-4xl sm:text-5xl">Event enquiry</h1>
      <p className="mt-3 leading-7 text-muted">
        Share the date, location, and what the event needs. The reply is a quote, not a booking.
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-4">
        <Input label="Name" value={nameValue} onChange={(event) => setName(event.target.value)} required />
        <Input label="Email" type="email" value={emailValue} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <Select
          label="Event type"
          value={eventTypeValue}
          options={eventCategories.map((item) => ({ value: item.value, label: item.label }))}
          onChange={(event) => {
            if (isCategory(event.target.value)) {
              setEventType(event.target.value);
            }
          }}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Event date" type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} required />
          <Input label="Location" value={location} onChange={(event) => setLocation(event.target.value)} required />
          <Input
            label="Expected guests"
            type="number"
            min={1}
            value={guests}
            onChange={(event) => setGuests(event.target.value)}
            required
          />
          <Input label="Budget (₹)" inputMode="decimal" value={budget} onChange={(event) => setBudget(event.target.value)} required />
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Requirements</span>
          <textarea
            value={requirements}
            onChange={(event) => setRequirements(event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-ink"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-ink"
            required
          />
        </label>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Sending" : "Send enquiry"}
        </Button>
      </form>
    </section>
  );
}
