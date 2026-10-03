import type { Product, ProductVariant } from "../services/types.ts";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string) {
  return uuidPattern.test(value);
}

export function activeVariants(product: Product) {
  return product.variants.filter((variant) => variant.is_active);
}

export function productInStock(product: Product) {
  return product.stock_quantity > 0 || activeVariants(product).some((variant) => variant.stock_quantity > 0);
}

export function variantStock(product: Product, variant: ProductVariant | null) {
  return variant ? variant.stock_quantity : product.stock_quantity;
}
