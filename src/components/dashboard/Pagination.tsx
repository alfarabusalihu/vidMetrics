'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 pt-8 border-t border-neutral-900/50">
      <Button
        variant="ghost"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev: number) => prev - 1)}
        className="text-neutral-500 hover:text-white cursor-pointer disabled:opacity-30 p-2"
      >
        Previous
      </Button>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`h-2 w-2 rounded-full transition-all cursor-pointer ${currentPage === i + 1 ? 'w-8 bg-orange-500' : 'bg-neutral-800 hover:bg-neutral-600'}`}
          />
        ))}
      </div>
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev: number) => prev + 1)}
        className="text-neutral-500 hover:text-white cursor-pointer disabled:opacity-30 p-2"
      >
        Next
      </Button>
    </div>
  );
}
