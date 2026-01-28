import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : '/api');
console.log('Current API Base URL:', baseURL);

const api = axios.create({
  baseURL,
});

export default api;
