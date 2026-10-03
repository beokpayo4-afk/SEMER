import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { Toast } from "../components/Toast.tsx";
import { Loading } from "../components/Loading.tsx";
import { useAuth } from "../hooks/useAuth.ts";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/travel", label: "Travel" },
  { to: "/admin/travel-enquiries", label: "Travel enquiries" },
  { to: "/admin/events", label: "Events" },
  { to: "/admin/event-enquiries", label: "Event enquiries" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4">
        <Loading label="Checking access" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== "ADMIN") {
    return (
      <section className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-4xl">Administrators only</h1>
        <p className="mt-3 text-muted">This account cannot open the admin dashboard.</p>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-paper md:flex">
      <aside className="border-b border-line bg-white md:w-60 md:shrink-0 md:border-r md:border-b-0">
        <div className="px-4 py-4">
          <p className="font-display text-2xl">SEMER</p>
          <p className="text-xs tracking-[0.14em] text-muted uppercase">Admin</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm whitespace-nowrap ${isActive ? "bg-ink text-paper" : "text-ink"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/" className="rounded-full px-3 py-2 text-sm whitespace-nowrap text-muted">
            Storefront
          </NavLink>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
      <Toast />
    </div>
  );
}
