import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Loading } from "../components/Loading.tsx";
import { Pagination } from "../components/Pagination.tsx";
import { ProductImage } from "../components/ProductImage.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import {
  listTravel,
  travelCategories,
  travelCategoryLabel,
  type TravelCategory,
  type TravelPackage,
} from "../services/travel.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { formatPaise } from "../utils/money.ts";

const pageSize = 12;

function isCategory(value: string | null): value is TravelCategory {
  return travelCategories.some((item) => item.value === value);
}

export function TravelPage() {
  usePageTitle("Travel");
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get("category");
  const category = isCategory(categoryParam) ? categoryParam : undefined;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    listTravel({ category, page, page_size: pageSize })
      .then((result) => {
        if (!active) {
          return;
        }
        setPackages(result.items);
        setTotal(result.total);
        setError("");
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Travel packages could not be loaded."));
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
  }, [category, page]);

  function setCategory(next: TravelCategory | undefined) {
    const following = new URLSearchParams();
    if (next) {
      following.set("category", next);
    }
    setParams(following);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">Travel</p>
      <h1 className="mt-3 max-w-3xl text-4xl sm:text-5xl">Trips, quoted before they are booked.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Domestic trips, international trips, holiday packages, and honeymoon packages. Choose a package and send an
        enquiry. A quote comes back before any booking.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterButton active={!category} onClick={() => setCategory(undefined)}>
          All
        </FilterButton>
        {travelCategories.map((item) => (
          <FilterButton key={item.value} active={category === item.value} onClick={() => setCategory(item.value)}>
            {item.label}
          </FilterButton>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/travel/enquire" className="text-sm text-wine">
          Plan a customized trip
        </Link>
      </div>
      {loading ? <Loading label="Loading packages" /> : null}
      {error ? (
        <div className="mt-6">
          <ErrorMessage message={error} />
        </div>
      ) : null}
      {!loading && !error && packages.length === 0 ? (
        <p className="mt-8 text-muted">Packages will appear here when they are published.</p>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((item) => (
          <Link
            key={item.id}
            to={`/travel/${item.id}`}
            className="overflow-hidden rounded-3xl border border-line bg-white transition hover:border-ink"
          >
            <ProductImage
              src={item.images[0]?.url}
              alt={item.images[0]?.alt_text || item.title}
              className="aspect-4/3 w-full"
            />
            <div className="p-5">
              <p className="text-xs tracking-[0.14em] text-muted uppercase">{travelCategoryLabel(item.category)}</p>
              <h2 className="mt-2 text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {item.destination}, {item.country} · {item.duration} {item.duration === 1 ? "day" : "days"}
              </p>
              <p className="mt-3 text-sm">From {formatPaise(item.starting_price)}</p>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPage={(next) => {
          const following = new URLSearchParams(params);
          following.set("page", String(next));
          setParams(following);
        }}
      />
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm ${active ? "bg-ink text-paper" : "border border-line bg-white"}`}
    >
      {children}
    </button>
  );
}
