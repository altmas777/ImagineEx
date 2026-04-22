import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const fetchProfile = createAsyncThunk('profile/fetchByUsername', async (username, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/api/profile/${encodeURIComponent(username)}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

export const fetchFollowers = createAsyncThunk('profile/fetchFollowers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/profile/followers');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
  }
});

export const fetchFollowings = createAsyncThunk('profile/fetchFollowings', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/profile/followings');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch followings');
  }
});

export const followUser = createAsyncThunk('profile/follow', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/user/follow/${userId}`);
    return { userId, data: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
  }
});

export const unfollowUser = createAsyncThunk('profile/unfollow', async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/api/user/unfollow/${userId}`);
    return { userId, data: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
  }
});

const initialState = {
  currentProfile: null,
  followers: [],
  followings: [],
  isLoading: false,
  isRefreshing: false, // separate flag for silent refresh after follow/unfollow
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Optimistically update followers array instantly without waiting for refresh
    optimisticFollow: (state, action) => {
      const { currentUserId, userObject } = action.payload;
      if (state.currentProfile) {
        if (!state.currentProfile.followers) state.currentProfile.followers = [];
        // Add a minimal follower entry so count updates instantly
        const alreadyIn = state.currentProfile.followers.some(f => (f._id || f).toString() === currentUserId);
        if (!alreadyIn) {
          state.currentProfile.followers.push({ _id: currentUserId });
        }
      }
    },
    optimisticUnfollow: (state, action) => {
      const { currentUserId } = action.payload;
      if (state.currentProfile && state.currentProfile.followers) {
        state.currentProfile.followers = state.currentProfile.followers.filter(
          f => (f._id || f).toString() !== currentUserId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile - use isLoading only for fresh loads, isRefreshing for silent updates
      .addCase(fetchProfile.pending, (state) => {
        if (!state.currentProfile) {
          state.isLoading = true; // show spinner only if no profile loaded yet
        } else {
          state.isRefreshing = true; // silent refresh - don't hide UI
        }
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.currentProfile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to load profile');
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(fetchFollowings.fulfilled, (state, action) => {
        state.followings = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        // Update the currentProfile's followers array with returned data
        if (state.currentProfile && state.currentProfile._id?.toString() === action.payload.userId?.toString()) {
          // The returned data IS the updated target user — replace followers
          if (action.payload.data?.followers) {
            state.currentProfile.followers = action.payload.data.followers;
          }
        }
        toast.success('Followed!');
      })
      .addCase(followUser.rejected, (state, action) => {
        toast.error(action.payload || 'Could not follow user');
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentProfile && state.currentProfile._id?.toString() === action.payload.userId?.toString()) {
          if (action.payload.data?.followers) {
            state.currentProfile.followers = action.payload.data.followers;
          }
        }
        toast.success('Unfollowed!');
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        toast.error(action.payload || 'Could not unfollow user');
      });
  },
});

export const { optimisticFollow, optimisticUnfollow } = profileSlice.actions;
export default profileSlice.reducer;
