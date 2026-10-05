import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCatalog.ts";
import { findCategory } from "../utils/categories.ts";
import { ProductImage } from "./ProductImage.tsx";

const slideNames = [
  "Cosmetics",
  "Skincare",
  "Haircare",
  "Perfumes",
  "Toiletries",
  "Personal Care",
  "Clothing",
  "Footwear",
  "Jewellery",
  "Bags",
  "Watches",
  "Fashion Accessories",
];

function HeroSlides() {
  const categories = useCategories();
  const slides = categories.data
    ? slideNames.flatMap((name) => {
        const category = findCategory(categories.data ?? [], name);
        return category?.image_url ? [category] : [];
      })
    : [];
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || slides.length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, slides.length]);

  const active = slides[index] ?? slides[0];

  if (categories.loading && slides.length === 0) {
    return <p className="px-4 py-16 text-sm text-muted">Loading images</p>;
  }
  if (categories.error && slides.length === 0) {
    return <p className="px-4 py-16 text-sm text-wine">{categories.error}</p>;
  }
  if (!active) {
    return <p className="px-4 py-16 text-sm text-muted">Published products will appear here.</p>;
  }

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-sand">
      {slides.map((slide) => {
        const visible = slide.id === active.id;
        return (
          <Link
            key={slide.id}
            to={`/categories/${slide.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
            aria-label={visible ? slide.name : undefined}
          >
            <ProductImage
              src={slide.image_url}
              alt=""
              className={`h-full w-full ${visible && !reducedMotion ? "hero-drift" : ""}`}
            />
          </Link>
        );
      })}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/55 to-transparent p-4">
        <p className="text-sm font-medium text-white">{active.name}</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-wine uppercase">SEMER</p>
          <h1 className="mt-3 max-w-xl text-5xl leading-[1.02] sm:text-6xl">
            Discover Beauty, Fashion &amp; Lifestyle
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted">
            Shop beauty and personal care, fashion, and lifestyle goods. Events are planned from an enquiry and
            confirmed with a quote.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-wine px-5 py-3 text-sm font-medium text-paper hover:bg-wine-dark"
            >
              Shop Now
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full border border-line bg-white px-5 py-3 text-sm font-medium hover:border-ink"
            >
              Explore Services
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-x-6 top-8 bottom-0 rounded-4xl bg-linear-to-br from-sand via-white to-wine/15" />
          <div className="relative p-2 sm:p-4">
            <HeroSlides />
          </div>
        </div>
      </div>
    </section>
  );
}
