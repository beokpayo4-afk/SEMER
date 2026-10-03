import { api } from "./api.ts";

export type CartItem = {
  id: string;
  product_id: string;
  variant_id: string | null;
  name: string;
  variant_name: string | null;
  sku: string;
  image_url: string | null;
  quantity: number;
  stock_quantity: number;
  list_price: number;
  unit_price: number;
  line_subtotal: number;
  line_discount: number;
  line_total: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
};

export async function getCart() {
  const { data } = await api.get<Cart>("/api/cart");
  return data;
}

export async function addCartItem(productId: string, variantId: string | null, quantity: number) {
  const { data } = await api.post<Cart>("/api/cart/items", {
    product_id: productId,
    variant_id: variantId,
    quantity,
  });
  return data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.put<Cart>(`/api/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItem(itemId: string) {
  await api.delete(`/api/cart/items/${itemId}`);
}

export async function clearCart() {
  await api.delete("/api/cart");
}
