import { useWishlist } from "../hooks/useWishlist.ts";

export function WishlistButton({ productId, icon = false }: { productId: string; icon?: boolean }) {
  const { includes, toggle, loading } = useWishlist();
  const saved = includes(productId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      disabled={loading}
      onClick={() => {
        void toggle(productId);
      }}
      className={
        icon
          ? `grid h-9 w-9 place-items-center rounded-full border bg-white text-sm ${saved ? "border-wine text-wine" : "border-line"}`
          : `rounded-full border px-4 py-2 text-sm ${saved ? "border-wine text-wine" : "border-line"}`
      }
    >
      {icon ? (saved ? "♥" : "♡") : saved ? "In wishlist" : "Wishlist"}
    </button>
  );
}
