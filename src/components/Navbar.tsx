import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { useCart } from "../hooks/useCart.ts";
import { CartIcon } from "./CartIcon.tsx";
import { SearchBar } from "./SearchBar.tsx";

const links = [
  { to: "/shop", label: "Shop", children: [] as { to: string; label: string }[] },
  { to: "/events", label: "Events", children: [] },
  { to: "/about", label: "About", children: [] },
  { to: "/contact", label: "Contact", children: [] },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return `text-sm ${isActive ? "text-wine" : "text-ink"}`;
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function search() {
    const next = query.trim();
    setOpen(false);
    navigate(next ? `/shop?search=${encodeURIComponent(next)}` : "/shop");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 overflow-x-auto px-4 py-2 text-[11px] tracking-wide whitespace-nowrap sm:text-xs">
          <span>Beauty, fashion, and lifestyle</span>
          <span className="text-paper/50">·</span>
          <span>Events are quoted before booking</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-tight" onClick={() => setOpen(false)}>
          SEMER
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map((link) =>
            link.children.length > 0 ? (
              <div key={link.to} className="group relative">
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
                <div className="invisible absolute top-full left-0 z-50 pt-2 group-focus-within:visible group-hover:visible">
                  <div className="min-w-48 rounded-2xl border border-line bg-white p-2">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-sand"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="ml-auto hidden w-72 md:block">
          <SearchBar value={query} onChange={setQuery} onSubmit={search} />
        </div>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {user?.role === "ADMIN" ? (
            <Link to="/admin" className="hidden text-sm sm:inline">
              Admin
            </Link>
          ) : null}
          {user ? (
            <Link to="/orders" className="hidden text-sm sm:inline">
              Orders
            </Link>
          ) : null}
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-sm"
            aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
          >
            <CartIcon />
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-wine px-1 text-[10px] text-paper">
                {count}
              </span>
            ) : null}
          </Link>
          {user ? (
            <button
              type="button"
              className="hidden text-sm sm:inline"
              onClick={() => {
                void logout();
              }}
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" className="hidden rounded-full border border-line px-3 py-2 text-sm sm:inline">
              Sign in
            </Link>
          )}
          <button type="button" className="text-sm lg:hidden" onClick={() => setOpen((value) => !value)}>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line px-4 py-4 lg:hidden">
          <SearchBar value={query} onChange={setQuery} onSubmit={search} className="md:hidden" />
          <nav className="mt-4 flex flex-col gap-3">
            {links.map((link) => (
              <div key={link.to} className="flex flex-col gap-2">
                <NavLink to={link.to} className={linkClass} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
                {link.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className="pl-3 text-sm text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            ))}
            {user?.role === "ADMIN" ? (
              <Link to="/admin" className="text-sm sm:hidden" onClick={() => setOpen(false)}>
                Admin
              </Link>
            ) : null}
            {user ? (
              <Link to="/orders" className="text-sm sm:hidden" onClick={() => setOpen(false)}>
                Orders
              </Link>
            ) : null}
            {user ? (
              <button type="button" className="text-left text-sm sm:hidden" onClick={() => void logout()}>
                Sign out
              </button>
            ) : (
              <Link to="/login" className="text-sm sm:hidden" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
