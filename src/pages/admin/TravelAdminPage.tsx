import { type FormEvent, useEffect, useState } from "react";
import { ImageField } from "../../components/admin/ImageField.tsx";
import { Button } from "../../components/Button.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Input } from "../../components/Input.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Select } from "../../components/Select.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { adminTravel, deleteTravel, saveTravel, type TravelInput } from "../../services/admin.ts";
import { travelCategories, type TravelCategory, type TravelPackage } from "../../services/travel.ts";
import { apiErrorMessage } from "../../utils/errors.ts";
import { formatPaise, rupeesToPaise } from "../../utils/money.ts";

const empty = {
  title: "",
  slug: "",
  category: "domestic" as TravelCategory,
  destination: "",
  country: "India",
  duration: "3",
  price: "",
  description: "",
  itinerary: "",
  status: "draft" as TravelInput["status"],
  featured: false,
  imageUrl: "",
};

export function TravelAdminPage() {
  usePageTitle("Admin travel");
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [current, setCurrent] = useState<TravelPackage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminTravel()
      .then((result) => {
        setPackages(result.items);
        setError("");
      })
      .catch((reason: unknown) => setError(apiErrorMessage(reason, "Packages could not be loaded.")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function edit(item: TravelPackage) {
    setEditing(item.id);
    setCurrent(item);
    setForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      destination: item.destination,
      country: item.country,
      duration: String(item.duration),
      price: String(item.starting_price / 100),
      description: item.description,
      itinerary: item.itinerary,
      status: item.status,
      featured: item.featured,
      imageUrl: item.images[0]?.url ?? "",
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const starting = rupeesToPaise(form.price);
    const duration = Number(form.duration);
    if (starting === undefined || !Number.isInteger(duration) || duration < 1) {
      setError("Enter a duration and a starting price in rupees.");
      return;
    }
    const images = form.imageUrl.trim()
      ? [{ url: form.imageUrl.trim(), alt_text: form.title, sort_order: 0 }]
      : current?.images.map((image) => ({ url: image.url, alt_text: image.alt_text, sort_order: image.sort_order })) ?? [];
    try {
      await saveTravel(
        {
          title: form.title,
          slug: form.slug,
          category: form.category,
          destination: form.destination,
          country: form.country,
          duration,
          starting_price: starting,
          description: form.description,
          itinerary: form.itinerary,
          accommodation: current?.accommodation ?? "",
          transportation: current?.transportation ?? "",
          activities: current?.activities ?? "",
          inclusions: current?.inclusions ?? "",
          exclusions: current?.exclusions ?? "",
          images,
          status: form.status,
          featured: form.featured,
        },
        editing ?? undefined,
      );
      setForm(empty);
      setEditing(null);
      setCurrent(null);
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The package could not be saved."));
    }
  }

  async function remove(item: TravelPackage) {
    if (!window.confirm(`Delete ${item.title}?`)) {
      return;
    }
    try {
      await deleteTravel(item.id);
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The package could not be deleted."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Travel</h1>
      <form onSubmit={(event) => void submit(event)} className="mt-6 grid max-w-3xl gap-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <Input label="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <Select
          label="Category"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value as TravelCategory })}
          options={travelCategories.map((item) => ({ value: item.value, label: item.label }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Destination" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} required />
          <Input label="Country" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} required />
          <Input label="Duration (days)" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} required />
          <Input label="Starting price (₹)" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Description</span>
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="w-full rounded-xl border border-line px-3 py-2" required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Itinerary</span>
          <textarea value={form.itinerary} onChange={(event) => setForm({ ...form, itinerary: event.target.value })} rows={3} className="w-full rounded-xl border border-line px-3 py-2" />
        </label>
        <ImageField folder="travel" value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => setForm({ ...form, status: event.target.value as TravelInput["status"] })}
          options={[
            { value: "draft", label: "Draft" },
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} />
          Featured
        </label>
        <Button type="submit">{editing ? "Update package" : "Add package"}</Button>
      </form>
      {loading ? <Loading label="Loading packages" /> : null}
      <ul className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
        {packages.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p>{item.title}</p>
              <p className="text-muted">
                {item.status} · From {formatPaise(item.starting_price)}
              </p>
            </div>
            <div className="space-x-3">
              <button type="button" className="text-wine" onClick={() => edit(item)}>
                Edit
              </button>
              <button type="button" className="text-wine" onClick={() => void remove(item)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
