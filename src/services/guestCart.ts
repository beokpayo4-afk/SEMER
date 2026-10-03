import type { CartItem } from "./cart.ts";

const storageKey = "semer_guest_cart";

export type GuestLine = Omit<CartItem, "line_subtotal" | "line_discount" | "line_total">;

export function guestLineId(productId: string, variantId: string | null) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function readGuestCart(): GuestLine[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuestLine[]) : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(lines: GuestLine[]) {
  localStorage.setItem(storageKey, JSON.stringify(lines));
}

export function presentGuestCart(lines: GuestLine[]): CartItem[] {
  return lines.map((line) => {
    const lineSubtotal = line.list_price * line.quantity;
    const lineTotal = line.unit_price * line.quantity;
    return {
      ...line,
      line_subtotal: lineSubtotal,
      line_discount: lineSubtotal - lineTotal,
      line_total: lineTotal,
    };
  });
}
