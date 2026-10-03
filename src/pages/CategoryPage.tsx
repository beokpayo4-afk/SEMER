import { useParams } from "react-router-dom";
import { CatalogView } from "../components/CatalogView.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Loading } from "../components/Loading.tsx";
import { useCategory } from "../hooks/useCatalog.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";

export function CategoryPage() {
  const { id = "" } = useParams();
  const category = useCategory(id);
  usePageTitle(category.data?.name ?? "Category");

  if (category.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Loading label="Loading category" />
      </div>
    );
  }
  if (category.error || !category.data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ErrorMessage message={category.error ?? "Category not found."} />
      </div>
    );
  }
  return (
    <CatalogView
      title={category.data.name}
      imageUrl={category.data.image_url}
      lockedCategoryId={category.data.id}
    />
  );
}
