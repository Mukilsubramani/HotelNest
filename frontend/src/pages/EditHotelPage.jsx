// Page for editing an existing hotel using the reusable HotelForm with MDB styling
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getHotelByIdApi } from '../services/api';
import HotelForm from '../components/HotelForm';

const EditHotelPage = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHotel() {
      try {
        setLoading(true);
        const data = await getHotelByIdApi(id);
        setHotel(data);
      } catch (err) {
        setError(err.message || 'Failed to load hotel');
      } finally {
        setLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  return (
    <main className="mdb-main-wrapper">
      <Helmet>
        <title>{hotel ? `Edit: ${hotel.title}` : 'Edit Hotel'} | MDB Hotel Directory</title>
        <meta
          name="description"
          content={`Edit and update details for ${hotel?.title || 'hotel'}.`}
        />
      </Helmet>

      {/* Royal Blue Hero Banner */}
      <section className="mdb-hero-banner">
        <div className="mdb-banner-container">
          <h1 className="mdb-banner-title">
            {hotel ? `Edit Hotel: ${hotel.title}` : 'Edit Hotel'}
          </h1>
          <nav className="mdb-breadcrumb" aria-label="breadcrumb">
            <Link to="/" className="crumb-link">Home</Link>
            <span className="crumb-separator">&gt;</span>
            <Link to="/" className="crumb-link">Hotels</Link>
            <span className="crumb-separator">&gt;</span>
            <span className="crumb-current">Edit</span>
          </nav>
        </div>
      </section>

      <div className="mdb-card-container">
        <div className="mdb-form-card">
          {loading && (
            <div className="mdb-loading-box">
              <div className="mdb-spinner"></div>
              <p>Loading hotel information...</p>
            </div>
          )}

          {error && (
            <div className="error-alert">
              <p>⚠️ {error}</p>
              <Link to="/" className="btn btn-secondary">
                Go Back Home
              </Link>
            </div>
          )}

          {!loading && hotel && (
            <>
              <div className="form-header">
                <h2 className="form-heading">Edit Information</h2>
                <p className="form-subheading">Update information and photos for "{hotel.title}".</p>
              </div>

              <HotelForm initialData={hotel} isEditMode={true} />
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default EditHotelPage;
