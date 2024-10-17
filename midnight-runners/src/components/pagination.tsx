// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void; // Function to handle page changes
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, hasPrev, hasNext, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      {hasPrev && (
        <button onClick={() => onPageChange(currentPage - 1)} className="px-4 py-2 border rounded-lg mr-2">
          Previous
        </button>
      )}
      <span className="px-4">{`Page ${currentPage}`}</span>
      {hasNext && (
        <button onClick={() => onPageChange(currentPage + 1)} className="px-4 py-2 border rounded-lg ml-2">
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
