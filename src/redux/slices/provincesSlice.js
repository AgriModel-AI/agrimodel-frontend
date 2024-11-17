import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching provinces and their districts
export const fetchProvinces = createAsyncThunk(
  'provinces/fetchProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/provinces');
      return response.data.data; // Assuming API response has a `data` key
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching provinces");
    }
  }
);

// Province slice
const provinceSlice = createSlice({
  name: 'provinces',
  initialState: {
    provinces: [],
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetProvinces(state) {
      state.provinces = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch provinces
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.loading = false;
        state.provinces = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetProvinces } = provinceSlice.actions;
export default provinceSlice.reducer;
