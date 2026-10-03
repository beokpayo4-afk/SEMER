export function RatingStars({
  average,
  count,
}: {
  average: number | null;
  count: number;
}) {
  if (!count || average === null) {
    return <p className="text-xs text-muted">No reviews</p>;
  }
  const filled = Math.round(average);
  return (
    <p className="text-xs text-muted" aria-label={`${average} out of 5 from ${count} reviews`}>
      <span className="tracking-wide text-ink" aria-hidden="true">
        {"●".repeat(filled)}
        {"○".repeat(5 - filled)}
      </span>
      <span className="ml-2">
        {average.toFixed(1)} ({count})
      </span>
    </p>
  );
}
