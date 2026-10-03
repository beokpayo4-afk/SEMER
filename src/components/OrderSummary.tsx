import type { OrderQuote } from "../services/orders.ts";
import { formatPaise } from "../utils/money.ts";

export function OrderSummary({ quote }: { quote: OrderQuote }) {
  return (
    <div>
      <ul className="space-y-4 text-sm">
        {quote.items.map((line, index) => (
          <li key={`${line.sku}-${index}`} className="flex justify-between gap-4">
            <span>
              <span className="block font-medium">
                {line.name}
                {line.variant_name ? ` · ${line.variant_name}` : ""}
              </span>
              <span className="text-muted">
                Qty {line.quantity} · {formatPaise(line.unit_price)}
                {line.line_discount > 0 ? <s className="ml-2">{formatPaise(line.list_price)}</s> : null}
              </span>
            </span>
            <span>{formatPaise(line.line_total)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPaise(quote.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          <dd>{formatPaise(quote.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatPaise(quote.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd>{formatPaise(quote.tax)}</dd>
        </div>
        <div className="flex justify-between text-lg">
          <dt>Total</dt>
          <dd>{formatPaise(quote.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
