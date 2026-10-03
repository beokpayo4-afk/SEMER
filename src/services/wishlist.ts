import { api } from "./api.ts";

export type WishlistResponse = {
  product_ids: string[];
};

export async function getWishlist() {
  const { data } = await api.get<WishlistResponse>("/api/wishlist");
  return data.product_ids;
}

export async function addWishlistItem(productId: string) {
  const { data } = await api.post<WishlistResponse>("/api/wishlist", { product_id: productId });
  return data.product_ids;
}

export async function removeWishlistItem(productId: string) {
  await api.delete(`/api/wishlist/${productId}`);
}
