// Hotel Detail Page with location map and booking details
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { getHotelByIdApi, getImageUrl } from '../services/api';
import { deleteHotel } from '../redux/hotelSlice';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Browser Geolocation distance calculation state
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);

  // Fetch hotel details on load
  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const data = await getHotelByIdApi(id);
        setHotel(data);
      } catch (err) {
        setError(err.message || 'Unable to find hotel.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  // Calculate distance between user browser location and hotel coordinates
  const calculateDistance = () => {
    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const hotelLat = parseFloat(hotel.latitude);
        const hotelLng = parseFloat(hotel.longitude);

        // Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = ((hotelLat - userLat) * Math.PI) / 180;
        const dLng = ((hotelLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((hotelLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = (R * c).toFixed(2);

        setDistanceInfo({
          distanceKm,
          userLat: userLat.toFixed(4),
          userLng: userLng.toFixed(4),
        });
        setGeoLoading(false);
      },
      (geoErr) => {
        setGeoLoading(false);
        alert('Could not determine your location: ' + geoErr.message);
      }
    );
  };

  // Delete hotel action with confirmation
  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${hotel.title}"?`);
    if (confirmed) {
      await dispatch(deleteHotel(hotel.id));
      navigate('/');
    }
  };

  if (loading) {
    return (
      <main className="mdb-main-wrapper">
        <div className="mdb-loading-box">
          <div className="mdb-spinner"></div>
          <p>Loading hotel details...</p>
        </div>
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="mdb-main-wrapper">
        <div className="mdb-card-container" style={{ paddingTop: '40px' }}>
          <div className="error-alert">
            <p>⚠️ {error || 'Hotel not found.'}</p>
            <Link to="/" className="btn btn-secondary">
              Back to Hotels
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const lat = parseFloat(hotel.latitude);
  const lng = parseFloat(hotel.longitude);
  const mapDelta = 0.015;
  const bbox = `${lng - mapDelta}%2C${lat - mapDelta}%2C${lng + mapDelta}%2C${lat + mapDelta}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <main className="mdb-main-wrapper">
      {/* Dynamic SEO Tags via react-helmet */}
      <Helmet>
        <title>{hotel.title} - Hotel Details &amp; Location | Hotel Nest</title>
        <meta
          name="description"
          content={`${hotel.title}: ${hotel.description.slice(0, 150)}. Book for $${hotel.price}/night.`}
        />
      </Helmet>

      {/* Royal Blue Hero Banner */}
      <section className="mdb-hero-banner">
        <div className="mdb-banner-container">
          <h1 className="mdb-banner-title">{hotel.title}</h1>
          <nav className="mdb-breadcrumb" aria-label="breadcrumb">
            <Link to="/" className="crumb-link">Home</Link>
            <span className="crumb-separator">&gt;</span>
            <Link to="/" className="crumb-link">Hotels</Link>
            <span className="crumb-separator">&gt;</span>
            <span className="crumb-current">{hotel.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Detail Card */}
      <div className="mdb-content-container" style={{ gridTemplateColumns: '1fr', maxWidth: '1000px' }}>
        <article className="detail-card">
          {/* Detail Hero Image */}
          <div className="detail-image-wrapper">
            <img
              src={getImageUrl(hotel.image_path, hotel.title)}
              alt={`Detailed photograph of ${hotel.title}`}
              className="detail-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/hotel-1.jpg';
              }}
            />
            <div className="detail-price-tag">
              <span className="price-amount">${Number(hotel.price).toFixed(2)}</span>
              <span className="price-period"> / night</span>
            </div>
          </div>

          {/* Content Section */}
          <div className="detail-content">
            <header className="detail-header">
              <h2 className="detail-title">{hotel.title}</h2>
              <div className="detail-actions" style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/edit/${hotel.id}`} className="mdb-btn-edit" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  ✏️ Edit Hotel
                </Link>
                <button onClick={handleDelete} className="mdb-btn-delete" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  🗑️ Delete Hotel
                </button>
              </div>
            </header>

            {/* Coordinates Badge */}
            <div className="coordinates-badge">
              <span>📍</span>
              <span>
                Coordinates: <strong>Latitude {lat.toFixed(6)}</strong>, <strong>Longitude {lng.toFixed(6)}</strong>
              </span>
            </div>

            {/* Hotel Description */}
            <section className="detail-description-section">
              <h2>About this Hotel</h2>
              <p className="detail-description-text">{hotel.description}</p>
            </section>

            {/* Browser Geolocation Distance Calculator */}
            <section className="geo-distance-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>🧭 Distance Calculator (Browser Geolocation)</h3>
                <button
                  onClick={calculateDistance}
                  className="mdb-btn-primary"
                  disabled={geoLoading}
                >
                  {geoLoading ? 'Detecting Location...' : 'Calculate Distance from Me'}
                </button>
              </div>
              {distanceInfo && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #ced4da', fontSize: '0.9rem' }}>
                  <p>📍 Your Location: <strong>({distanceInfo.userLat}, {distanceInfo.userLng})</strong></p>
                  <p style={{ color: '#1266f1', fontWeight: 600, marginTop: '4px' }}>
                    🚗 This hotel is approximately <strong>{distanceInfo.distanceKm} km</strong> away from you.
                  </p>
                </div>
              )}
            </section>

            {/* Embedded OpenStreetMap */}
            <section className="map-section" style={{ marginTop: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Hotel Location on Map</h2>
              <p style={{ fontSize: '0.88rem', color: '#6c757d', marginBottom: '10px' }}>
                Location marker at Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)}:
              </p>
              <div className="map-container">
                <iframe
                  title={`Map showing location of ${hotel.title}`}
                  width="100%"
                  height="360"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={mapUrl}
                  style={{ border: 'none', display: 'block' }}
                ></iframe>
              </div>
              <div style={{ marginTop: '8px', textAlign: 'right' }}>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.85rem', color: '#1266f1', fontWeight: 600 }}
                >
                  View Larger Map on OpenStreetMap &rarr;
                </a>
              </div>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
};

export default HotelDetail;
