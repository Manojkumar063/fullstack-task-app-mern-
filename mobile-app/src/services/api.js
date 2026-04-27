import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  getProfile: () => api.get('/auth/profile'),
  googleLogin: (token) => api.post('/oauth/google', { token })
};

export const taskAPI = {
  getTasks: () => api.get('/tasks'),
  createTask: (title) => api.post('/tasks', { title }),
  updateTask: (id, completed) => api.put(`/tasks/${id}`, { completed }),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};

export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  getChatHistory: () => api.get('/ai/chat/history'),
  getSuggestions: (context) => api.post('/ai/suggestions', { context }),
  categorizeTask: (title) => api.post('/ai/categorize', { title })
};

export default api;
