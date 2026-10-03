import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiBaseUrl } from "../services/api.ts";
import { mediaUrl } from "./media.ts";

describe("mediaUrl", () => {
  it("prefixes stored uploads with the API origin", () => {
    assert.equal(mediaUrl("/uploads/products/photo.png"), `${apiBaseUrl}/uploads/products/photo.png`);
  });

  it("leaves external URLs unchanged", () => {
    assert.equal(mediaUrl("https://example.com/photo.png"), "https://example.com/photo.png");
    assert.equal(mediaUrl(null), "");
  });
});
