import { useEffect, useState } from "react";
import { BarChart } from "../../components/admin/BarChart.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { getDashboard, type Dashboard } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";

export function DashboardPage() {
  usePageTitle("Admin dashboard");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getDashboard()
      .then((next) => {
        if (active) {
          setDashboard(next);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "The dashboard could not be loaded."));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <section className="p-6">
        <ErrorMessage message={error} />
      </section>
    );
  }
  if (!dashboard) {
    return <Loading label="Loading dashboard" />;
  }

  const cards = [
    ["Total orders", String(dashboard.total_orders)],
    ["Total sales", formatPaise(dashboard.total_sales)],
    ["Pending orders", String(dashboard.pending_orders)],
    ["Completed orders", String(dashboard.completed_orders)],
    ["Total customers", String(dashboard.total_customers)],
    ["Total products", String(dashboard.total_products)],
    ["Low stock products", String(dashboard.low_stock_products)],
    ["Travel enquiries", String(dashboard.travel_enquiries)],
    ["Event enquiries", String(dashboard.event_enquiries)],
  ];

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Sales exclude cancelled and refunded orders. Completed orders are delivered.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-line bg-white p-5">
            <p className="text-xs tracking-[0.14em] text-muted uppercase">{label}</p>
            <p className="mt-2 text-3xl">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Sales"
          points={dashboard.months.map((month) => ({
            label: month.month.slice(5),
            value: month.sales,
            caption: formatPaise(month.sales),
          }))}
        />
        <BarChart
          title="Orders"
          points={dashboard.months.map((month) => ({
            label: month.month.slice(5),
            value: month.orders,
            caption: String(month.orders),
          }))}
        />
        <BarChart
          title="Product categories"
          points={
            dashboard.categories.length
              ? dashboard.categories.map((category) => ({
                  label: category.name,
                  value: category.products,
                  caption: String(category.products),
                }))
              : [{ label: "None", value: 0, caption: "0" }]
          }
        />
      </div>
    </section>
  );
}
