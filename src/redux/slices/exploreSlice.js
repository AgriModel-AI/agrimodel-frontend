// exploreSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching explore items
export const fetchExplore = createAsyncThunk(
  'explore/fetchExplore',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/explore');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching explore items");
    }
  }
);

// Async thunk for adding a new explore item
export const addExplore = createAsyncThunk(
  'explore/addExplore',
  async (exploreData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/explore', exploreData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding explore item");
    }
  }
);

// Async thunk for updating an explore item
export const updateExplore = createAsyncThunk(
  'explore/updateExplore',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/explore/${id}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating explore item");
    }
  }
);

// Async thunk for deleting an explore item
export const deleteExplore = createAsyncThunk(
  'explore/deleteExplore',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/explore/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting explore item");
    }
  }
);

// Explore slice
const exploreSlice = createSlice({
  name: 'explore',
  initialState: {
    exploreItems: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetExplore(state) {
      state.exploreItems = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch explore
    builder
      .addCase(fetchExplore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExplore.fulfilled, (state, action) => {
        state.loading = false;
        state.exploreItems = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchExplore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle add explore
    builder
      .addCase(addExplore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExplore.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(addExplore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasFetched = false;
      });

    // Handle update explore
    builder
      .addCase(updateExplore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExplore.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(updateExplore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle delete explore
    builder
      .addCase(deleteExplore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExplore.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(deleteExplore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetExplore } = exploreSlice.actions;
export default exploreSlice.reducer;