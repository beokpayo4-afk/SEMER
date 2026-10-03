import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { useToast } from "../hooks/useToast.ts";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../services/wishlist.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { WishlistContext } from "./wishlist-context.ts";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const ids = user ? savedIds : [];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    let active = true;
    setLoading(true);
    getWishlist()
      .then((productIds) => {
        if (active) {
          setSavedIds(productIds);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setSavedIds([]);
          showToast(apiErrorMessage(error, "The wishlist could not be loaded."));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user, showToast]);

  const toggle = useCallback(
    async (productId: string) => {
      if (!user) {
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }
      const saved = ids.includes(productId);
      const next = saved
        ? ids.filter((id) => id !== productId)
        : [...ids, productId];
      setSavedIds(next);
      try {
        const productIds = saved ? await removeThenList(productId) : await addWishlistItem(productId);
        setSavedIds(productIds);
      } catch (error: unknown) {
        setSavedIds(ids);
        showToast(apiErrorMessage(error, "The wishlist could not be updated."));
      }
    },
    [ids, navigate, showToast, user],
  );

  const value = useMemo(
    () => ({
      ids,
      loading,
      includes: (productId: string) => ids.includes(productId),
      toggle,
    }),
    [ids, loading, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

async function removeThenList(productId: string) {
  await removeWishlistItem(productId);
  return getWishlist();
}
