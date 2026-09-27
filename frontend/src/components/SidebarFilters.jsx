// Left Sidebar Filter Component matching MDB design in screenshot
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, fetchHotels } from '../redux/hotelSlice';

const SidebarFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.hotels.filters);

  // Local state for price inputs
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  // Keep local inputs synced with Redux filter state
  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  // Apply price filter to backend
  const handleApplyPrice = (e) => {
    if (e) e.preventDefault();
    dispatch(
      setFilters({
        minPrice: minPrice,
        maxPrice: maxPrice,
        page: 1, // Reset to first page
      })
    );
    dispatch(fetchHotels());
  };

  // Reset all filters
  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    dispatch(resetFilters());
    dispatch(fetchHotels());
  };

  // Quick category search click
  const handleCategoryClick = (categoryKeyword) => {
    dispatch(
      setFilters({
        search: categoryKeyword,
        page: 1,
      })
    );
    dispatch(fetchHotels());
  };

  return (
    <aside className="mdb-sidebar">
      {/* 1. Related Items / Categories Accordion */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-title">Categories</span>
          <span className="sidebar-chevron">▲</span>
        </div>
        <div className="sidebar-card-body">
          <ul className="category-list">
            <li onClick={() => handleCategoryClick('')}>All Accommodations</li>
            <li onClick={() => handleCategoryClick('Palace')}>Luxury Palaces</li>
            <li onClick={() => handleCategoryClick('Resort')}>Scenic Resorts</li>
            <li onClick={() => handleCategoryClick('Boutique')}>City Boutiques</li>
            <li onClick={() => handleCategoryClick('Villa')}>Beachfront Villas</li>
            <li onClick={() => handleCategoryClick('Mountain')}>Mountain Lodges</li>
          </ul>
        </div>
      </div>

      {/* 2. Amenities / Brands Accordion */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-title">Amenities</span>
          <span className="sidebar-chevron">▲</span>
        </div>
        <div className="sidebar-card-body">
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-label">Free High-Speed Wi-Fi</span>
            <span className="checkbox-count">120</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-label">Swimming Pool</span>
            <span className="checkbox-count">45</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-label">Free Breakfast</span>
            <span className="checkbox-count">85</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-label">Oceanside View</span>
            <span className="checkbox-count">35</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span className="checkbox-label">Spa &amp; Wellness</span>
            <span className="checkbox-count">30</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" />
            <span className="checkbox-label">Airport Shuttle</span>
            <span className="checkbox-count">18</span>
          </label>
        </div>
      </div>

      {/* 3. Price Filter Accordion with Min/Max inputs and APPLY button */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-title">Price</span>
          <span className="sidebar-chevron">▲</span>
        </div>
        <div className="sidebar-card-body">
          {/* Visual track representation */}
          <div className="price-slider-track">
            <div className="slider-bar"></div>
            <div className="slider-handle slider-handle-left"></div>
            <div className="slider-handle slider-handle-right"></div>
          </div>

          <form onSubmit={handleApplyPrice}>
            <div className="price-inputs-row">
              <div className="price-input-col">
                <label className="price-input-label">Min</label>
                <div className="input-prefix-box">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="price-box-input"
                  />
                </div>
              </div>

              <div className="price-input-col">
                <label className="price-input-label">Max</label>
                <div className="input-prefix-box">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="price-box-input"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-sidebar-apply">
              APPLY
            </button>

            {(filters.minPrice || filters.maxPrice || filters.search) && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-sidebar-reset"
              >
                Clear all filters
              </button>
            )}
          </form>
        </div>
      </div>

      {/* 4. Room Types Accordion */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-title">Room Type</span>
          <span className="sidebar-chevron">▲</span>
        </div>
        <div className="sidebar-card-body">
          <div className="badge-buttons-row">
            <span className="size-badge active">DELUXE</span>
            <span className="size-badge">SUITE</span>
            <span className="size-badge">VILLA</span>
            <span className="size-badge">STUDIO</span>
          </div>
        </div>
      </div>

      {/* 5. Ratings Accordion */}
      <div className="sidebar-card">
        <div className="sidebar-card-header">
          <span className="sidebar-title">Ratings</span>
          <span className="sidebar-chevron">▲</span>
        </div>
        <div className="sidebar-card-body ratings-card-body">
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="stars-label">★★★★★</span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="stars-label">★★★★<span className="star-empty">★</span></span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="stars-label">★★★<span className="star-empty">★★</span></span>
          </label>
          <label className="checkbox-item">
            <input type="checkbox" defaultChecked />
            <span className="stars-label">★★<span className="star-empty">★★★</span></span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
