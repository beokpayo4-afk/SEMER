import { useContext } from "react";
import { CartContext } from "../context/cart-context.ts";

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
