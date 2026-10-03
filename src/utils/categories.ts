import type { Category } from "../services/types.ts";

function categoryKey(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findCategory(categories: Category[], label: string) {
  const target = categoryKey(label);
  return categories.find(
    (category) => categoryKey(category.name) === target || categoryKey(category.slug) === target,
  );
}
