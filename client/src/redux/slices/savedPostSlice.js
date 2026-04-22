import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const fetchSavedPosts = createAsyncThunk('savedPosts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/api/saved-posts');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved posts');
  }
});

export const savePost = createAsyncThunk('savedPosts/save', async (pid, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/api/posts/${pid}/save`);
    return response.data; // Usually returns the saved post object
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to save post');
  }
});

export const unsavePost = createAsyncThunk('savedPosts/unsave', async (pid, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/api/saved-posts/${pid}`);
    return pid;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove saved post');
  }
});

const initialState = {
  savedPosts: [],
  isLoading: false,
  error: null,
};

const savedPostSlice = createSlice({
  name: 'savedPosts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedPosts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedPosts = action.payload;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        // payload should be the post object if possible, or we just rely on fetch Saved posts
        // For optimistic add, we assume it's returned
        if(action.payload && action.payload._id) {
          state.savedPosts.push(action.payload);
        }
        toast.success("Post saved");
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        // action.payload is pid
        state.savedPosts = state.savedPosts.filter(post => post._id !== action.payload && post.post !== action.payload); 
        // handle populated or unpopulated versions depending on backend
        toast.success("Post removed from saved");
      });
  },
});

export default savedPostSlice.reducer;
