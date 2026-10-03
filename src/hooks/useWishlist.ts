import { useContext } from "react";
import { WishlistContext } from "../context/wishlist-context.ts";

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return value;
}
