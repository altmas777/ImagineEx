import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import savedPostReducer from './slices/savedPostSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    profile: profileReducer,
    savedPosts: savedPostReducer,
  },
});
