import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Pagination } from "../../components/Pagination.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { useToast } from "../../hooks/useToast.ts";
import { adminOrders, updateOrderStatus } from "../../services/admin.ts";
import type { Order, OrderStatus } from "../../services/orders.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";
import { orderStatusLabel } from "../../utils/order.ts";

const statuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrdersPage() {
  usePageTitle("Admin orders");
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminOrders(page)
      .then((result) => {
        if (!active) {
          return;
        }
        setOrders(result.items);
        setTotal(result.total);
        setError("");
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
  }, [page]);

  async function changeStatus(order: Order, status: OrderStatus) {
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((current) => current.map((item) => (item.id === order.id ? updated : item)));
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The order status could not be updated."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Orders</h1>
      {loading ? <Loading label="Loading orders" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {!loading && !error && orders.length === 0 ? <p className="mt-6 text-muted">No orders yet.</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="py-2 font-medium">Order</th>
              <th className="py-2 font-medium">Customer</th>
              <th className="py-2 font-medium">Total</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="py-3">{order.order_number}</td>
                <td>
                  <p>{order.customer_name}</p>
                  <p className="text-muted">{order.customer_email}</p>
                </td>
                <td>{formatPaise(order.total)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => void changeStatus(order, event.target.value as OrderStatus)}
                    className="rounded-lg border border-line bg-white px-2 py-1"
                    aria-label={`Status for ${order.order_number}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {orderStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={20} total={total} onPage={setPage} />
    </section>
  );
}
