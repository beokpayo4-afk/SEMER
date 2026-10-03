import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { createReview, getReviews, type ReviewPage } from "../services/reviews.ts";
import { apiErrorMessage } from "../utils/errors.ts";
import { Button } from "./Button.tsx";
import { ErrorMessage } from "./ErrorMessage.tsx";
import { Loading } from "./Loading.tsx";
import { RatingStars } from "./RatingStars.tsx";
import { Select } from "./Select.tsx";

export function Reviews({
  productId,
  onSummary,
}: {
  productId: string;
  onSummary?: (page: ReviewPage) => void;
}) {
  const { user } = useAuth();
  const [page, setPage] = useState<ReviewPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getReviews(productId)
      .then((data) => {
        if (active) {
          setPage(data);
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setPage(null);
          setError(apiErrorMessage(caught, "Reviews could not be loaded."));
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
  }, [productId]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setFormError(null);
    try {
      const next = await createReview(productId, Number(rating), comment);
      setPage(next);
      onSummary?.(next);
      setComment("");
    } catch (caught) {
      setFormError(apiErrorMessage(caught, "The review could not be saved."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-12 border-t border-line pt-10">
      <h2 className="text-3xl">Reviews</h2>
      {page ? (
        <div className="mt-3">
          <RatingStars average={page.rating_average} count={page.review_count} />
        </div>
      ) : null}
      {loading ? <Loading label="Loading reviews" /> : null}
      {error ? (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      ) : null}
      {page && page.items.length === 0 ? <p className="mt-4 text-muted">No reviews yet.</p> : null}
      {page && page.items.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {page.items.map((review) => (
            <li key={review.id} className="rounded-3xl border border-line bg-white p-4">
              <p className="text-sm font-medium">{review.author_name}</p>
              <p className="mt-1 text-sm text-muted">{review.rating} out of 5</p>
              {review.comment ? <p className="mt-2 leading-6">{review.comment}</p> : null}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-8 max-w-xl">
        {user ? (
          <form onSubmit={(event) => void submit(event)} className="space-y-4">
            {formError ? <ErrorMessage message={formError} /> : null}
            <Select
              label="Rating"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              options={[5, 4, 3, 2, 1].map((value) => ({ value: String(value), label: `${value} out of 5` }))}
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Comment</span>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                maxLength={2000}
                className="w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-ink"
              />
            </label>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving review" : "Submit review"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-muted">
            <Link to="/login" state={{ from: `/products/${productId}` }} className="text-wine">
              Sign in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>
    </section>
  );
}
