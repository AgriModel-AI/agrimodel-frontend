import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';


export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/communities');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching communities");
    }
  }
);

// Async thunk for adding a new community
export const addCommunity = createAsyncThunk(
  'communities/addCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/communities', communityData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding community");
    }
  }
);

// Async thunk for updating a community
export const updateCommunity = createAsyncThunk(
  'communities/updateCommunity',
  async ({ communityId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/communities/${communityId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating community");
    }
  }
);


export const updateCommunityImage = createAsyncThunk(
    'communities/updateCommunityImage',
    async ({ communityId, imageData }, { rejectWithValue }) => {
      
      console.log(imageData);
      try {
        const response = await axiosInstance.patch(`/communities/${communityId}/image`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Error updating community image");
      }
    }
  );

// Async thunk for deleting a community
export const deleteCommunity = createAsyncThunk(
  'communities/deleteCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/communities/${communityId}`);
      return communityId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting community");
    }
  }
);

// Community slice
const communitySlice = createSlice({
  name: 'communities',
  initialState: {
    communities: [],
    loading: false,
    error: null,
    hasFetched: false, // Tracks if data has been fetched
  },
  reducers: {
    resetCommunities(state) {
      state.communities = [];
      state.error = null;
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch communities
    builder
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
        state.hasFetched = true;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle add community
    builder
      .addCase(addCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities.push(action.payload);
        state.hasFetched = false;
      })
      .addCase(addCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hasFetched = false;
      });

    // Handle update community
    builder
      .addCase(updateCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.communities.findIndex(c => c.communityId === action.payload.communityId);
        if (index !== -1) {
          state.communities[index] = action.payload;
        }
        state.hasFetched = false;
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle update only community image
    builder
      .addCase(updateCommunityImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommunityImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.communities.findIndex(c => c.communityId === action.payload.communityId);
        if (index !== -1) {
          state.communities[index].image = action.payload.image_url;
        }
        state.hasFetched = false;
      })
      .addCase(updateCommunityImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle delete community
    builder
      .addCase(deleteCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = state.communities.filter(c => c.communityId !== action.payload);
        state.hasFetched = false;
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetCommunities } = communitySlice.actions;
export default communitySlice.reducer;
