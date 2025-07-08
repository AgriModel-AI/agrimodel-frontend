// modelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Fetch models with ratings
export const fetchModels = createAsyncThunk(
  'models/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/models/admin');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching models");
    }
  }
);

// Add new model
export const addModel = createAsyncThunk(
  'models/addModel',
  async (modelData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/models/admin', modelData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.model;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding model");
    }
  }
);

// Models slice
const modelSlice = createSlice({
  name: 'models',
  initialState: {
    models: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetModels(state) {
      state.models = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch models
    builder
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add model
    builder
      .addCase(addModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addModel.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false; // Trigger a refetch
      })
      .addCase(addModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetModels } = modelSlice.actions;
export default modelSlice.reducer;