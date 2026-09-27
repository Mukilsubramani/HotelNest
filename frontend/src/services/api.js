// API service functions to interact with the Express backend
// Uses native fetch — no extra dependencies needed

// In production, VITE_API_URL should point to the deployed Render backend
// In development, Vite proxy forwards /api to localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/hotels`
  : '/api/hotels';

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
