import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { UpiQr } from "../components/UpiQr.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Input } from "../components/Input.tsx";
import { Loading } from "../components/Loading.tsx";
import { OrderSummary } from "../components/OrderSummary.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useCart } from "../hooks/useCart.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { useToast } from "../hooks/useToast.ts";
import { createOrder, getOrderQuote, type OrderQuote } from "../services/orders.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { formatPaise } from "../utils/money.ts";
import { storeUpiId } from "../utils/order.ts";

const emptyAddress = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "IN",
};

export function CheckoutPage() {
  usePageTitle("Checkout");
  const { user, loading: authLoading } = useAuth();
  const { count, loading: cartLoading, refresh } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [billing, setBilling] = useState(emptyAddress);
  const [sameAddress, setSameAddress] = useState(true);
  const [shipping, setShipping] = useState(emptyAddress);
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi">("cod");
  const name = fullName ?? user?.full_name ?? "";
  const emailValue = email ?? user?.email ?? "";

  useEffect(() => {
    if (!user) {
      return;
    }
    let active = true;
    setQuoteLoading(true);
    getOrderQuote()
      .then((next) => {
        if (active) {
          setQuote(next);
          setQuoteError("");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setQuote(null);
          setQuoteError(apiErrorMessage(error, "The order summary could not be loaded."));
        }
      })
      .finally(() => {
        if (active) {
          setQuoteLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user, count]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    const destination = sameAddress ? billing : shipping;
    if (!name || !emailValue || !phone || !billing.address || !billing.city || !billing.state || !billing.postalCode || !billing.country) {
      showToast("Complete the billing details.");
      return;
    }
    if (!destination.address || !destination.city || !destination.state || !destination.postalCode || !destination.country) {
      showToast("Complete the shipping address.");
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        customer: { name, email: emailValue, phone },
        billing: {
          address: billing.address,
          city: billing.city,
          state: billing.state,
          postal_code: billing.postalCode,
          country: billing.country,
        },
        shipping_same_as_billing: sameAddress,
        shipping: sameAddress
          ? undefined
          : {
              address: shipping.address,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.postalCode,
              country: shipping.country,
            },
        payment_method: paymentMethod,
      });
      await refresh();
      navigate(`/orders/${order.id}`);
    } catch (error: unknown) {
      showToast(apiErrorMessage(error, "The order could not be placed."));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || (user && (cartLoading || quoteLoading))) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Loading label="Loading checkout" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Checkout</h1>
        <p className="mt-4 text-muted">Sign in to place an order with your account.</p>
        <Link to="/login" state={{ from: "/checkout" }} className="mt-4 inline-block text-wine">
          Sign in
        </Link>
      </section>
    );
  }

  if (quoteError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Checkout</h1>
        <div className="mt-6">
          <ErrorMessage message={quoteError} />
        </div>
      </section>
    );
  }

  if (!quote || quote.items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Checkout</h1>
        <p className="mt-4 text-muted">Add something from the shop before checkout.</p>
        <Link to="/shop" className="mt-4 inline-block text-wine">
          Go to the shop
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h1 className="text-4xl sm:text-5xl">Checkout</h1>
        <p className="mt-3 text-sm text-muted">The total is calculated when the order is placed.</p>
        <form onSubmit={(event) => void submit(event)} className="mt-8 space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-lg">Customer</legend>
            <Input label="Name" value={name} onChange={(event) => setFullName(event.target.value)} required />
            <Input label="Email" type="email" value={emailValue} onChange={(event) => setEmail(event.target.value)} required />
            <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </fieldset>
          <AddressFields legend="Billing address" value={billing} onChange={setBilling} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={(event) => setSameAddress(event.target.checked)}
            />
            Shipping address is the same as billing
          </label>
          {sameAddress ? null : <AddressFields legend="Shipping address" value={shipping} onChange={setShipping} />}
          <fieldset className="space-y-3">
            <legend className="text-lg">Payment</legend>
            <label className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <input
                type="radio"
                name="payment"
                className="mt-1"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>
                <span className="block text-sm font-medium">Cash on delivery</span>
                <span className="mt-1 block text-sm text-muted">Pay in cash when the order is delivered.</span>
              </span>
            </label>
            <div className="rounded-2xl border border-line bg-white p-4">
              <label className="flex items-start gap-3">
                <input
                  type="radio"
                  name="payment"
                  className="mt-1"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                <span>
                  <span className="block text-sm font-medium">UPI</span>
                  <span className="mt-1 block text-sm text-muted">
                    Pay to <span className="font-medium text-ink">{storeUpiId}</span>. The order stays pending until the payment is confirmed.
                  </span>
                </span>
              </label>
              <div className="mt-4 pl-7">
                <UpiQr amountPaise={quote.total} />
                <p className="mt-2 text-sm text-muted">Scan to pay {formatPaise(quote.total)}</p>
              </div>
            </div>
          </fieldset>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Placing order" : "Place order"}
          </Button>
        </form>
      </div>
      <aside className="h-fit rounded-3xl bg-sand p-6">
        <h2 className="text-2xl">Order summary</h2>
        <div className="mt-4">
          <OrderSummary quote={quote} />
        </div>
      </aside>
    </section>
  );
}

function AddressFields({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: typeof emptyAddress;
  onChange: (next: typeof emptyAddress) => void;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg">{legend}</legend>
      <Input
        label="Address"
        value={value.address}
        onChange={(event) => onChange({ ...value, address: event.target.value })}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="City" value={value.city} onChange={(event) => onChange({ ...value, city: event.target.value })} required />
        <Input
          label="State"
          value={value.state}
          onChange={(event) => onChange({ ...value, state: event.target.value })}
          required
        />
        <Input
          label="Postal code"
          value={value.postalCode}
          onChange={(event) => onChange({ ...value, postalCode: event.target.value })}
          required
        />
        <Input
          label="Country"
          value={value.country}
          maxLength={2}
          onChange={(event) => onChange({ ...value, country: event.target.value.toUpperCase() })}
          required
        />
      </div>
    </fieldset>
  );
}
