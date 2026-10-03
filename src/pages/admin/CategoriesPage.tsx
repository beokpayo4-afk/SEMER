import { type FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/Button.tsx";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Input } from "../../components/Input.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Select } from "../../components/Select.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { ImageField } from "../../components/admin/ImageField.tsx";
import { deleteCategory, saveCategory } from "../../services/admin.ts";
import { getCategories } from "../../services/catalog.ts";
import type { Category } from "../../services/types.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CategoriesPage() {
  usePageTitle("Admin categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getCategories()
      .then((next) => {
        setCategories(next);
        setError("");
      })
      .catch((reason: unknown) => setError(apiErrorMessage(reason, "Categories could not be loaded.")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function reset() {
    setEditing(null);
    setName("");
    setSlug("");
    setParentId("");
    setImageUrl("");
    setActive(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await saveCategory(
        { name, slug, parent_id: parentId || null, image_url: imageUrl.trim() || null, is_active: active },
        editing ?? undefined,
      );
      reset();
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The category could not be saved."));
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`Delete ${category.name}?`)) {
      return;
    }
    try {
      await deleteCategory(category.id);
      load();
    } catch (reason: unknown) {
      setError(apiErrorMessage(reason, "The category could not be deleted."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Categories</h1>
      <form onSubmit={(event) => void submit(event)} className="mt-6 grid max-w-xl gap-4">
        {error ? <ErrorMessage message={error} /> : null}
        <Input
          label="Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!editing) {
              setSlug(slugify(event.target.value));
            }
          }}
          required
        />
        <Input label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        <ImageField folder="categories" value={imageUrl} onChange={setImageUrl} />
        <Select
          label="Parent"
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
          options={[
            { value: "", label: "None" },
            ...categories.filter((item) => item.id !== editing).map((item) => ({ value: item.id, label: item.name })),
          ]}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
          Active
        </label>
        <div className="flex gap-3">
          <Button type="submit">{editing ? "Update category" : "Add category"}</Button>
          {editing ? (
            <button type="button" className="text-sm text-muted" onClick={reset}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      {loading ? <Loading label="Loading categories" /> : null}
      <ul className="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
        {categories.map((category) => (
          <li key={category.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
            <div>
              <p>{category.name}</p>
              <p className="text-muted">{category.is_active ? "Active" : "Inactive"}</p>
            </div>
            <div className="space-x-3">
              <button
                type="button"
                className="text-wine"
                onClick={() => {
                  setEditing(category.id);
                  setName(category.name);
                  setSlug(category.slug);
                  setParentId(category.parent_id ?? "");
                  setImageUrl(category.image_url ?? "");
                  setActive(category.is_active);
                }}
              >
                Edit
              </button>
              <button type="button" className="text-wine" onClick={() => void remove(category)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
