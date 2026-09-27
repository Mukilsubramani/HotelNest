// Navigation bar with search and shortcuts
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, fetchHotels } from '../redux/hotelSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentSearch = useSelector((state) => state.hotels.filters.search);

  const [searchTerm, setSearchTerm] = useState(currentSearch || '');

  // Handle search submission from top search bar
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm, page: 1 }));
    dispatch(fetchHotels());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="mdb-navbar">
      <div className="mdb-navbar-inner">
        {/* Brand Logo with Hotel Nest branding */}
        <Link to="/" className="mdb-brand">
          <img src="/hotel-favicon.jpg" alt="Hotel Nest Logo" className="brand-logo-img" />
          <span className="brand-nest-title">Hotel Nest</span>
        </Link>

        {/* Center Search Bar with attached blue search button */}
        <form onSubmit={handleSearchSubmit} className="mdb-search-form">
          <input
            type="text"
            className="mdb-search-input"
            placeholder="Search hotel by title, city or amenity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="mdb-search-btn" aria-label="Search">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* Right Action Icons matching the screenshot (Sign in, Wishlist, Add Hotel) */}
        <div className="mdb-nav-actions">
          <Link to="/" className="mdb-action-item">
            <span className="action-icon">🏨</span>
            <span className="action-label">All Hotels</span>
          </Link>
          <div className="mdb-action-item wishlist-item">
            <span className="action-icon">❤️</span>
            <span className="action-label">Wishlist</span>
          </div>
          <Link to="/add" className="mdb-btn-add-hotel">
            <span className="add-icon">➕</span>
            <span>Add Hotel</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
