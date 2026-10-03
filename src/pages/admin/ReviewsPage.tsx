import { useEffect, useState } from "react";
import { ErrorMessage } from "../../components/ErrorMessage.tsx";
import { Loading } from "../../components/Loading.tsx";
import { Pagination } from "../../components/Pagination.tsx";
import { usePageTitle } from "../../hooks/usePageTitle.ts";
import { useToast } from "../../hooks/useToast.ts";
import { deleteReview, getAdminReviews, type AdminReviewPage } from "../../services/admin.ts";
import { apiErrorMessage } from "../../utils/errors.ts";

export function ReviewsPage() {
  usePageTitle("Admin reviews");
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<AdminReviewPage | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAdminReviews(page)
      .then((next) => {
        if (active) {
          setResult(next);
          setError("");
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(apiErrorMessage(reason, "Reviews could not be loaded."));
        }
      });
    return () => {
      active = false;
    };
  }, [page]);

  async function remove(reviewId: string) {
    if (!window.confirm("Delete this review?")) {
      return;
    }
    try {
      await deleteReview(reviewId);
      setResult((current) =>
        current
          ? { ...current, items: current.items.filter((item) => item.id !== reviewId), total: current.total - 1 }
          : current,
      );
    } catch (reason: unknown) {
      showToast(apiErrorMessage(reason, "The review could not be deleted."));
    }
  }

  return (
    <section className="px-4 py-8 sm:px-6">
      <h1 className="text-4xl">Reviews</h1>
      {error ? <ErrorMessage message={error} /> : null}
      {!result && !error ? <Loading label="Loading reviews" /> : null}
      {result && result.items.length === 0 ? <p className="mt-6 text-muted">No reviews yet.</p> : null}
      <ul className="mt-4 space-y-3">
        {result?.items.map((review) => (
          <li key={review.id} className="rounded-3xl border border-line bg-white p-4 text-sm">
            <p>
              {review.product_name} · {review.rating}/5 · {review.author_name}
            </p>
            {review.comment ? <p className="mt-2 text-muted">{review.comment}</p> : null}
            <button type="button" className="mt-3 text-wine" onClick={() => void remove(review.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {result ? <Pagination page={page} pageSize={20} total={result.total} onPage={setPage} /> : null}
    </section>
  );
}
