// subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Fetch user subscriptions
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subscriptions');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching subscriptions");
    }
  }
);

// Subscription slice
const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetSubscriptions(state) {
      state.subscriptions = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch subscriptions
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;