import { CatalogView } from "../components/CatalogView.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";

export function ShopPage() {
  usePageTitle("Shop");
  return (
    <CatalogView
      title="Shop"
      intro="Beauty, personal care, fashion, and lifestyle pieces from the live catalogue."
    />
  );
}
