import { createContext } from "react";
import type { CartItem } from "../services/cart.ts";

export type CartContextValue = {
  lines: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  loading: boolean;
  addItem: (productId: string, variantId: string | null, quantity: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const CartContext = createContext<CartContextValue | null>(null);
