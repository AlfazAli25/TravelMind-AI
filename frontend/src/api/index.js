import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
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

// Response interceptor — handle 401 (expired token)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ─── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// ─── Upload ────────────────────────────────────────────
export const uploadAPI = {
  uploadFiles: (formData, onProgress) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    }),
};

// ─── Itinerary ─────────────────────────────────────────
export const itineraryAPI = {
  generate: (data) => api.post('/itinerary/generate', data),
  getAll: (search = '') => api.get(`/itinerary?search=${search}`),
  getById: (id) => api.get(`/itinerary/${id}`),
  delete: (id) => api.delete(`/itinerary/${id}`),
  getStats: () => api.get('/itinerary/stats'),
};

// ─── Share ─────────────────────────────────────────────
export const shareAPI = {
  getShared: (shareId) => api.get(`/share/${shareId}`),
};

// ─── Chat ──────────────────────────────────────────────
export const chatAPI = {
  sendMessage: (itineraryId, message) =>
    api.post(`/chat/${itineraryId}`, { message }),
  getHistory: (itineraryId) => api.get(`/chat/${itineraryId}`),
};

export default api;
