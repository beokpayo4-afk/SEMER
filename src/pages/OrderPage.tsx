import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { UpiQr } from "../components/UpiQr.tsx";
import { Loading } from "../components/Loading.tsx";
import { OrderSummary } from "../components/OrderSummary.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { getOrder, type Order, type OrderAddress } from "../services/orders.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { formatPaise } from "../utils/money.ts";
import { orderStatusLabel, paymentMethodLabel, paymentStatusLabel, storeUpiId } from "../utils/order.ts";
import { isUuid } from "../utils/product.ts";

export function OrderPage() {
  const { id = "" } = useParams();
  const validId = isUuid(id);
  usePageTitle("Order");
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !validId) {
      return;
    }
    let active = true;
    setLoading(true);
    getOrder(id)
      .then((next) => {
        if (active) {
          setOrder(next);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setOrder(null);
          setError(apiErrorMessage(reason, "Order not found."));
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
  }, [id, user, validId]);

  if (!validId) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorMessage message="Order not found." />
      </section>
    );
  }

  if (authLoading || (user && loading)) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Loading label="Loading order" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Order</h1>
        <p className="mt-4 text-muted">Sign in to see this order.</p>
        <Link to="/login" state={{ from: `/orders/${id}` }} className="mt-4 inline-block text-wine">
          Sign in
        </Link>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorMessage message={error || "Order not found."} />
        <Link to="/orders" className="mt-4 inline-block text-wine">
          Back to orders
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-sm text-muted">{order.order_number}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Order</h1>
        <Link to="/product-refund-return-policy" className="mt-3 inline-block text-sm text-wine">
          Refund / Return Policy
        </Link>
        <p className="mt-3 text-sm text-muted">
          {orderStatusLabel(order.status)} · Payment {paymentStatusLabel(order.payment_status)} ·{" "}
          {paymentMethodLabel(order.payment_method)}
        </p>
        {order.payment_method === "upi" ? (
          <div className="mt-6">
            <UpiQr amountPaise={order.total} />
            <p className="mt-3 text-sm">
              Scan to pay {formatPaise(order.total)} to <span className="font-medium">{storeUpiId}</span>
            </p>
          </div>
        ) : null}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <AddressBlock title="Customer" lines={[order.customer_name, order.customer_email, order.customer_phone]} />
          <AddressBlock title="Billing address" lines={addressLines(order.billing_address)} />
          <AddressBlock title="Shipping address" lines={addressLines(order.shipping_address)} />
        </div>
      </div>
      <aside className="h-fit rounded-3xl bg-sand p-6">
        <h2 className="text-2xl">Summary</h2>
        <div className="mt-4">
          <OrderSummary quote={order} />
        </div>
      </aside>
    </section>
  );
}

function addressLines(address: OrderAddress) {
  return [address.address, `${address.city}, ${address.state} ${address.postal_code}`, address.country];
}

function AddressBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <h2 className="text-lg">{title}</h2>
      {lines.map((line) => (
        <p key={line} className="mt-1 text-sm text-muted">
          {line}
        </p>
      ))}
    </div>
  );
}
