import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.yippieapp.com/api/v1";

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to include CSRF token and handle requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the CSRF token from cookie
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle token expiration
    if (response?.status === 401) {
      // If token expired, redirect to login page
      if (window.location.pathname !== "/login") {
        toast.error("Session expired. Please log in again.");
        // Clear auth state if using Redux
        // store.dispatch(setUser(null));
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    // Handle server errors
    else if (response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    // Return the error for component-level handling
    return Promise.reject(error);
  }
);

// Create wrapper methods with better error handling
export const api = {
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  },

  // Upload file with progress tracking
  upload: async (url, formData, progressCallback = null) => {
    try {
      const response = await apiClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progressCallback
          ? (event) => {
              const percentCompleted = Math.round(
                (event.loaded * 100) / event.total
              );
              progressCallback(percentCompleted);
            }
          : undefined,
      });
      return response.data;
    } catch (error) {
      handleRequestError(error);
      throw error;
    }
  },
};

// Error handler helper function
const handleRequestError = (error) => {
  const { response } = error;

  if (response?.data?.message) {
    toast.error(response.data.message);
  } else if (error.message === "Network Error") {
    toast.error("Network error. Please check your connection.");
  } else if (error.code === "ECONNABORTED") {
    toast.error("Request timed out. Please try again.");
  } else {
    toast.error("An unexpected error occurred.");
  }
};

export default api;
