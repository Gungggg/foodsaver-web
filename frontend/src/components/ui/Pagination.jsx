import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button 
        variant="secondary" 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
        Sebelumnnya
      </Button>
      
      <span className="text-gray-600 font-medium">
        Halaman {currentPage} dari {totalPages}
      </span>
      
      <Button 
        variant="secondary" 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        Selanjutnya
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </Button>
    </div>
  );
};

export default Pagination;
