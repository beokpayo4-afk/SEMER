import { useEffect, useState } from "react";
import { getCategories, getCategory, getProduct, getProducts, readCachedCategories } from "../services/catalog.ts";
import type { Category, Product, ProductPage, ProductQuery } from "../services/types.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { isUuid } from "../utils/product.ts";

type RequestState<T> = {
  key: string;
  data: T | null;
  error: string | null;
};

function loadCategories() {
  return getCategories();
}

function loadCategory(key: string) {
  return key ? getCategory(key) : Promise.reject(new Error("Missing category"));
}

function loadProducts(key: string) {
  return getProducts(JSON.parse(key) as ProductQuery);
}

function loadProduct(key: string) {
  return key ? getProduct(key) : Promise.reject(new Error("Missing product"));
}

function useRequest<T>(key: string, load: (activeKey: string) => Promise<T>, fallback: string, active = true) {
  const [state, setState] = useState<RequestState<T>>({ key: "", data: null, error: null });

  useEffect(() => {
    if (!active) {
      return;
    }
    let current = true;
    load(key)
      .then((data) => {
        if (current) {
          setState({ key, data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (current) {
          setState({ key, data: null, error: apiErrorMessage(error, fallback) });
        }
      });
    return () => {
      current = false;
    };
  }, [key, fallback, load, active]);

  if (!active) {
    return { data: null, loading: false, error: null };
  }

  return {
    data: state.key === key ? state.data : null,
    loading: state.key !== key,
    error: state.key === key ? state.error : null,
  };
}

export function useCategories() {
  const request = useRequest<Category[]>("categories", loadCategories, "Categories could not be loaded.");
  const [cached] = useState(readCachedCategories);
  if (request.data) {
    return request;
  }
  if (cached && cached.length > 0) {
    return { data: cached, loading: false, error: null };
  }
  return request;
}

export function useCategory(id: string | undefined) {
  return useRequest<Category>(id ?? "", loadCategory, "This category could not be loaded.");
}

export function useProducts(query: ProductQuery | null) {
  return useRequest<ProductPage>(
    query ? JSON.stringify(query) : "",
    loadProducts,
    "Products could not be loaded.",
    query !== null,
  );
}

export function useProduct(id: string | undefined) {
  const valid = Boolean(id && isUuid(id));
  return useRequest<Product>(valid ? id ?? "" : "", loadProduct, "Product not found.", valid);
}
