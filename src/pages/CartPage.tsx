import { Link } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { Loading } from "../components/Loading.tsx";
import { ProductImage } from "../components/ProductImage.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useCart } from "../hooks/useCart.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { formatPaise } from "../utils/money.ts";

export function CartPage() {
  usePageTitle("Cart");
  const { user, loading: authLoading } = useAuth();
  const { lines, subtotal, discount, total, loading, updateQuantity, removeItem, clear } = useCart();

  if (authLoading || (user && loading)) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Loading label="Loading cart" />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl">Cart</h1>
        {lines.length > 0 ? (
          <button type="button" className="text-sm text-wine" onClick={() => void clear()}>
            Clear cart
          </button>
        ) : null}
      </div>
      {lines.length === 0 ? (
        <div className="mt-8">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/shop" className="mt-4 inline-block text-wine">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-4">
            {lines.map((line) => (
              <article
                key={line.id}
                className="grid grid-cols-[5rem_1fr] gap-4 rounded-3xl border border-line bg-white p-4 sm:grid-cols-[6rem_1fr_auto]"
              >
                <div className="aspect-4/5 overflow-hidden rounded-2xl bg-sand">
                  <ProductImage src={line.image_url} alt="" className="h-full w-full" />
                </div>
                <div>
                  <h2 className="text-xl">{line.name}</h2>
                  {line.variant_name ? <p className="text-sm text-muted">{line.variant_name}</p> : null}
                  <p className="mt-2 text-sm">
                    {formatPaise(line.unit_price)}
                    {line.line_discount > 0 ? (
                      <span className="ml-2 text-muted line-through">{formatPaise(line.list_price)}</span>
                    ) : null}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        className="px-3 py-2 text-sm"
                        aria-label={`Decrease quantity for ${line.name}`}
                        disabled={line.quantity <= 1}
                        onClick={() => void updateQuantity(line.id, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        className="px-3 py-2 text-sm"
                        aria-label={`Increase quantity for ${line.name}`}
                        disabled={line.quantity >= line.stock_quantity}
                        onClick={() => void updateQuantity(line.id, line.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="text-sm text-wine" onClick={() => void removeItem(line.id)}>
                      Remove
                    </button>
                  </div>
                  {line.quantity >= line.stock_quantity ? (
                    <p className="mt-2 text-xs text-muted">{line.stock_quantity} available</p>
                  ) : null}
                </div>
                <p className="hidden text-right sm:block">{formatPaise(line.line_total)}</p>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-3xl bg-sand p-6">
            <h2 className="text-2xl">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd>{formatPaise(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Discount</dt>
                <dd>{formatPaise(discount)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-lg">
                <dt>Total</dt>
                <dd>{formatPaise(total)}</dd>
              </div>
            </dl>
            <Link to={user ? "/checkout" : "/login"} state={user ? undefined : { from: "/checkout" }} className="mt-6 block">
              <Button className="w-full">{user ? "Checkout" : "Sign in to checkout"}</Button>
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
