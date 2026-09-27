// Pagination matching the MDB design in screenshot
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, fetchHotels } from '../redux/hotelSlice';

const Pagination = () => {
  const dispatch = useDispatch();
  const { totalCount, filters } = useSelector((state) => state.hotels);
  const { page, limit } = filters;

  const totalPages = Math.ceil(totalCount / limit);

  // If there are 0 or 1 pages, don't show pagination
  if (totalPages <= 1) return null;

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      dispatch(setPage(newPage));
      dispatch(fetchHotels());
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mdb-pagination" aria-label="Page navigation">
      {/* Previous button */}
      <button
        type="button"
        className="mdb-page-item"
        disabled={page === 1}
        onClick={() => handlePageClick(page - 1)}
        aria-label="Previous"
      >
        &laquo;
      </button>

      {/* Numbered page items */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          type="button"
          className={`mdb-page-item ${num === page ? 'active' : ''}`}
          onClick={() => handlePageClick(num)}
        >
          {num}
        </button>
      ))}

      {/* Next button */}
      <button
        type="button"
        className="mdb-page-item"
        disabled={page === totalPages}
        onClick={() => handlePageClick(page + 1)}
        aria-label="Next"
      >
        &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
