"use client";

function getVisiblePages(currentPage, totalPages, siblingCount = 1) {
  const pages = [];
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);

  pages.push(1);

  if (start > 2) {
    pages.push("left-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  pageSize = 20,
  siblingCount = 1,
}) {
  if (!totalPages || totalPages < 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages, siblingCount);

  const baseButtonClass =
    "h-9 min-w-9 px-3 rounded-md border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <p>
          Showing <span className="font-semibold">{startItem}</span>-
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </p>
        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${baseButtonClass} bg-white text-gray-700 hover:bg-gray-100`}
            aria-label="First page"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${baseButtonClass} bg-white text-gray-700 hover:bg-gray-100`}
            aria-label="Previous page"
          >
            Prev
          </button>

          {visiblePages.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`${baseButtonClass} ${
                  currentPage === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={currentPage === item ? "page" : undefined}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                className="flex h-9 min-w-9 items-center justify-center px-2 text-gray-500"
              >
                ...
              </span>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${baseButtonClass} bg-white text-gray-700 hover:bg-gray-100`}
            aria-label="Next page"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${baseButtonClass} bg-white text-gray-700 hover:bg-gray-100`}
            aria-label="Last page"
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}
