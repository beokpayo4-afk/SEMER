import { useEffect, useMemo, useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context.ts";
import * as authApi from "../services/auth.ts";
import { clearAccessToken, readAccessToken } from "../services/api.ts";
import type { User } from "../services/types.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => Boolean(readAccessToken()));

  useEffect(() => {
    if (!readAccessToken()) {
      return;
    }
    let active = true;
    authApi
      .getCurrentUser()
      .then((current) => {
        if (active) {
          setUser(current);
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearAccessToken();
        }
        setUser(null);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email: string, password: string) {
        await authApi.login(email, password);
        setUser(await authApi.getCurrentUser());
      },
      async register(fullName: string, email: string, password: string) {
        const result = await authApi.register(fullName, email, password);
        setUser(result.user);
      },
      async logout() {
        await authApi.logout();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
