import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { CartIcon } from "../components/CartIcon.tsx";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Loading } from "../components/Loading.tsx";
import { ProductImage } from "../components/ProductImage.tsx";
import { RatingStars } from "../components/RatingStars.tsx";
import { Reviews } from "../components/Reviews.tsx";
import { WishlistButton } from "../components/WishlistButton.tsx";
import { useCart } from "../hooks/useCart.ts";
import { useProduct } from "../hooks/useCatalog.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { useToast } from "../hooks/useToast.ts";
import { formatPaise, sellingPrice } from "../utils/money.ts";
import { isUuid, variantStock } from "../utils/product.ts";

export function ProductPage() {
  const { id = "" } = useParams();
  const validId = isUuid(id);
  const productState = useProduct(validId ? id : undefined);
  const product = productState.data;
  usePageTitle(product?.name ?? "Product");
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [summary, setSummary] = useState<{ average: number | null; count: number } | null>(null);

  const activeVariants = useMemo(
    () => product?.variants.filter((variant) => variant.is_active) ?? [],
    [product],
  );
  const selected = activeVariants.find((variant) => variant.id === variantId) ?? null;
  const listPrice = selected?.price ?? product?.price ?? 0;
  const salePrice = selected ? selected.sale_price : (product?.sale_price ?? null);
  const price = sellingPrice(listPrice, salePrice);
  const onSale = salePrice !== null && salePrice < listPrice;
  const stock = product ? variantStock(product, selected) : 0;
  const needsOption = activeVariants.length > 0 && !selected;
  const images = product?.images ?? [];
  const image = images[imageIndex] ?? images[0];

  function changeQuantity(next: number) {
    const limit = Math.max(stock, 1);
    setQuantity(Math.min(limit, Math.max(1, next)));
  }

  async function addToCart() {
    if (!product || stock < 1 || needsOption) {
      return false;
    }
    const added = await addItem(product.id, selected?.id ?? null, quantity);
    if (added) {
      showToast("Added to cart");
    }
    return added;
  }

  if (!validId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ErrorMessage message="Product not found." />
        <Link to="/shop" className="mt-4 inline-block text-sm text-wine">
          Back to the shop
        </Link>
      </div>
    );
  }
  if (productState.loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Loading label="Loading product" />
      </div>
    );
  }
  if (productState.error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ErrorMessage message={productState.error ?? "Product not found."} />
        <Link to="/shop" className="mt-4 inline-block text-sm text-wine">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-4/5 overflow-hidden rounded-3xl border border-line bg-sand">
            <ProductImage src={image?.url} alt={image?.alt_text || product.name} className="h-full w-full" />
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-auto">
              {images.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border ${index === imageIndex ? "border-ink" : "border-line"}`}
                >
                  <ProductImage src={item.url} alt={item.alt_text || ""} className="h-full w-full" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div>
          <Link to={`/categories/${product.category.id}`} className="text-xs tracking-[0.16em] text-muted uppercase">
            {product.category.name}
          </Link>
          <h1 className="mt-3 text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3">
            <RatingStars
              average={summary?.average ?? product.rating_average}
              count={summary?.count ?? product.review_count}
            />
          </div>
          {product.brand ? <p className="mt-2 text-muted">{product.brand}</p> : null}
          <p className="mt-6 text-2xl">
            {formatPaise(price)}
            {onSale ? <span className="ml-3 text-base text-muted line-through">{formatPaise(listPrice)}</span> : null}
          </p>
          <p className="mt-6 max-w-xl leading-7 text-muted">{product.description}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-32 text-muted">SKU</dt>
              <dd>{selected?.sku ?? product.sku}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-32 text-muted">Available stock</dt>
              <dd className={stock < 1 ? "text-wine" : undefined}>{stock < 1 ? "Out of stock" : stock}</dd>
            </div>
          </dl>
          {activeVariants.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Variants</p>
              <div className="flex flex-wrap gap-2">
                {activeVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm ${variantId === variant.id ? "border-ink bg-ink text-paper" : "border-line"} ${variant.stock_quantity < 1 ? "opacity-60" : ""}`}
                  >
                    {variant.name}
                    {variant.stock_quantity < 1 ? " · Out of stock" : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white">
              <button
                type="button"
                className="px-3 py-2 text-sm"
                disabled={stock < 1 || quantity <= 1}
                onClick={() => changeQuantity(quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={Math.max(stock, 1)}
                value={quantity}
                disabled={stock < 1}
                aria-label="Quantity"
                onChange={(event) => changeQuantity(Number(event.target.value) || 1)}
                className="w-14 border-0 bg-transparent text-center outline-none"
              />
              <button
                type="button"
                className="px-3 py-2 text-sm"
                disabled={stock < 1 || quantity >= stock}
                onClick={() => changeQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <Button disabled={stock < 1 || needsOption} onClick={() => void addToCart()}>
              {stock < 1 ? (
                "Out of stock"
              ) : (
                <>
                  <CartIcon className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              disabled={stock < 1 || needsOption}
              onClick={() => {
                void addToCart().then((added) => {
                  if (added) {
                    navigate("/checkout");
                  }
                });
              }}
            >
              Buy Now
            </Button>
            <WishlistButton productId={product.id} />
          </div>
          {needsOption ? <p className="mt-3 text-sm text-muted">Choose a variant before adding it to the cart.</p> : null}
        </div>
      </div>
      <Reviews
        productId={product.id}
        onSummary={(page) => setSummary({ average: page.rating_average, count: page.review_count })}
      />
    </article>
  );
}
