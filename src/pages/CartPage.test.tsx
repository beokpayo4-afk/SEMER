import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "../context/auth-context.ts";
import { CartContext, type CartContextValue } from "../context/cart-context.ts";
import type { User } from "../services/types.ts";
import { CartPage } from "./CartPage.tsx";

const customer: User = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "buyer@example.com",
  full_name: "Buyer",
  role: "CUSTOMER",
  is_active: true,
};

function cart(lines: CartContextValue["lines"] = []): CartContextValue {
  return {
    lines,
    count: lines.length,
    subtotal: 0,
    discount: 0,
    total: 0,
    loading: false,
    addItem: async () => true,
    updateQuantity: async () => undefined,
    removeItem: async () => undefined,
    clear: async () => undefined,
    refresh: async () => undefined,
  };
}

function renderCart(user: User | null, value = cart()) {
  const auth: AuthContextValue = {
    user,
    loading: false,
    login: async () => undefined,
    register: async () => undefined,
    logout: async () => undefined,
  };
  return render(
    <AuthContext.Provider value={auth}>
      <CartContext.Provider value={value}>
        <MemoryRouter>
          <CartPage />
        </MemoryRouter>
      </CartContext.Provider>
    </AuthContext.Provider>,
  );
}

afterEach(() => {
  cleanup();
});

describe("CartPage", () => {
  it("shows an empty cart for a guest", () => {
    renderCart(null);
    assert.equal(screen.getByText("Your cart is empty.").textContent, "Your cart is empty.");
  });

  it("shows an empty cart", () => {
    renderCart(customer);
    assert.equal(screen.getByText("Your cart is empty.").textContent, "Your cart is empty.");
  });

  it("shows the line price from the cart state", () => {
    renderCart(
      customer,
      cart([
        {
          id: "line-1",
          product_id: customer.id,
          variant_id: null,
          name: "Rose Serum",
          variant_name: null,
          sku: "SKU-1",
          image_url: null,
          quantity: 2,
          unit_price: 120000,
          list_price: 150000,
          line_subtotal: 300000,
          line_discount: 60000,
          line_total: 240000,
          stock_quantity: 4,
        },
      ]),
    );
    assert.ok(screen.getByText("Rose Serum"));
    assert.match(screen.getByText(/1,200/).textContent ?? "", /1,200/);
  });
});
