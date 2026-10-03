import { api, clearAccessToken, storeAccessToken } from "./api.ts";
import type { AuthToken, RegisterResult, User } from "./types.ts";

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthToken>("/api/auth/login", { email, password });
  storeAccessToken(data.access_token);
  return data;
}

export async function register(fullName: string, email: string, password: string) {
  const { data } = await api.post<RegisterResult>("/api/auth/register", {
    full_name: fullName,
    email,
    password,
  });
  storeAccessToken(data.access_token);
  return data;
}

export async function logout() {
  try {
    await api.post("/api/auth/logout");
  } finally {
    clearAccessToken();
  }
}

export async function getCurrentUser() {
  const { data } = await api.get<User>("/api/auth/me");
  return data;
}
