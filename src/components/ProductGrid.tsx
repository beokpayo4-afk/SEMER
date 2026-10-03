import type { Product } from "../services/types.ts";
import { ProductCard } from "./ProductCard.tsx";

export function ProductGrid({
  products,
  emptyLabel = "No products match this view.",
}: {
  products: Product[];
  emptyLabel?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-line px-6 py-16 text-center text-muted">
        {emptyLabel}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <div key={product.id} className="card-rise h-full" style={{ animationDelay: `${index * 70}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
