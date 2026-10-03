import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageField } from "../../components/admin/ImageField.tsx";
import { Button } from "../../components/Button.tsx";
import { Input } from "../../components/Input.tsx";
import { Select } from "../../components/Select.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { deleteProduct, saveProduct } from "../../services/admin.ts";
import { getCategories, getProduct } from "../../services/catalog.ts";
import type { Category } from "../../services/types.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { rupeesToPaise } from "../../utils/money.ts";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  usePageTitle(editing ? "Edit product" : "Add product");
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState<"draft" | "active" | "archived">("draft");
  const [featured, setFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(editing);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((next) => {
        if (active) {
          setCategories(next);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Categories could not be loaded."));
        }
      });
    if (!id) {
      return () => {
        active = false;
      };
    }
    getProduct(id)
      .then((product) => {
        if (!active) {
          return;
        }
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setPrice(String(product.price / 100));
        setSalePrice(product.sale_price === null ? "" : String(product.sale_price / 100));
        setSku(product.sku);
        setStock(String(product.stock_quantity));
        setCategoryId(product.category.id);
        setBrand(product.brand ?? "");
        setStatus(product.status);
        setFeatured(product.featured);
        setImageUrl(product.images[0]?.url ?? "");
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Product not found."));
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
  }, [id]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const pricePaise = rupeesToPaise(price);
    const salePaise = salePrice.trim() ? rupeesToPaise(salePrice) : null;
    const stockQuantity = Number(stock);
    if (!name || !slug || !description || !sku || !categoryId || pricePaise === undefined) {
      setError("Complete the product fields. Prices are in rupees.");
      return;
    }
    if (salePrice.trim() && salePaise === undefined) {
      setError("Enter a valid sale price.");
      return;
    }
    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setError("Enter a stock quantity.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const images = imageUrl.trim()
        ? [{ url: imageUrl.trim(), alt_text: name, sort_order: 0 }]
        : editing
          ? undefined
          : [];
      await saveProduct(
        {
          name,
          slug,
          description,
          price: pricePaise,
          sale_price: salePaise ?? null,
          sku,
          stock_quantity: stockQuantity,
          category_id: categoryId,
          brand: brand.trim() || null,
          status,
          featured,
          images,
        },
        id,
      );
      navigate("/admin/products");
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The product could not be saved."));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id || !window.confirm("Delete this product?")) {
      return;
    }
    try {
      await deleteProduct(id);
      navigate("/admin/products");
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The product could not be deleted."));
    }
  }

  if (loading) {
    return <Loading label="Loading product" />;
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/admin/products" className="text-sm text-muted">
        Products
      </Link>
      <h1 className="mt-3 text-4xl">{editing ? "Edit product" : "Add product"}</h1>
      <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input
          label="Name"
          value={name}
          onChange={(event) => {
            const next = event.target.value;
            setName(next);
            if (!editing) {
              setSlug(slugify(next));
            }
          }}
          required
        />
        <Input label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5"
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Price (₹)" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} required />
          <Input label="Sale price (₹)" inputMode="decimal" value={salePrice} onChange={(event) => setSalePrice(event.target.value)} />
          <Input label="SKU" value={sku} onChange={(event) => setSku(event.target.value)} required />
          <Input label="Stock" inputMode="numeric" value={stock} onChange={(event) => setStock(event.target.value)} required />
        </div>
        <Select
          label="Category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          options={[{ value: "", label: "Choose a category" }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
          required
        />
        <Input label="Brand" value={brand} onChange={(event) => setBrand(event.target.value)} />
        <ImageField folder="products" value={imageUrl} onChange={setImageUrl} />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as "draft" | "active" | "archived")}
          options={[
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          Featured
        </label>
        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving" : "Save product"}
          </Button>
          {editing ? (
            <button type="button" className="text-sm text-wine" onClick={() => void remove()}>
              Delete
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
