import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Async thunk for fetching support requests
export const fetchSupportRequests = createAsyncThunk(
  'supportRequests/fetchSupportRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/support`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Async thunk for updating a support request status
export const updateSupportRequest = createAsyncThunk(
  'supportRequests/updateSupportRequest',
  async ({ requestId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/support?id=${requestId}`, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const supportRequestSlice = createSlice({
  name: 'supportRequests',
  initialState: {
    supportRequests: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {
    resetSupportRequests(state) {
      state.supportRequests = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch support requests
      .addCase(fetchSupportRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.supportRequests = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchSupportRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update support request
      .addCase(updateSupportRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupportRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.hasFetched = false;
      })
      .addCase(updateSupportRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSupportRequests } = supportRequestSlice.actions;

export default supportRequestSlice.reducer;
