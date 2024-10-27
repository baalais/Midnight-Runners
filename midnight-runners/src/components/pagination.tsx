import React from 'react';

// Definē PaginationProps interfeisu
interface PaginationProps {
  currentPage: number; // Pašreizējās lapas numurs
  hasPrev: boolean; // Vai ir iepriekšējā lapa
  hasNext: boolean; // Vai ir nākamā lapa
  onPageChange: (page: number) => void; // Funkcija lapas maiņas apstrādei
}

// Pagination komponente
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

export default Pagination; // Eksportē Pagination komponenti
