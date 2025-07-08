// subscriptionPlanSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Fetch subscription plans
export const fetchSubscriptionPlans = createAsyncThunk(
  'subscriptionPlans/fetchSubscriptionPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subscriptions/plans');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching subscription plans");
    }
  }
);

// Add subscription plan
export const addSubscriptionPlan = createAsyncThunk(
  'subscriptionPlans/addSubscriptionPlan',
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/subscriptions/plans', planData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding subscription plan");
    }
  }
);

// Get subscription plan by ID
export const getSubscriptionPlanById = createAsyncThunk(
  'subscriptionPlans/getSubscriptionPlanById',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/subscriptions/plans/${planId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching subscription plan details");
    }
  }
);

// Update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  'subscriptionPlans/updateSubscriptionPlan',
  async ({ planId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/subscriptions/plans/${planId}`, updatedData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating subscription plan");
    }
  }
);

// Delete subscription plan
export const deleteSubscriptionPlan = createAsyncThunk(
  'subscriptionPlans/deleteSubscriptionPlan',
  async (planId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/subscriptions/plans/${planId}`);
      return planId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting subscription plan");
    }
  }
);

// Subscription plan slice
const subscriptionPlanSlice = createSlice({
  name: 'subscriptionPlans',
  initialState: {
    plans: [],
    currentPlan: null,
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetPlans(state) {
      state.plans = [];
      state.error = null;
      state.hasFetched = false;
    },
    resetCurrentPlan(state) {
      state.currentPlan = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch subscription plans
    builder
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add subscription plan
    builder
      .addCase(addSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSubscriptionPlan.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(addSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get subscription plan by ID
    builder
      .addCase(getSubscriptionPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
      })
      .addCase(getSubscriptionPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update subscription plan
    builder
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete subscription plan
    builder
      .addCase(deleteSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(deleteSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPlans, resetCurrentPlan } = subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;