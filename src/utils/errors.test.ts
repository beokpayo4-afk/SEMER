import assert from "node:assert/strict";
import { describe, it } from "node:test";
import axios from "axios";
import { apiErrorMessage } from "./errors.ts";

describe("apiErrorMessage", () => {
  it("returns the API detail for an axios error", () => {
    const error = new axios.AxiosError("Request failed");
    error.response = {
      data: { detail: "Invalid email or password" },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };
    assert.equal(apiErrorMessage(error, "Sign in failed."), "Invalid email or password");
  });

  it("returns the fallback for other failures", () => {
    assert.equal(apiErrorMessage(new Error("network"), "Sign in failed."), "Sign in failed.");
  });

  it("explains when the API cannot be reached", () => {
    const error = new axios.AxiosError("Network Error");
    error.request = {};
    assert.match(apiErrorMessage(error, "The package could not be saved."), /server could not be reached/i);
  });

  it("shows field messages from a validation error", () => {
    const error = new axios.AxiosError("Request failed");
    error.response = {
      data: { detail: [{ loc: ["body", "slug"], msg: "Value error, Slug must use lowercase letters, numbers, and hyphens" }] },
      status: 422,
      statusText: "Unprocessable Entity",
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };
    assert.equal(
      apiErrorMessage(error, "The package could not be saved."),
      "slug: Slug must use lowercase letters, numbers, and hyphens",
    );
  });
});
