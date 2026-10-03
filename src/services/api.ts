import axios from "axios";

const configured = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiBaseUrl = configured.replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});

const tokenKey = "semer_access_token";

export function readAccessToken() {
  return localStorage.getItem(tokenKey);
}

export function storeAccessToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

export function clearAccessToken() {
  localStorage.removeItem(tokenKey);
}

api.interceptors.request.use((config) => {
  const token = readAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
