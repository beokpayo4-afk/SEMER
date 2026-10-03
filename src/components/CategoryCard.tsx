import { Link } from "react-router-dom";
import type { Category } from "../services/types.ts";
import { ProductImage } from "./ProductImage.tsx";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="group flex min-h-36 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white transition hover:border-ink"
    >
      {category.image_url ? (
        <ProductImage src={category.image_url} alt="" className="aspect-4/3 w-full" />
      ) : (
        <span className="px-5 pt-5 text-xs tracking-[0.16em] text-muted uppercase">Category</span>
      )}
      <span className="px-5 py-5 font-display text-2xl leading-tight group-hover:text-wine">{category.name}</span>
    </Link>
  );
}
