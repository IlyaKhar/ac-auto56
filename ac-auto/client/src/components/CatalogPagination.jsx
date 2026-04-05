/**
 * Собирает номера страниц с многоточием (1 2 3 4 5 … 14).
 */
function buildPageItems(current, total) {
  if (total <= 1) return { numbers: [1], showPrev: false, showNext: false };
  if (total <= 9) {
    return {
      numbers: Array.from({ length: total }, (_, i) => i + 1),
      showPrev: current > 1,
      showNext: current < total,
    };
  }
  const set = new Set([1, total, current, current - 1, current + 1]);
  for (let p = 2; p <= Math.min(5, total - 1); p++) set.add(p);
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("ellipsis");
    out.push(p);
    prev = p;
  }
  return { numbers: out, showPrev: current > 1, showNext: current < total };
}

/**
 * Пагинация каталога: рамка у активной страницы, стрелки, серые неактивные.
 */
export function CatalogPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages < 1) return null;

  const { numbers, showPrev, showNext } = buildPageItems(currentPage, totalPages);

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2" aria-label="Страницы каталога">
      {showPrev ? (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-9 min-w-[2.25rem] items-center justify-center text-lg text-neutral-400 transition hover:text-neutral-700"
          aria-label="Предыдущая страница"
        >
          ←
        </button>
      ) : null}

      {numbers.map((item, i) =>
        item === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex h-9 min-w-[2.25rem] items-center justify-center text-sm font-medium transition ${
              item === currentPage
                ? "rounded border-2 border-ac-bright-orange text-neutral-900"
                : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            {item}
          </button>
        ),
      )}

      {showNext ? (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-9 min-w-[2.25rem] items-center justify-center text-lg text-neutral-400 transition hover:text-neutral-700"
          aria-label="Следующая страница"
        >
          →
        </button>
      ) : null}
    </nav>
  );
}
