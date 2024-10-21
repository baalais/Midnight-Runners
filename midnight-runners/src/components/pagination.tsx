// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void; // Funkcija lapas maiņas apstrādei
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, hasPrev, hasNext, onPageChange }) => {
  return (
    <div className="flex justify-center mt-4">
      {/* Iepriekšējā lapa poga, ja ir iepriekšējā lapa */}
      {hasPrev && (
        <button onClick={() => onPageChange(currentPage - 1)} className="px-4 py-2 border rounded-lg mr-2">
          Previous
        </button>
      )}
      {/* Pašreizējās lapas numura attēlošana */}
      <span className="px-4">{`Page ${currentPage}`}</span>
      {/* Nākamās lapas poga, ja ir nākamā lapa */}
      {hasNext && (
        <button onClick={() => onPageChange(currentPage + 1)} className="px-4 py-2 border rounded-lg ml-2">
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
