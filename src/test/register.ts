import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost:5173/" });
const browser = dom.window;

for (const key of Object.getOwnPropertyNames(browser)) {
  if (key in globalThis) {
    continue;
  }
  Object.defineProperty(globalThis, key, {
    configurable: true,
    get: () => browser[key as keyof typeof browser],
  });
}
