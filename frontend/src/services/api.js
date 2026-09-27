// API service functions to interact with the Express backend
// Uses native fetch — no extra dependencies needed

// In production, VITE_API_URL should point to the deployed Render backend
// In development, Vite proxy forwards /api to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/hotels`
  : '/api/hotels';

/**
 * Resolve hotel image URL supporting bundled high-res images and backend uploads
 */
export function getImageUrl(imagePath, hotelTitle = '') {
  if (!imagePath) {
    const title = (hotelTitle || '').toLowerCase();
    if (title.includes('grand palace')) return '/images/hotel-1.jpg';
    if (title.includes('mountain whisper')) return '/images/hotel-2.jpg';
    if (title.includes('metropolis')) return '/images/hotel-3.jpg';
    if (title.includes('sunset bay')) return '/images/hotel-4.jpg';
    return '/images/hotel-1.jpg';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }

  const title = (hotelTitle || '').toLowerCase();
  if (imagePath.includes('grand-palace') || title.includes('grand palace')) {
    return '/images/hotel-1.jpg';
  }
  if (imagePath.includes('mountain-resort') || title.includes('mountain whisper')) {
    return '/images/hotel-2.jpg';
  }
  if (imagePath.includes('city-boutique') || title.includes('metropolis')) {
    return '/images/hotel-3.jpg';
  }
  if (imagePath.includes('sunset-villa') || title.includes('sunset bay')) {
    return '/images/hotel-4.jpg';
  }

  if (imagePath.startsWith('/uploads/')) {
    const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
    return backendUrl ? `${backendUrl}${imagePath}` : imagePath;
  }

  return imagePath;
}

/**
 * Fetch hotels with search query, price filters, and pagination offset/limit
 */
export async function getHotelsApi({ search = '', minPrice = '', maxPrice = '', offset = 0, limit = 6 }) {
  const params = new URLSearchParams();
  if (search) params.append('title', search);
  if (minPrice) params.append('minPrice', minPrice);
  if (maxPrice) params.append('maxPrice', maxPrice);
  params.append('offset', offset);
  params.append('limit', limit);

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch hotels');
  }
  return data;
}

/**
 * Fetch a single hotel by ID for detail view or edit pre-fill
 */
export async function getHotelByIdApi(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch hotel details');
  }
  return data.hotel;
}

/**
 * Create a new hotel with multipart/form-data (including image file)
 */
export async function createHotelApi(formData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: formData, // FormData automatically sets correct multipart/form-data headers
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors ? JSON.stringify(data.errors) : (data.message || 'Failed to create hotel'));
  }
  return data;
}

/**
 * Update an existing hotel by ID with multipart/form-data
 */
export async function updateHotelApi(id, formData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors ? JSON.stringify(data.errors) : (data.message || 'Failed to update hotel'));
  }
  return data;
}

/**
 * Delete a hotel by ID
 */
export async function deleteHotelApi(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete hotel');
  }
  return data;
}
