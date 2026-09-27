// Component representing an individual hotel item matching the MDB design
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteHotel } from '../redux/hotelSlice';

const HotelCard = ({ hotel, viewMode = 'list' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Truncate description for snippet display
  const snippet =
    hotel.description && hotel.description.length > 130
      ? `${hotel.description.substring(0, 130)}...`
      : hotel.description;

  // Calculate a realistic previous price for visual discount tag
  const basePrice = Number(hotel.price) || 100;
  const originalPrice = (basePrice * 1.25).toFixed(2);

  // Navigate to hotel detail page
  const handleCardClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  // Edit without triggering card click
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/edit/${hotel.id}`);
  };

  // Delete hotel with confirmation
  const handleDelete = (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete "${hotel.title}"?`);
    if (confirmed) {
      dispatch(deleteHotel(hotel.id));
    }
  };

  const imageUrl = hotel.image_path || '/placeholder-hotel.svg';

  return (
    <article
      className={`mdb-hotel-card ${viewMode === 'grid' ? 'grid-mode' : 'list-mode'}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* 1. Left: Image Box */}
      <div className="mdb-card-img-container">
        <img
          src={imageUrl}
          alt={`Photo of ${hotel.title}`}
          className="mdb-card-img"
          loading="lazy"
        />
      </div>

      {/* 2. Middle: Title, Ratings, Description */}
      <div className="mdb-card-details">
        <h2 className="mdb-card-title">{hotel.title}</h2>

        {/* Star Rating row matching the screenshot */}
        <div className="mdb-rating-row">
          <span className="stars-amber">★★★★<span className="star-half">★</span></span>
          <span className="rating-number">4.5</span>
          <span className="rating-orders">154 reviews</span>
        </div>

        <p className="mdb-card-description">{snippet}</p>

        <div className="mdb-location-tag">
          📍 Coordinates: {Number(hotel.latitude).toFixed(3)}, {Number(hotel.longitude).toFixed(3)}
        </div>
      </div>

      {/* 3. Right: Price, Free Cancellation badge, Actions */}
      <div className="mdb-card-actions">
        <div className="mdb-price-box">
          <div className="mdb-price-row">
            <span className="mdb-current-price">${Number(hotel.price).toFixed(2)}</span>
            <span className="mdb-original-price">${originalPrice}</span>
          </div>
          <span className="mdb-free-shipping">Free cancellation</span>
        </div>

        {/* Primary Action Button */}
        <div className="mdb-btn-row">
          <button
            type="button"
            onClick={handleCardClick}
            className="mdb-btn-primary"
          >
            VIEW DETAILS
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Added "${hotel.title}" to your wishlist! ❤️`);
            }}
            className="mdb-btn-wishlist"
            title="Save to Wishlist"
            aria-label="Save to Wishlist"
          >
            ❤️
          </button>
        </div>

        {/* Edit and Delete Management buttons */}
        <div className="mdb-management-row">
          <button
            type="button"
            onClick={handleEdit}
            className="mdb-btn-edit"
            title="Edit hotel details"
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="mdb-btn-delete"
            title="Delete this hotel"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
