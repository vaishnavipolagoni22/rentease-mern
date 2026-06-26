import axios from 'axios';

// ✅ PRODUCTION BACKEND URL (Render)
const API = axios.create({
  baseURL: 'https://rentease-mern-vv7w.onrender.com'
});

// Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;