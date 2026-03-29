'use client';

import { Button } from '@/components/ui/button';

import { PaginationProps } from '@/types/components';

export function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    let pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-8 border-t border-neutral-100" role="navigation" aria-label="Pagination Navigation">
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        aria-label="Previous Page"
        className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer disabled:opacity-30 p-2"
      >
        Previous
      </Button>
      <div className="flex gap-2 items-center" aria-label="Page selection">
        {getPages().map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
            disabled={page === '...'}
            aria-label={typeof page === 'number' ? `Go to Page ${page}` : "Ellipsis"}
            aria-current={currentPage === page ? "page" : undefined}
            className={`h-8 min-w-8 px-2 flex items-center justify-center rounded-lg transition-all text-xs font-black ${
              currentPage === page 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' 
                : page === '...' 
                  ? 'text-neutral-400 cursor-default bg-transparent hover:bg-transparent' 
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:text-neutral-900 hover:border-sky-500/30 shadow-sm cursor-pointer'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        aria-label="Next Page"
        className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer disabled:opacity-30 p-2"
      >
        Next
      </Button>
    </div>
  );
}

