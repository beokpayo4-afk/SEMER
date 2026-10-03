import { Link } from "react-router-dom";
import { useCategories, useProducts } from "../hooks/useCatalog.ts";
import type { ProductQuery } from "../services/types.ts";
import { findCategory } from "../utils/categories.ts";
import { ErrorMessage } from "./ErrorMessage.tsx";
import { Loading } from "./Loading.tsx";
import { ProductGrid } from "./ProductGrid.tsx";
import { ProductImage } from "./ProductImage.tsx";

type ProductSectionProps = {
  title: string;
  intro: string;
  categoryLabel?: string;
  subcategories?: string[];
  tone?: "paper" | "sand";
};

export function ProductSection({
  title,
  intro,
  categoryLabel,
  subcategories = [],
  tone = "paper",
}: ProductSectionProps) {
  const categories = useCategories();
  const match = categoryLabel && categories.data ? findCategory(categories.data, categoryLabel) : undefined;
  const tiles = categories.data
    ? subcategories.flatMap((label) => {
        const category = findCategory(categories.data ?? [], label);
        return category ? [category] : [];
      })
    : [];
  const tileSection = subcategories.length > 0;
  const waiting = Boolean(categoryLabel) && categories.loading;
  const missing = Boolean(categoryLabel) && Boolean(categories.data) && !match;
  const latest: ProductQuery = { page: 1, page_size: 4, sort: "-created_at" };
  const overview = useProducts(categoryLabel && !tileSection ? latest : null);
  const emptyCatalog = overview.data?.total === 0;
  const overviewSettled = tileSection || !categoryLabel || overview.data !== null || Boolean(overview.error);

  const query: ProductQuery | null = tileSection
    ? null
    : categoryLabel
      ? emptyCatalog
        ? latest
        : match
          ? { category: match.id, page: 1, page_size: 4, sort: "-created_at" }
          : null
      : latest;

  const products = useProducts(!overviewSettled || (!tileSection && !emptyCatalog && (waiting || missing)) ? null : query);
  const browseTo = match ? `/categories/${match.id}` : "/shop";
  const shell = tone === "sand" ? "bg-sand" : "";

  return (
    <section className={shell}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl">{title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{intro}</p>
          </div>
          <Link to={browseTo} className="text-sm text-wine">
            View all
          </Link>
        </div>
        {categories.error && categoryLabel ? <ErrorMessage message={categories.error} /> : null}
        {(!tileSection && !emptyCatalog && waiting) || products.loading ? <Loading label="Loading products" /> : null}
        {products.error ? <ErrorMessage message={products.error} /> : null}
        {missing ? (
          <p className="rounded-3xl border border-dashed border-line px-6 py-16 text-center text-muted">
            Products in this category will appear here when the category is published.
          </p>
        ) : null}
        {tiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {tiles.map((category) => (
              <Link key={category.id} to={`/categories/${category.id}`} className="group overflow-hidden rounded-3xl border border-line bg-white">
                <div className="aspect-4/3 overflow-hidden bg-sand">
                  <ProductImage
                    src={category.image_url}
                    alt=""
                    className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="px-3 py-3 text-sm font-medium">{category.name}</p>
              </Link>
            ))}
          </div>
        ) : null}
        {products.data && !tileSection ? (
          <ProductGrid
            products={products.data.items}
            emptyLabel="Products in this category will appear here when they are published."
          />
        ) : null}
      </div>
    </section>
  );
}
