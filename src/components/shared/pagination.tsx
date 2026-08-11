"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-foreground/30 px-3 py-1.5 text-sm text-foreground/70 transition hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-foreground/90"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`size-9 rounded-lg text-sm font-medium transition ${
            p === page
              ? "bg-foreground text-white"
              : "border border-foreground/30 text-foreground/70 hover:bg-foreground/10 dark:hover:bg-foreground/90"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-foreground/30 px-3 py-1.5 text-sm text-foreground/70 transition hover:bg-foreground/10 disabled:pointer-events-none disabled:opacity-40 dark:hover:bg-foreground/90"
      >
        Next
      </button>
    </div>
  );
}
