import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPaise, rupeesToPaise, sellingPrice } from "./money.ts";

describe("money", () => {
  it("formats paise in rupees", () => {
    assert.match(formatPaise(150000), /1,500/);
    assert.match(formatPaise(150050), /1,500\.50/);
  });

  it("converts rupee input to paise", () => {
    assert.equal(rupeesToPaise("45"), 4500);
    assert.equal(rupeesToPaise(" "), undefined);
    assert.equal(rupeesToPaise("-1"), undefined);
    assert.equal(rupeesToPaise("nope"), undefined);
  });

  it("uses the sale price when one is set", () => {
    assert.equal(sellingPrice(150000, 120000), 120000);
    assert.equal(sellingPrice(150000, null), 150000);
  });
});
