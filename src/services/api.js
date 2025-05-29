import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add auth token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  // Customer signup
  registerCustomer: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/customer', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Supplier signup
  registerSupplier: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register/supplier', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Login for both customer and supplier
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from token
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Verify if token is valid
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify-token');
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response ? error.response.data : error;
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default apiClient;