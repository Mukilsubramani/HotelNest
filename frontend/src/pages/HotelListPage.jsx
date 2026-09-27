// Hotel List Page
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../redux/hotelSlice';
import SidebarFilters from '../components/SidebarFilters';
import HotelList from '../components/HotelList';
import Pagination from '../components/Pagination';

const HotelListPage = () => {
  const dispatch = useDispatch();
  const { hotels, totalCount, loading, error, filters } = useSelector(
    (state) => state.hotels
  );

  // View mode: 'list' (default) or 'grid'
  const [viewMode, setViewMode] = useState('list');
  const [sortOption, setSortOption] = useState('best');

  // Fetch hotels on mount
  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  // Client-side sort options (maintaining backend records)
  const sortedHotels = [...hotels].sort((a, b) => {
    if (sortOption === 'low') return Number(a.price) - Number(b.price);
    if (sortOption === 'high') return Number(b.price) - Number(a.price);
    if (sortOption === 'title') return a.title.localeCompare(b.title);
    return 0; // default order
  });

  return (
    <main className="mdb-main-wrapper">
      <Helmet>
        <title>Hotels &amp; Luxury Stays | Hotel Nest</title>
        <meta
          name="description"
          content="Explore, search and compare top luxury hotels, resorts, and vacation stays on Hotel Nest."
        />
      </Helmet>

      {/* 1. Deep Royal Blue Banner matching the screenshot */}
      <section className="mdb-hero-banner">
        <div className="mdb-banner-container">
          <h1 className="mdb-banner-title">
            {filters.search ? `Search: "${filters.search}"` : 'Hotels & Luxury Stays'}
          </h1>
          <nav className="mdb-breadcrumb" aria-label="breadcrumb">
            <span className="crumb-link">Home</span>
            <span className="crumb-separator">&gt;</span>
            <span className="crumb-link">Hotels</span>
            <span className="crumb-separator">&gt;</span>
            <span className="crumb-current">List</span>
          </nav>
        </div>
      </section>

      {/* 2. Main 2-Column Content Container */}
      <div className="mdb-content-container">
        {/* Left Sidebar Filter Column */}
        <SidebarFilters />

        {/* Right Product/Hotel Listings Column */}
        <section className="mdb-listings-column">
          {/* Listings Top Bar matching screenshot */}
          <div className="mdb-listings-topbar">
            <div className="mdb-items-count">
              <strong>{totalCount}</strong> {totalCount === 1 ? 'Item found' : 'Items found'}
            </div>

            <div className="mdb-topbar-controls">
              {/* Sort selector dropdown */}
              <div className="mdb-sort-wrapper">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="mdb-sort-select"
                  aria-label="Sort hotels"
                >
                  <option value="best">Best match</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              {/* View Toggle buttons (Grid / List) */}
              <div className="mdb-view-toggle">
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  aria-label="Grid view"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  aria-label="List view"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Cards List or Grid */}
          <HotelList
            hotels={sortedHotels}
            loading={loading}
            error={error}
            viewMode={viewMode}
          />

          {/* Centered Pagination */}
          <Pagination />
        </section>
      </div>
    </main>
  );
};

export default HotelListPage;
