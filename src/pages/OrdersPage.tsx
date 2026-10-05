import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Loading } from "../components/Loading.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { getOrders, type Order } from "../services/orders.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { formatPaise } from "../utils/money.ts";
import { orderStatusLabel } from "../utils/order.ts";

export function OrdersPage() {
  usePageTitle("Orders");
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }
    let active = true;
    setLoading(true);
    getOrders()
      .then((page) => {
        if (active) {
          setOrders(page.items);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Orders could not be loaded."));
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
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Loading label="Loading orders" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl">Orders</h1>
        <p className="mt-4 text-muted">Sign in to see orders for your account.</p>
        <Link to="/product-refund-return-policy" className="mt-4 inline-block text-sm text-wine">
          Refund / Return Policy
        </Link>
        <Link to="/login" state={{ from: "/orders" }} className="mt-4 inline-block text-wine">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-4xl sm:text-5xl">Orders</h1>
      <Link to="/product-refund-return-policy" className="mt-3 inline-block text-sm text-wine">
        Refund / Return Policy
      </Link>
      {error ? (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      ) : null}
      {orders.length === 0 && !error ? <p className="mt-6 text-muted">You have no orders yet.</p> : null}
      <ul className="mt-8 space-y-4">
        {orders.map((order) => (
          <li key={order.id}>
            <Link to={`/orders/${order.id}`} className="block rounded-3xl bg-sand px-5 py-4">
              <span className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="font-medium">{order.order_number}</span>
                <span>{formatPaise(order.total)}</span>
              </span>
              <span className="mt-1 block text-sm text-muted">
                {orderStatusLabel(order.status)} · {new Date(order.created_at).toLocaleDateString("en-IN")} · {order.customer_email}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
