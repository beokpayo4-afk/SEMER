import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Pagination } from "../../components/Pagination.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { useToast } from "../../hooks/useToast.ts";
import { adminProducts, deleteProduct, updateStock } from "../../services/admin.ts";
import type { Product } from "../../services/types.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise } from "../../utils/money.ts";

export function ProductsPage() {
  usePageTitle("Admin products");
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminProducts(page, query)
      .then((result) => {
        if (!active) {
          return;
        }
        setItems(result.items);
        setTotal(result.total);
        setError("");
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Products could not be loaded."));
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
  }, [page, query]);

  async function remove(product: Product) {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }
    try {
      await deleteProduct(product.id);
      setItems((current) => current.filter((item) => item.id !== product.id));
      setTotal((current) => current - 1);
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The product could not be deleted."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Products</h1>
        <Link to="/admin/products/new" className="rounded-full bg-wine px-4 py-2 text-sm text-paper">
          Add product
        </Link>
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="w-full max-w-sm rounded-xl border border-line bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-full border border-line px-4 py-2 text-sm">
          Search
        </button>
      </form>
      {loading ? <Loading label="Loading products" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {!loading && !error && items.length === 0 ? <p className="mt-6 text-muted">No products yet.</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-180t-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="py-2 font-medium">Product</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Stock</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="py-3">
                  <p>{product.name}</p>
                  <p className="text-muted">{product.sku}</p>
                </td>
                <td>{product.status}</td>
                <td>{formatPaise(product.sale_price ?? product.price)}</td>
                <td>
                  <StockEditor
                    productId={product.id}
                    stock={product.stock_quantity}
                    onSaved={() => showToast("Stock updated.")}
                  />
                </td>
                <td className="space-x-3 text-right">
                  <Link to={`/admin/products/${product.id}/edit`} className="text-wine">
                    Edit
                  </Link>
                  <button type="button" className="text-wine" onClick={() => void remove(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={20} total={total} onPage={setPage} />
    </section>
  );
}

function StockEditor({ productId, stock, onSaved }: { productId: string; stock: number; onSaved: () => void }) {
  const { showToast } = useToast();
  const [value, setValue] = useState(String(stock));
  const [saving, setSaving] = useState(false);

  async function save() {
    const next = Number(value);
    if (!Number.isInteger(next) || next < 0) {
      showToast("Enter a stock quantity.");
      return;
    }
    setSaving(true);
    try {
      await updateStock(productId, next);
      onSaved();
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "Stock could not be updated."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <span className="flex items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputMode="numeric"
        className="w-20 rounded-lg border border-line px-2 py-1"
      />
      <button type="button" className="text-wine" disabled={saving} onClick={() => void save()}>
        Save
      </button>
    </span>
  );
}
