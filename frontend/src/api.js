import axios from 'axios';

// Create an Axios instance
// In local dev, backend is usually on 8000, frontend on 5173. 
// In production (Cloud Run), both will be on the same domain/port.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export default api;
