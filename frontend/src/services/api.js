import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to the Express backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
