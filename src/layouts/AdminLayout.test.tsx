import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "../context/auth-context.ts";
import { ToastProvider } from "../context/ToastProvider.tsx";
import type { User } from "../services/types.ts";
import { AdminLayout } from "./AdminLayout.tsx";

function auth(user: User | null, loading = false): AuthContextValue {
  return {
    user,
    loading,
    login: async () => undefined,
    register: async () => undefined,
    logout: async () => undefined,
  };
}

function renderAdmin(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <ToastProvider>
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route path="/login" element={<h1>Sign in</h1>} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<h1>Dashboard</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
      </ToastProvider>
    </AuthContext.Provider>,
  );
}

afterEach(() => {
  cleanup();
});

const customer: User = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "buyer@example.com",
  full_name: "Buyer",
  role: "CUSTOMER",
  is_active: true,
};

describe("AdminLayout", () => {
  it("sends a guest to sign in", () => {
    renderAdmin(auth(null));
    assert.equal(screen.getByRole("heading", { name: "Sign in" }).textContent, "Sign in");
  });

  it("blocks a customer", () => {
    renderAdmin(auth(customer));
    assert.equal(screen.getByRole("heading", { name: "Administrators only" }).textContent, "Administrators only");
  });

  it("shows the dashboard to an administrator", () => {
    renderAdmin(auth({ ...customer, role: "ADMIN", email: "admin@example.com" }));
    assert.equal(screen.getByRole("heading", { name: "Dashboard" }).textContent, "Dashboard");
    assert.ok(screen.getByRole("link", { name: "Orders" }));
  });
});
