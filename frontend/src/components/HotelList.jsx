// Hotel List Container matching MDB design
import React from 'react';
import HotelCard from './HotelCard';

const HotelList = ({ hotels, loading, error, viewMode = 'list' }) => {
  if (loading) {
    return (
      <div className="mdb-loading-box">
        <div className="mdb-spinner"></div>
        <p>Loading accommodations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mdb-alert-box error">
        <p>⚠️ Error loading hotels: {error}</p>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="mdb-empty-state">
        <span className="empty-icon">🏖️</span>
        <h3>No hotels found</h3>
        <p>Try clearing your price filters or search keywords in the sidebar.</p>
      </div>
    );
  }

  return (
    <div className={`mdb-hotels-container ${viewMode === 'grid' ? 'grid-layout' : 'list-layout'}`}>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default HotelList;
