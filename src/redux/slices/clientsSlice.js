import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

// Fetch clients
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/clients');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching clients");
    }
  }
);

// Update account status (block/unblock)
export const toggleBlockStatus = createAsyncThunk(
  'clients/toggleBlockStatus',
  async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/clients/${userId}`, { isBlocked });
      return { userId, isBlocked: response.data.isBlocked };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating account status");
    }
  }
);

// Client slice
const clientSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    loading: false,
    error: null,
    hasFetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch clients
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle block/unblock
    builder
      .addCase(toggleBlockStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBlockStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, isBlocked } = action.payload;
        const client = state.clients.find((c) => c.userId === userId);
        if (client) {
          client.isBlocked = isBlocked;
        }
      })
      .addCase(toggleBlockStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default clientSlice.reducer;
