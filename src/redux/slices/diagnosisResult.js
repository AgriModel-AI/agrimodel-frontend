import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching all diagnosis results
export const fetchDiagnosisResults = createAsyncThunk(
  'diagnosisResults/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/diagnosis-result');
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching diagnosis results");
    }
  }
);

// DiagnosisResults slice
const diagnosisResultsSlice = createSlice({
  name: 'diagnosisResults',
  initialState: {
    results: [],
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetDiagnosisResults(state) {
      state.results = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetching all diagnosis results
    builder
      .addCase(fetchDiagnosisResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagnosisResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchDiagnosisResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDiagnosisResults } = diagnosisResultsSlice.actions;
export default diagnosisResultsSlice.reducer;
