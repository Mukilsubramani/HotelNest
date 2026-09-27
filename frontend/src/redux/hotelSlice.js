// Redux slice for hotel state, filters, pagination, and CRUD thunks
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getHotelsApi,
  getHotelByIdApi,
  createHotelApi,
  updateHotelApi,
  deleteHotelApi,
} from '../services/api';

// Initial state
const initialState = {
  hotels: [],
  totalCount: 0,
  currentHotel: null,
  loading: false,
  detailLoading: false,
  error: null,
  filters: {
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 6,
  },
  toast: {
    visible: false,
    message: '',
    type: 'success',
  },
};

// Fetch hotels using the current filters and page
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().hotels;
      const offset = (filters.page - 1) * filters.limit;
      const data = await getHotelsApi({
        search: filters.search,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        offset: offset,
        limit: filters.limit,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch a single hotel by ID
export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const hotel = await getHotelByIdApi(id);
      return hotel;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create a new hotel
export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const result = await createHotelApi(formData);
      dispatch(showToast({ message: 'Hotel added successfully!', type: 'success' }));
      dispatch(fetchHotels());
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update an existing hotel
export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const result = await updateHotelApi(id, formData);
      dispatch(showToast({ message: 'Hotel updated successfully!', type: 'success' }));
      dispatch(fetchHotels());
      return result;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete a hotel by ID
export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const result = await deleteHotelApi(id);
      // Requirement: small success popup/toast ("Hotel deleted successfully")
      dispatch(showToast({ message: 'Hotel deleted successfully', type: 'success' }));
      dispatch(fetchHotels());
      return result;
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to delete hotel', type: 'error' }));
      return rejectWithValue(err.message);
    }
  }
);

export const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    // Update filter criteria
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: action.payload.page || 1 };
    },
    // Change current active page
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    // Reset filters back to default
    resetFilters: (state) => {
      state.filters.search = '';
      state.filters.minPrice = '';
      state.filters.maxPrice = '';
      state.filters.page = 1;
    },
    // Clear currently viewed single hotel
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
    // Toast notification controls
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'success',
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
      state.toast.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHotels lifecycle
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.hotels;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load hotels';
      })
      // fetchHotelById lifecycle
      .addCase(fetchHotelById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || 'Failed to load hotel details';
      });
  },
});

export const {
  setFilters,
  setPage,
  resetFilters,
  clearCurrentHotel,
  showToast,
  hideToast,
} = hotelSlice.actions;

export default hotelSlice.reducer;
