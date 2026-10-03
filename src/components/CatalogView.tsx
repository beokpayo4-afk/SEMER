import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCategories, useProducts } from "../hooks/useCatalog.ts";
import { rupeesToPaise } from "../utils/money.ts";
import type { ProductQuery } from "../services/types.ts";
import { Button } from "./Button.tsx";
import { ProductImage } from "./ProductImage.tsx";
import { ErrorMessage } from "./ErrorMessage.tsx";
import { FilterSidebar, type CatalogFilters } from "./FilterSidebar.tsx";
import { Loading } from "./Loading.tsx";
import { Modal } from "./Modal.tsx";
import { Pagination } from "./Pagination.tsx";
import { ProductGrid } from "./ProductGrid.tsx";
import { SearchBar } from "./SearchBar.tsx";

type CatalogViewProps = {
  title: string;
  intro?: string;
  imageUrl?: string | null;
  lockedCategoryId?: string;
};

const categoryRank = ["Shirts", "Pants", "T-shirts", "Jeans"];

function categoryOrder(name: string) {
  const index = categoryRank.indexOf(name);
  return index === -1 ? categoryRank.length : index;
}

function readFilters(params: URLSearchParams, lockedCategoryId?: string): CatalogFilters {
  return {
    category: lockedCategoryId ?? params.get("category") ?? "",
    minRupees: params.get("min") ?? "",
    maxRupees: params.get("max") ?? "",
    available: params.get("available") ?? "",
    sort: params.get("sort") ?? "-created_at",
  };
}

export function CatalogView({ title, intro, imageUrl, lockedCategoryId }: CatalogViewProps) {
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params, lockedCategoryId);
  const [draftSearch, setDraftSearch] = useState(params.get("search") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categories = useCategories();
  const page = Number(params.get("page") ?? "1") || 1;

  const query = useMemo<ProductQuery>(() => {
    const next: ProductQuery = {
      page,
      page_size: 12,
      sort: filters.sort,
    };
    if (filters.category) {
      next.category = filters.category;
    }
    const search = params.get("search");
    if (search) {
      next.search = search;
    }
    const minPrice = rupeesToPaise(filters.minRupees);
    const maxPrice = rupeesToPaise(filters.maxRupees);
    if (minPrice !== undefined) {
      next.min_price = minPrice;
    }
    if (maxPrice !== undefined) {
      next.max_price = maxPrice;
    }
    if (filters.available === "true" || filters.available === "false") {
      next.available = filters.available === "true";
    }
    return next;
  }, [filters, page, params]);

  const products = useProducts(query);
  const childCategories = (categories.data ?? [])
    .filter((category) => lockedCategoryId && category.parent_id === lockedCategoryId)
    .sort((left, right) => categoryOrder(left.name) - categoryOrder(right.name) || left.name.localeCompare(right.name));

  function writeFilters(next: CatalogFilters, search = params.get("search") ?? "") {
    const written = new URLSearchParams();
    if (!lockedCategoryId && next.category) {
      written.set("category", next.category);
    }
    if (search) {
      written.set("search", search);
    }
    if (next.minRupees) {
      written.set("min", next.minRupees);
    }
    if (next.maxRupees) {
      written.set("max", next.maxRupees);
    }
    if (next.available) {
      written.set("available", next.available);
    }
    if (next.sort && next.sort !== "-created_at") {
      written.set("sort", next.sort);
    }
    setParams(written);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.18em] text-muted uppercase">Catalogue</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
          {imageUrl ? <ProductImage src={imageUrl} alt="" className="mt-4 aspect-4/3 w-full max-w-sm rounded-3xl" /> : null}
          {intro ? <p className="mt-3 max-w-xl text-muted">{intro}</p> : null}
        </div>
        <SearchBar
          className="md:w-80"
          value={draftSearch}
          onChange={setDraftSearch}
          onSubmit={() => writeFilters(filters, draftSearch.trim())}
        />
      </div>
      <div className="mt-8 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          {categories.error ? <ErrorMessage message={categories.error} /> : null}
          <FilterSidebar
            filters={filters}
            categories={categories.data ?? []}
            lockCategory={Boolean(lockedCategoryId)}
            onChange={(next) => writeFilters(next)}
          />
        </aside>
        <div>
          <div className="mb-6 lg:hidden">
            <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
              Filters
            </Button>
          </div>
          {products.loading ? <Loading label="Loading products" /> : null}
          {products.error ? <ErrorMessage message={products.error} /> : null}
          {childCategories.length > 0 ? (
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {childCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="group overflow-hidden rounded-3xl border border-line bg-white"
                >
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
          {products.data && (products.data.total > 0 || childCategories.length === 0) ? (
            <p className="mb-4 text-sm text-muted">
              {products.data.total} {products.data.total === 1 ? "product" : "products"}
            </p>
          ) : null}
          {products.data && (products.data.items.length > 0 || childCategories.length === 0) ? (
            <ProductGrid
              products={products.data.items}
              emptyLabel="No products match these filters."
            />
          ) : null}
          {products.data ? (
            <Pagination
              page={products.data.page}
              pageSize={products.data.page_size}
              total={products.data.total}
              onPage={(nextPage) => {
                const written = new URLSearchParams(params);
                if (nextPage <= 1) {
                  written.delete("page");
                } else {
                  written.set("page", String(nextPage));
                }
                setParams(written);
              }}
            />
          ) : null}
        </div>
      </div>
      <Modal open={filtersOpen} title="Filters" onClose={() => setFiltersOpen(false)}>
        <FilterSidebar
          filters={filters}
          categories={categories.data ?? []}
          lockCategory={Boolean(lockedCategoryId)}
          onChange={(next) => {
            writeFilters(next);
            setFiltersOpen(false);
          }}
        />
      </Modal>
    </section>
  );
}
