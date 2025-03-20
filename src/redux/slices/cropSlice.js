import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching crops
export const fetchCrop = createAsyncThunk(
  'crops/fetchCrop',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/crop');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching crops");
    }
  }
);

// Async thunk for adding a new crop
export const addCrop = createAsyncThunk(
  'crops/addCrop',
  async (cropData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/crop', cropData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding crop");
    }
  }
);

// Async thunk for updating a crop
export const updateCrop = createAsyncThunk(
  'crops/updateCrop',
  async ({ cropId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/crop?crop_id=${cropId}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating crop");
    }
  }
);

export const deleteCrop = createAsyncThunk(
    'crops/deleteCrop',
    async (cropId, { rejectWithValue }) => {
      try {
        await axiosInstance.delete(`/crop?crop_id=${cropId}`);
        return cropId;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error deleting crop");
      }
    }
  );

// crop slice
const cropslice = createSlice({
  name: 'crops',
  initialState: {
    crops: [],
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetcrops(state) {
      state.crops = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch crops
    builder
      .addCase(fetchCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.crops = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle add crop
    builder
      .addCase(addCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCrop.fulfilled, (state, action) => {
        state.loading = false;
        // state.crops.push(action.payload);
        state.hasFetched = false;
      })
      .addCase(addCrop.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
        state.hasFetched = false;
      });

    // Handle update crop
    builder
      .addCase(updateCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(updateCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder
      .addCase(deleteCrop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCrop.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(deleteCrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetcrops } = cropslice.actions;
export default cropslice.reducer;
