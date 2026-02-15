import axios from 'axios';

const api = axios.create({
  baseURL: 'https://26666d054f906bf7.mokky.dev',
});

// Interceptor to add auth token if existing
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
