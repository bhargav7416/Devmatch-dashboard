import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Developers API
export const developersAPI = {
  getAll: (params) => api.get('/developers', { params }),
  getById: (id) => api.get(`/developers/${id}`),
  create: (data) => api.post('/developers', data),
  update: (id, data) => api.put(`/developers/${id}`, data),
  delete: (id) => api.delete(`/developers/${id}`),
  match: (data) => api.post('/developers/match', data),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Assignments API
export const assignmentsAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  create: (data) => api.post('/assignments', data),
  complete: (id) => api.put(`/assignments/${id}/complete`),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSkills: () => api.get('/dashboard/skills'),
};

export default api;
