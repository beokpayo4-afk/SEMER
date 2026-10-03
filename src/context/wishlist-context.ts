import { createContext } from "react";

export type WishlistContextValue = {
  ids: string[];
  loading: boolean;
  includes: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
};

export const WishlistContext = createContext<WishlistContextValue | null>(null);
