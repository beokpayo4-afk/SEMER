import { Link } from "react-router-dom";
import type { ServiceOffer } from "../content/services.ts";

export function OfferList({
  offers,
  basePath,
  eyebrow,
  title,
  intro,
}: {
  offers: ServiceOffer[];
  basePath: string;
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">{eyebrow}</p>
      <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">{intro}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {offers.map((offer) => (
          <Link
            key={offer.slug}
            to={`${basePath}/${offer.slug}`}
            className="rounded-3xl border border-line bg-white p-6 transition hover:border-ink"
          >
            <h2 className="text-3xl">{offer.title}</h2>
            <p className="mt-3 leading-7 text-muted">{offer.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
