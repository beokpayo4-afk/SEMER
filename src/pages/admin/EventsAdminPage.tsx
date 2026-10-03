import { type FormEvent, useEffect, useState } from "react";
import { ImageField } from "../../components/admin/ImageField.tsx";
import { Button } from "../../components/Button.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Input } from "../../components/Input.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Select } from "../../components/Select.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { adminEvents, deleteEvent, saveEvent, type EventInput } from "../../services/admin.ts";
import { eventCategories, type EventCategory, type EventService } from "../../services/events.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

export function EventsAdminPage() {
  usePageTitle("Admin events");
  const [services, setServices] = useState<EventService[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [current, setCurrent] = useState<EventService | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState<EventCategory>("wedding");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<EventInput["status"]>("draft");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminEvents()
      .then((result) => {
        setServices(result.items);
        setError("");
      })
      .catch((reason: unknown) => setError(apiErrorMessage(reason, "Services could not be loaded.")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function reset() {
    setEditing(null);
    setCurrent(null);
    setTitle("");
    setSlug("");
    setCategory("wedding");
    setDescription("");
    setDetails("");
    setImageUrl("");
    setStatus("draft");
    setFeatured(false);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const images = imageUrl.trim()
      ? [{ url: imageUrl.trim(), alt_text: title, sort_order: 0 }]
      : current?.images.map((image) => ({ url: image.url, alt_text: image.alt_text, sort_order: image.sort_order })) ?? [];
    try {
      await saveEvent(
        { title, slug, category, description, services: details, images, status, featured },
        editing ?? undefined,
      );
      reset();
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The service could not be saved."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Events</h1>
      <form onSubmit={(event) => void submit(event)} className="mt-6 grid max-w-3xl gap-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <Input label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        <Select
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value as EventCategory)}
          options={eventCategories.map((item) => ({ value: item.value, label: item.label }))}
        />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Description</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full rounded-xl border border-line px-3 py-2" required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Services</span>
          <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} className="w-full rounded-xl border border-line px-3 py-2" />
        </label>
        <ImageField folder="events" value={imageUrl} onChange={setImageUrl} />
        <Select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as EventInput["status"])}
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
        <Button type="submit">{editing ? "Update service" : "Add service"}</Button>
      </form>
      {loading ? <Loading label="Loading services" /> : null}
      <ul className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
        {services.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p>{item.title}</p>
              <p className="text-muted">{item.status}</p>
            </div>
            <div className="space-x-3">
              <button
                type="button"
                className="text-wine"
                onClick={() => {
                  setEditing(item.id);
                  setCurrent(item);
                  setTitle(item.title);
                  setSlug(item.slug);
                  setCategory(item.category);
                  setDescription(item.description);
                  setDetails(item.services);
                  setImageUrl(item.images[0]?.url ?? "");
                  setStatus(item.status);
                  setFeatured(item.featured);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-wine"
                onClick={() => {
                  if (!window.confirm(`Delete ${item.title}?`)) {
                    return;
                  }
                  void deleteEvent(item.id).then(load).catch((reason: unknown) => {
                    setError(apiErrorMessage(reason, "The service could not be deleted."));
                  });
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
