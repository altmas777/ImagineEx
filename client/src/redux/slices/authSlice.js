import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', userData);
      return response.data; // expects { message, email }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verify',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify', data);
      return response.data; // expects { token, ...user }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'OTP Verification failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      return response.data; // expects { token, user }
    } catch (error) {
      if (error.response?.data?.unverified) {
        return rejectWithValue(error.response.data); // pass full object for unverified
      }
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const tokenStr = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
let parsedUser = null;
try {
  if (userStr) parsedUser = JSON.parse(userStr);
} catch (e) {
  parsedUser = null;
}

const initialState = {
  user: parsedUser,
  token: tokenStr,
  isAuthenticated: !!tokenStr,
  isLoading: false,
  error: null,
  pendingVerificationEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.pendingVerificationEmail = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success("Logged out successfully");
    },
    clearPendingVerification: (state) => {
      state.pendingVerificationEmail = null;
    },
    rehydrateAuth: (state) => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingVerificationEmail = action.payload.email;
        toast.success(action.payload.message || "OTP sent to your email!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        const { token, ...userData } = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = userData;
        state.token = token;
        state.pendingVerificationEmail = null;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Account verified and logged in successfully!");
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, ...userData } = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = userData;
        state.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success("Logged in successfully!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.unverified) {
           state.pendingVerificationEmail = action.payload.email;
           // Don't toast error here because it contains a specific flow "new otp sent"
           toast.error(action.payload.message); 
        } else {
           state.error = action.payload;
           toast.error(action.payload);
        }
      });
  },
});

export const { logout, rehydrateAuth, clearPendingVerification } = authSlice.actions;
export default authSlice.reducer;
