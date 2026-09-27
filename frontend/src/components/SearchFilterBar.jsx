// Component for search by title and price range filtering
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, fetchHotels } from '../redux/hotelSlice';

const SearchFilterBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.hotels.filters);

  // Local form state for search and price inputs
  const [search, setSearch] = useState(filters.search);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  // Apply filters on form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        search,
        minPrice,
        maxPrice,
        page: 1, // Reset to page 1 on new filter
      })
    );
    dispatch(fetchHotels());
  };

  // Reset all filters
  const handleReset = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    dispatch(resetFilters());
    dispatch(fetchHotels());
  };

  return (
    <div className="search-filter-card">
      <form onSubmit={handleSubmit} className="filter-form">
        {/* Title Search Input */}
        <div className="filter-group search-group">
          <label htmlFor="search-title" className="filter-label">
            Search Hotels
          </label>
          <input
            id="search-title"
            type="text"
            className="input-field"
            placeholder="Search by hotel title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Min Price Input */}
        <div className="filter-group price-group">
          <label htmlFor="min-price" className="filter-label">
            Min Price ($)
          </label>
          <input
            id="min-price"
            type="number"
            min="0"
            className="input-field"
            placeholder="e.g. 50"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max Price Input */}
        <div className="filter-group price-group">
          <label htmlFor="max-price" className="filter-label">
            Max Price ($)
          </label>
          <input
            id="max-price"
            type="number"
            min="0"
            className="input-field"
            placeholder="e.g. 300"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button type="submit" className="btn btn-primary">
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterBar;
