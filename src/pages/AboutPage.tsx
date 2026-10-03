import { companyName } from "../utils/company.ts";
import { usePageTitle } from "../hooks/usePageTitle.ts";

export function AboutPage() {
  usePageTitle("About");
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">The company</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">About SEMER</h1>
      <p className="mt-6 text-lg leading-8 text-muted">{companyName} trades across goods and services.</p>
      <div className="mt-10 space-y-6 text-base leading-7">
        <p>
          The shop covers beauty and personal care, fashion, and lifestyle. Cosmetics, skincare, haircare,
          perfumes, toiletries, clothing, footwear, jewellery, bags, watches, and accessories sit in one catalogue.
        </p>
        <p>
          Travel covers domestic trips, international trips, holiday packages, and honeymoon packages. Those are
          quoted and booked separately from the product cart.
        </p>
        <p>
          Event work covers weddings, anniversaries, private parties, planning, decoration, and logistics. An event
          starts as an enquiry, then a quote, then a booking.
        </p>
      </div>
    </article>
  );
}
