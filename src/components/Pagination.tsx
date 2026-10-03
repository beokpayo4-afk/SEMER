type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
};

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) {
    return null;
  }
  return (
    <nav className="mt-10 flex items-center justify-between gap-4 text-sm" aria-label="Pagination">
      <button
        type="button"
        className="rounded-full border border-line px-4 py-2 disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Previous
      </button>
      <p className="text-muted">
        Page {page} of {pages}
      </p>
      <button
        type="button"
        className="rounded-full border border-line px-4 py-2 disabled:opacity-40"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
