import { api } from "./api.ts";
import type { Category, Product, ProductPage, ProductQuery } from "./types.ts";

const freshForMs = 30_000;
const fresh = new Map<string, { at: number; data: unknown }>();
const inflight = new Map<string, Promise<unknown>>();

function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = fresh.get(key);
  if (hit && Date.now() - hit.at < freshForMs) {
    return Promise.resolve(hit.data as T);
  }
  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) {
    return pending;
  }
  const request = load()
    .then((data) => {
      fresh.set(key, { at: Date.now(), data });
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });
  inflight.set(key, request);
  return request;
}

export async function getCategories() {
  return once("categories", async () => {
    const { data } = await api.get<Category[]>("/api/categories");
    return data;
  });
}

export async function getCategory(id: string) {
  const { data } = await api.get<Category>(`/api/categories/${id}`);
  return data;
}

export async function getProducts(query: ProductQuery = {}) {
  return once(`products:${JSON.stringify(query)}`, async () => {
    const { data } = await api.get<ProductPage>("/api/products", { params: query });
    return data;
  });
}

export async function getProduct(id: string) {
  const { data } = await api.get<Product>(`/api/products/${id}`);
  return data;
}
