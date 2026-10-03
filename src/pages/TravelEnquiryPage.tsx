import { type FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { Input } from "../components/Input.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { useToast } from "../hooks/useToast.ts";
import { getTravelPackage, submitTravelEnquiry } from "../services/travel.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { rupeesToPaise } from "../utils/money.ts";
import { isUuid } from "../utils/product.ts";

export function TravelEnquiryPage() {
  usePageTitle("Travel enquiry");
  const { user } = useAuth();
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const packageId = params.get("package");
  const validPackage = packageId !== null && isUuid(packageId);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const nameValue = name ?? user?.full_name ?? "";
  const emailValue = email ?? user?.email ?? "";

  useEffect(() => {
    if (!validPackage || !packageId) {
      return;
    }
    let active = true;
    getTravelPackage(packageId)
      .then((travelPackage) => {
        if (active) {
          setDestination((current) => current || `${travelPackage.destination}, ${travelPackage.country}`);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [packageId, validPackage]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const travelerCount = Number(travelers);
    const budgetPaise = rupeesToPaise(budget);
    if (!nameValue || !emailValue || !phone || !destination || !travelDate || !message.trim()) {
      showToast("Complete the enquiry.");
      return;
    }
    if (!Number.isInteger(travelerCount) || travelerCount < 1) {
      showToast("Enter the number of travelers.");
      return;
    }
    if (budgetPaise === undefined) {
      showToast("Enter a budget in rupees.");
      return;
    }
    setSubmitting(true);
    try {
      await submitTravelEnquiry({
        package_id: validPackage && packageId ? packageId : undefined,
        name: nameValue,
        email: emailValue,
        phone,
        destination,
        travel_date: travelDate,
        travelers: travelerCount,
        budget: budgetPaise,
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
        <Link to="/travel" className="mt-6 inline-block text-wine">
          Back to travel
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link to={validPackage && packageId ? `/travel/${packageId}` : "/travel"} className="text-sm text-muted">
        Travel
      </Link>
      <h1 className="mt-4 text-4xl sm:text-5xl">Travel enquiry</h1>
      <p className="mt-3 leading-7 text-muted">
        Share the destination, dates, and budget. The reply is a quote, not a booking.
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-4">
        <Input label="Name" value={nameValue} onChange={(event) => setName(event.target.value)} required />
        <Input label="Email" type="email" value={emailValue} onChange={(event) => setEmail(event.target.value)} required />
        <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        <Input label="Destination" value={destination} onChange={(event) => setDestination(event.target.value)} required />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Travel date" type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} required />
          <Input
            label="Number of travelers"
            type="number"
            min={1}
            value={travelers}
            onChange={(event) => setTravelers(event.target.value)}
            required
          />
          <Input label="Budget (₹)" inputMode="decimal" value={budget} onChange={(event) => setBudget(event.target.value)} required />
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
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
