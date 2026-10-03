import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Product } from "../services/types.ts";
import { isUuid, productInStock, variantStock } from "./product.ts";

function product(stock: number, variants: Product["variants"] = []): Product {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Rose Serum",
    slug: "rose-serum",
    description: "Daily serum",
    price: 150000,
    sale_price: null,
    sku: "SKU-1",
    stock_quantity: stock,
    category: { id: "22222222-2222-4222-8222-222222222222", name: "Care", slug: "care" },
    brand: null,
    status: "active",
    featured: false,
    images: [],
    variants,
    rating_average: null,
    review_count: 0,
  };
}

describe("product stock", () => {
  it("accepts only uuid identifiers", () => {
    assert.equal(isUuid("11111111-1111-4111-8111-111111111111"), true);
    assert.equal(isUuid("not-a-product"), false);
  });

  it("treats an item as out of stock when the product and variants are empty", () => {
    assert.equal(productInStock(product(0)), false);
    assert.equal(
      productInStock(
        product(0, [
          {
            id: "33333333-3333-4333-8333-333333333333",
            sku: "VAR",
            name: "30 ml",
            price: 150000,
            sale_price: null,
            stock_quantity: 2,
            is_active: true,
          },
        ]),
      ),
      true,
    );
  });

  it("reads variant stock when a variant is selected", () => {
    const item = product(4);
    const variant = {
      id: "33333333-3333-4333-8333-333333333333",
      sku: "VAR",
      name: "30 ml",
      price: 150000,
      sale_price: null,
      stock_quantity: 1,
      is_active: true,
    };
    assert.equal(variantStock(item, null), 4);
    assert.equal(variantStock(item, variant), 1);
  });
});
