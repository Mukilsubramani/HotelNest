// Reusable form for adding or editing a hotel
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createHotel, updateHotel } from '../redux/hotelSlice';

const HotelForm = ({ initialData = null, isEditMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [price, setPrice] = useState('');

  // Image and Preview state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form fields when editing an existing hotel
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLatitude(initialData.latitude !== undefined ? initialData.latitude.toString() : '');
      setLongitude(initialData.longitude !== undefined ? initialData.longitude.toString() : '');
      setPrice(initialData.price !== undefined ? initialData.price.toString() : '');
      if (initialData.image_path) {
        setImagePreview(initialData.image_path);
      }
    }
  }, [initialData]);

  // Show a live preview of the selected image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create local temporary URL for live preview before submit
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clear image error if any
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  // Validate all form fields before submitting
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Hotel title is required.';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Hotel description is required.';
    }

    // Latitude validation (-90 to 90)
    const lat = parseFloat(latitude);
    if (latitude === '' || isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be a valid number between -90 and 90.';
    }

    // Longitude validation (-180 to 180)
    const lng = parseFloat(longitude);
    if (longitude === '' || isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.longitude = 'Longitude must be a valid number between -180 and 180.';
    }

    // Price validation (must be positive number)
    const p = parseFloat(price);
    if (price === '' || isNaN(p) || p <= 0) {
      newErrors.price = 'Price must be a positive number greater than 0.';
    }

    // Image validation (required for Add mode; optional for Edit mode if image exists)
    if (!isEditMode && !imageFile) {
      newErrors.image = 'Hotel image is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Use the browser's Geolocation API to auto-fill coordinates
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setErrors((prev) => ({ ...prev, latitude: null, longitude: null }));
        },
        (err) => {
          alert('Could not retrieve current location: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Handle form submission — build FormData and call the right Redux action
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build FormData payload for multipart file upload
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('price', price);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditMode) {
        await dispatch(updateHotel({ id: initialData.id, formData })).unwrap();
      } else {
        await dispatch(createHotel(formData)).unwrap();
      }

      // On success, redirect back to the list page
      navigate('/');
    } catch (err) {
      console.error('Form submission failed:', err);
      // If backend returned specific field errors
      try {
        const parsed = JSON.parse(err);
        setErrors(parsed);
      } catch {
        setErrors({ form: err || 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hotel-form" noValidate>
      {errors.form && <div className="error-alert">{errors.form}</div>}

      {/* Hotel Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Hotel Title <span className="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`form-input ${errors.title ? 'input-error' : ''}`}
          placeholder="e.g. Grand Horizon Palace"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
          }}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          rows="4"
          className={`form-input ${errors.description ? 'input-error' : ''}`}
          placeholder="Provide a detailed overview of the hotel amenities, view, and features..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
          }}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      {/* Price Input */}
      <div className="form-group">
        <label htmlFor="price" className="form-label">
          Price per Night ($) <span className="required">*</span>
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0.01"
          className={`form-input ${errors.price ? 'input-error' : ''}`}
          placeholder="e.g. 150.00"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
          }}
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      {/* Latitude & Longitude Coordinates */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label htmlFor="latitude" className="form-label">
            Latitude (-90 to 90) <span className="required">*</span>
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            className={`form-input ${errors.latitude ? 'input-error' : ''}`}
            placeholder="e.g. 13.0827"
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
              if (errors.latitude) setErrors((prev) => ({ ...prev, latitude: null }));
            }}
          />
          {errors.latitude && <span className="error-text">{errors.latitude}</span>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="longitude" className="form-label">
            Longitude (-180 to 180) <span className="required">*</span>
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            className={`form-input ${errors.longitude ? 'input-error' : ''}`}
            placeholder="e.g. 80.2707"
            value={longitude}
            onChange={(e) => {
              setLongitude(e.target.value);
              if (errors.longitude) setErrors((prev) => ({ ...prev, longitude: null }));
            }}
          />
          {errors.longitude && <span className="error-text">{errors.longitude}</span>}
        </div>
      </div>

      {/* Optional Geolocation button */}
      <div className="geo-helper-container">
        <button
          type="button"
          onClick={handleUseMyLocation}
          className="btn btn-sm btn-ghost"
        >
          📍 Autofill with My Current Browser Location
        </button>
      </div>

      {/* Image File Input with Live Preview */}
      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Hotel Image {!isEditMode && <span className="required">*</span>}
          {isEditMode && <small className="helper-text"> (Leave blank to keep existing image)</small>}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className={`file-input ${errors.image ? 'input-error' : ''}`}
          onChange={handleImageChange}
        />
        {errors.image && <span className="error-text">{errors.image}</span>}

        {/* Live Image Preview */}
        {imagePreview && (
          <div className="image-preview-box">
            <span className="preview-label">Image Preview:</span>
            <img
              src={imagePreview}
              alt="Hotel live preview"
              className="preview-image"
            />
          </div>
        )}
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : isEditMode
            ? '💾 Update Hotel'
            : '➕ Add Hotel'}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
