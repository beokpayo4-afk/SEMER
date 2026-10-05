import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCatalog.ts";
import { findCategory } from "../utils/categories.ts";
import { companyEmail, companyName, companyPhone, companyPhoneHref } from "../utils/company.ts";

const departments = ["Beauty & Personal Care", "Fashion", "Lifestyle"];

export function Footer() {
  const categories = useCategories();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">SEMER</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{companyName}</p>
          <a href={`mailto:${companyEmail}`} className="mt-4 block break-all text-sm text-muted">
            {companyEmail}
          </a>
          <a href={companyPhoneHref} className="mt-2 block text-sm text-muted">
            {companyPhone}
          </a>
        </div>
        <div className="text-sm">
          <p className="font-medium">Visit</p>
          <div className="mt-3 flex flex-col gap-2 text-muted">
            <Link to="/shop">Shop</Link>
            {departments.map((name) => {
              const match = categories.data ? findCategory(categories.data, name) : undefined;
              const to = match ? `/categories/${match.id}` : `/shop?search=${encodeURIComponent(name)}`;
              return (
                <Link key={name} to={to}>
                  {name}
                </Link>
              );
            })}
            <Link to="/contact">Contact</Link>
            <Link to="/product-refund-return-policy">Product Refund / Return Policy</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-medium">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-muted">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
