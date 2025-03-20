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

export const fetchDashboardRecentActivities = createAsyncThunk(
  'dashboardStats/fetchDashboardRecentActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dashboard/activity/recent?limit=5');
      return response.data.data; // Assuming API response contains the required data
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
    recentActivities: [],
    loading: false,
    loadingRecent: false,
    error: null,
    hasFetchedRecent: false,
    hasFetched: false,
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
      state.recentActivities = [];
      state.hasFetchedRecent = false;
      state.error = null;
      state.hasFetched = false;
      state.loading = false;
      state.loadingRecent = false;
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

    // Handle fetch recent activities with separate loading state
    builder
      .addCase(fetchDashboardRecentActivities.pending, (state) => {
        state.loadingRecent = true;
        state.error = null;
      })
      .addCase(fetchDashboardRecentActivities.fulfilled, (state, action) => {
        state.loadingRecent = false;
        state.recentActivities = action.payload;
        state.hasFetchedRecent = true;
      })
      .addCase(fetchDashboardRecentActivities.rejected, (state, action) => {
        state.loadingRecent = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetDashboardStats } = dashboardStatSlice.actions;
export default dashboardStatSlice.reducer;