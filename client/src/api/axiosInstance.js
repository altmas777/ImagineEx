import axios from "axios";

// Helper to determine base URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request Interceptor: Attach token if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Instead of relying on hook here inside axios instance, we just reload the app to /login 
      // or dispatch an event that the app listens to.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
