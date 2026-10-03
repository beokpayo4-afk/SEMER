import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "../context/auth-context.ts";
import { LoginPage } from "./LoginPage.tsx";

function renderLogin(login: AuthContextValue["login"]) {
  const value: AuthContextValue = {
    user: null,
    loading: false,
    login,
    register: async () => undefined,
    logout: async () => undefined,
  };
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={[{ pathname: "/login", state: { from: "/admin" } }]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<h1>Dashboard</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

afterEach(() => {
  cleanup();
});

describe("LoginPage", () => {
  it("shows the API message when credentials are rejected", async () => {
    const error = new axios.AxiosError("Request failed");
    error.response = {
      data: { detail: "Invalid email or password" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };
    const calls: Array<[string, string]> = [];
    const login = async (email: string, password: string) => {
      calls.push([email, password]);
      throw error;
    };
    const user = userEvent.setup();
    renderLogin(login);

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    assert.deepEqual(calls, [["admin@example.com", "wrong-password"]]);
    assert.equal(screen.getByRole("alert").textContent, "Invalid email or password");
  });

  it("opens the page the user was trying to reach", async () => {
    const login = async () => undefined;
    const user = userEvent.setup();
    renderLogin(login);

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "Secret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    assert.equal(screen.getByRole("heading", { name: "Dashboard" }).textContent, "Dashboard");
  });
});
