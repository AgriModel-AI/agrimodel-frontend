import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboardStats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/stats');
      return response.data; // Assuming API response contains the required data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching dashboard stats");
    }
  }
);

// Dashboard stats slice
const dashboardStatSlice = createSlice({
  name: 'dashboardStats',
  initialState: {
    stats: {
      totalClients: 0,
      totalCommunities: 0,
      totalDiseases: 0,
      provinceCases: [],
      diseaseCasesOverMonths: {
        labels: [],
        datasets: []
      },
      diseaseCases: []
    },
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetDashboardStats(state) {
      state.stats = {
        totalClients: 0,
        totalCommunities: 0,
        totalDiseases: 0,
        provinceCases: [],
        diseaseCasesOverMonths: {
          labels: [],
          datasets: []
        },
        diseaseCases: []
      };
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDashboardStats } = dashboardStatSlice.actions;
export default dashboardStatSlice.reducer;
