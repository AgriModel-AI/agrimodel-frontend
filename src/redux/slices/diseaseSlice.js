import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching diseases
export const fetchDiseases = createAsyncThunk(
  'diseases/fetchDiseases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/disease');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching diseases");
    }
  }
);

// Async thunk for adding a new disease
export const addDisease = createAsyncThunk(
  'diseases/addDisease',
  async (diseaseData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/disease', diseaseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding disease");
    }
  }
);

// Async thunk for updating a disease
export const updateDisease = createAsyncThunk(
  'diseases/updateDisease',
  async ({ diseaseId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/disease?disease_id=${diseaseId}`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating disease");
    }
  }
);

export const deleteDisease = createAsyncThunk(
    'diseases/deleteDisease',
    async (diseaseId, { rejectWithValue }) => {
      try {
        await axiosInstance.delete(`/disease?disease_id=${diseaseId}`);
        return diseaseId;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error deleting disease");
      }
    }
  );

// Disease slice
const diseaseSlice = createSlice({
  name: 'diseases',
  initialState: {
    diseases: [],
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetDiseases(state) {
      state.diseases = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch diseases
    builder
      .addCase(fetchDiseases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle add disease
    builder
      .addCase(addDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDisease.fulfilled, (state, action) => {
        state.loading = false;
        // state.diseases.push(action.payload);
        state.hasFetched = false;
      })
      .addCase(addDisease.rejected, (state, action) => {
        state.loading = false;
        // state.error = action.payload;
        state.hasFetched = false;
      });

    // Handle update disease
    builder
      .addCase(updateDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(updateDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      builder
      .addCase(deleteDisease.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDisease.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(deleteDisease.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDiseases } = diseaseSlice.actions;
export default diseaseSlice.reducer;
