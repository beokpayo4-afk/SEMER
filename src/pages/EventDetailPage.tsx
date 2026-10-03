import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage.tsx";
import { Loading } from "../components/Loading.tsx";
import { ProductImage } from "../components/ProductImage.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { eventCategoryLabel, getEventService, type EventService } from "../services/events.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { isUuid } from "../utils/product.ts";

export function EventDetailPage() {
  const { id = "" } = useParams();
  const validId = isUuid(id);
  const [service, setService] = useState<EventService | null>(null);
  const [loading, setLoading] = useState(validId);
  const [error, setError] = useState("");
  usePageTitle(service?.title ?? "Event service");

  useEffect(() => {
    if (!validId) {
      return;
    }
    let active = true;
    setLoading(true);
    getEventService(id)
      .then((next) => {
        if (active) {
          setService(next);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setService(null);
          setError(apiErrorMessage(reason, "Service not found."));
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
  }, [id, validId]);

  if (!validId || (!loading && (error || !service))) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorMessage message="Service not found." />
        <Link to="/events" className="mt-4 inline-block text-wine">
          Back to events
        </Link>
      </section>
    );
  }

  if (loading || !service) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Loading label="Loading service" />
      </section>
    );
  }

  const image = service.images[0];

  return (
    <article className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <Link to="/events" className="text-sm text-muted">
          Events
        </Link>
        <p className="mt-4 text-xs tracking-[0.14em] text-muted uppercase">{eventCategoryLabel(service.category)}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{service.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{service.description}</p>
        {service.services ? (
          <section className="mt-8">
            <h2 className="text-2xl">Services</h2>
            <p className="mt-2 whitespace-pre-line leading-7">{service.services}</p>
          </section>
        ) : null}
      </div>
      <div>
        <ProductImage src={image?.url} alt={image?.alt_text || service.title} className="aspect-4/3 w-full rounded-3xl" />
        <Link
          to={`/events/enquire?service=${service.id}`}
          className="mt-6 inline-flex rounded-full bg-wine px-5 py-2.5 text-sm text-paper"
        >
          Enquire
        </Link>
        <p className="mt-3 text-sm text-muted">The reply is a quote. Nothing is booked until you accept it.</p>
      </div>
    </article>
  );
}
