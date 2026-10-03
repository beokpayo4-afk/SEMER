import type { Category } from "../services/types.ts";
import { Select } from "./Select.tsx";

export type CatalogFilters = {
  category: string;
  minRupees: string;
  maxRupees: string;
  available: string;
  sort: string;
};

type FilterSidebarProps = {
  filters: CatalogFilters;
  categories: Category[];
  lockCategory?: boolean;
  onChange: (next: CatalogFilters) => void;
};

const sortOptions = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "price", label: "Price, low to high" },
  { value: "-price", label: "Price, high to low" },
  { value: "name", label: "Name, A to Z" },
  { value: "-name", label: "Name, Z to A" },
  { value: "featured", label: "Featured first" },
];

export function FilterSidebar({ filters, categories, lockCategory = false, onChange }: FilterSidebarProps) {
  function update(partial: Partial<CatalogFilters>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-5">
      {lockCategory ? null : (
        <Select
          label="Category"
          value={filters.category}
          onChange={(event) => update({ category: event.target.value })}
          options={[
            { value: "", label: "All categories" },
            ...categories.map((category) => {
              const parent = categories.find((item) => item.id === category.parent_id);
              return { value: category.id, label: parent ? `${parent.name} / ${category.name}` : category.name };
            }),
          ]}
        />
      )}
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Minimum price (₹)</span>
        <input
          inputMode="decimal"
          value={filters.minRupees}
          onChange={(event) => update({ minRupees: event.target.value })}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-ink"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Maximum price (₹)</span>
        <input
          inputMode="decimal"
          value={filters.maxRupees}
          onChange={(event) => update({ maxRupees: event.target.value })}
          className="w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-ink"
        />
      </label>
      <Select
        label="Availability"
        value={filters.available}
        onChange={(event) => update({ available: event.target.value })}
        options={[
          { value: "", label: "Any" },
          { value: "true", label: "In stock" },
          { value: "false", label: "Out of stock" },
        ]}
      />
      <Select
        label="Sort"
        value={filters.sort}
        onChange={(event) => update({ sort: event.target.value })}
        options={sortOptions}
      />
    </div>
  );
}
