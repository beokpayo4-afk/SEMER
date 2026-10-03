import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useToast } from "../hooks/useToast.ts";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type Cart,
} from "../services/cart.ts";
import { getProduct } from "../services/catalog.ts";
import {
  guestLineId,
  presentGuestCart,
  readGuestCart,
  writeGuestCart,
  type GuestLine,
} from "../services/guestCart.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { sellingPrice } from "../utils/money.ts";
import { CartContext } from "./cart-context.ts";

const emptyCart: Cart = { id: "", items: [], subtotal: 0, discount: 0, total: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [stored, setStored] = useState<Cart>(emptyCart);
  const [guest, setGuest] = useState<GuestLine[]>(() => readGuestCart());
  const [loading, setLoading] = useState(false);
  const guestCart = presentGuestCart(guest);
  const guestSubtotal = guestCart.reduce((total, line) => total + line.line_subtotal, 0);
  const guestTotal = guestCart.reduce((total, line) => total + line.line_total, 0);
  const cart = user
    ? stored
    : {
        id: "guest",
        items: guestCart,
        subtotal: guestSubtotal,
        discount: guestSubtotal - guestTotal,
        total: guestTotal,
      };

  useEffect(() => {
    if (!user) {
      setGuest(readGuestCart());
      return;
    }
    let active = true;
    setLoading(true);
    const pending = readGuestCart();
    Promise.all(pending.map((line) => addCartItem(line.product_id, line.variant_id, line.quantity).catch(() => null)))
      .then(() => {
        if (pending.length > 0) {
          writeGuestCart([]);
          setGuest([]);
        }
        return getCart();
      })
      .then((next) => {
        if (active) {
          setStored(next);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStored(emptyCart);
          showToast(apiErrorMessage(error, "The cart could not be loaded."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user, showToast]);

  const fail = useCallback(
    (error: unknown) => {
      showToast(apiErrorMessage(error, "The cart could not be updated."));
    },
    [showToast],
  );

  const addItem = useCallback(
    async (productId: string, variantId: string | null, quantity: number) => {
      if (!user) {
        try {
          const product = await getProduct(productId);
          const variant = variantId ? product.variants.find((entry) => entry.id === variantId) ?? null : null;
          if (variantId && !variant) {
            showToast("Choose a variant");
            return false;
          }
          const listPrice = variant ? variant.price : product.price;
          const unitPrice = sellingPrice(listPrice, variant ? variant.sale_price : product.sale_price);
          const stock = variant ? variant.stock_quantity : product.stock_quantity;
          const current = readGuestCart();
          const id = guestLineId(productId, variantId);
          const existing = current.find((line) => line.id === id);
          const nextQuantity = (existing?.quantity ?? 0) + quantity;
          if (nextQuantity > stock) {
            showToast("Not enough stock");
            return false;
          }
          const line: GuestLine = {
            id,
            product_id: productId,
            variant_id: variantId,
            name: product.name,
            variant_name: variant?.name ?? null,
            sku: variant?.sku ?? product.sku,
            image_url: product.images[0]?.url ?? null,
            quantity: nextQuantity,
            stock_quantity: stock,
            list_price: listPrice,
            unit_price: unitPrice,
          };
          const next = existing ? current.map((entry) => (entry.id === id ? line : entry)) : [...current, line];
          writeGuestCart(next);
          setGuest(next);
          return true;
        } catch (error: unknown) {
          fail(error);
          return false;
        }
      }
      try {
        setStored(await addCartItem(productId, variantId, quantity));
        return true;
      } catch (error: unknown) {
        fail(error);
        return false;
      }
    },
    [fail, showToast, user],
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!user) {
        const next = readGuestCart().map((line) => (line.id === itemId ? { ...line, quantity } : line));
        writeGuestCart(next);
        setGuest(next);
        return;
      }
      try {
        setStored(await updateCartItem(itemId, quantity));
      } catch (error: unknown) {
        fail(error);
      }
    },
    [fail, user],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!user) {
        const next = readGuestCart().filter((line) => line.id !== itemId);
        writeGuestCart(next);
        setGuest(next);
        return;
      }
      try {
        await removeCartItem(itemId);
        setStored(await getCart());
      } catch (error: unknown) {
        fail(error);
      }
    },
    [fail, user],
  );

  const clear = useCallback(async () => {
    if (!user) {
      writeGuestCart([]);
      setGuest([]);
      return;
    }
    try {
      await clearCart();
      setStored(await getCart());
    } catch (error: unknown) {
      fail(error);
    }
  }, [fail, user]);

  const refresh = useCallback(async () => {
    if (!user) {
      return;
    }
    try {
      setStored(await getCart());
    } catch (error: unknown) {
      fail(error);
    }
  }, [fail, user]);

  const value = useMemo(() => {
    const count = cart.items.reduce((total, item) => total + item.quantity, 0);
    return {
      lines: cart.items,
      count,
      subtotal: cart.subtotal,
      discount: cart.discount,
      total: cart.total,
      loading,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      refresh,
    };
  }, [addItem, cart, clear, loading, refresh, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
