// Add New Hotel Page
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HotelForm from '../components/HotelForm';

const AddHotelPage = () => {
  return (
    <main className="mdb-main-wrapper">
      <Helmet>
        <title>Add New Hotel | Hotel Nest</title>
        <meta
          name="description"
          content="List a new hotel with location coordinates, pricing, photos, and amenities on Hotel Nest."
        />
      </Helmet>

      {/* Royal Blue Hero Banner */}
      <section className="mdb-hero-banner">
        <div className="mdb-banner-container">
          <h1 className="mdb-banner-title">Add New Hotel</h1>
          <nav className="mdb-breadcrumb" aria-label="breadcrumb">
            <Link to="/" className="crumb-link">Home</Link>
            <span className="crumb-separator">&gt;</span>
            <Link to="/" className="crumb-link">Hotels</Link>
            <span className="crumb-separator">&gt;</span>
            <span className="crumb-current">Add</span>
          </nav>
        </div>
      </section>

      <div className="mdb-card-container">
        <div className="mdb-form-card">
          <div className="form-header">
            <h2 className="form-heading">Hotel Information</h2>
            <p className="form-subheading">
              Fill in the details below to publish a new hotel accommodation.
            </p>
          </div>

          <HotelForm isEditMode={false} />
        </div>
      </div>
    </main>
  );
};

export default AddHotelPage;
