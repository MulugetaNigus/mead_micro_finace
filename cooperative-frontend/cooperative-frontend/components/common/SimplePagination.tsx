'use client';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SimplePagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>
          Showing {startItem} to {endItem} of {totalCount} items
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="px-3 py-1 text-xs text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 text-xs font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
