import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api';

const api = axios.create({
  baseURL,
  timeout: 15000
});

export default api;
