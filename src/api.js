import axios from 'axios';

// Create axios instance with default settings
const api = axios.create({
  baseURL: (import.meta.env && import.meta.env.MODE === 'development')
    ? 'http://localhost:5000/api'
    : 'https://profile-app-backend.vercel.app/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor
api.interceptors.request.use(config => {
  // Add auth token if exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(response => {
  return response.data;
}, error => {
  // Handle errors globally
  if (error.response) {
    console.error('API Error:', error.response.status, error.response.data);
  } else {
    console.error('API Connection Error:', error.message);
  }
  return Promise.reject(error);
});

export default api;