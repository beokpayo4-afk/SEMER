import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart.ts";
import { useToast } from "../hooks/useToast.ts";
import type { Product } from "../services/types.ts";
import { formatPaise, sellingPrice } from "../utils/money.ts";
import { activeVariants, productInStock } from "../utils/product.ts";
import { Button } from "./Button.tsx";
import { CartIcon } from "./CartIcon.tsx";
import { ProductImage } from "./ProductImage.tsx";
import { RatingStars } from "./RatingStars.tsx";
import { WishlistButton } from "./WishlistButton.tsx";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const inStock = productInStock(product);
  const needsOption = activeVariants(product).length > 0;
  const price = sellingPrice(product.price, product.sale_price);
  const onSale = product.sale_price !== null && product.sale_price < product.price;
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function addToCart() {
    if (!inStock) {
      return;
    }
    if (needsOption) {
      navigate(`/products/${product.id}`);
      return;
    }
    const added = await addItem(product.id, null, 1);
    if (added) {
      showToast("Added to cart");
    }
  }

  const discount =
    onSale && product.sale_price !== null ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-3">
      <div className="relative">
        {discount > 0 ? (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-wine px-2 py-1 text-xs text-paper">-{discount}%</span>
        ) : null}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={product.id} icon />
        </div>
        <Link to={`/products/${product.id}`} className="group block">
          <div className="aspect-square overflow-hidden rounded-2xl bg-sand">
            <ProductImage
              src={image?.url}
              alt={image?.alt_text || product.name}
              className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
            />
          </div>
        </Link>
      </div>
      <Link to={`/products/${product.id}`}>
        <h3 className="mt-3 text-base leading-snug">{product.name}</h3>
      </Link>
      <div className="mt-2">
        <RatingStars average={product.rating_average} count={product.review_count} />
      </div>
      <p className="mt-2 text-sm">
        <span className="font-medium">{formatPaise(price)}</span>
        {onSale ? <span className="ml-2 text-muted line-through">{formatPaise(product.price)}</span> : null}
      </p>
      <p className={`mt-1 text-xs ${inStock ? "text-muted" : "text-wine"}`}>{inStock ? "In stock" : "Out of stock"}</p>
      <Button className="mt-3 w-full px-3 py-2" disabled={!inStock} onClick={() => void addToCart()}>
        {inStock ? (
          <>
            <CartIcon className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        ) : (
          "Out of stock"
        )}
      </Button>
    </article>
  );
}
