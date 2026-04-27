import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/tasks';
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:5000/api/auth';

export const authAPI = {
  login: (email, password) => axios.post(`${AUTH_URL}/login`, { email, password }),
  register: (name, email, password) => axios.post(`${AUTH_URL}/register`, { name, email, password }),
  updateProfile: (name) => axios.put(`${AUTH_URL}/profile`, { name })
};

export const taskAPI = {
  getTasks: () => axios.get(API_URL),
  createTask: (title) => axios.post(API_URL, { title }),
  updateTask: (id, completed) => axios.put(`${API_URL}/${id}`, { completed }),
  deleteTask: (id) => axios.delete(`${API_URL}/${id}`)
};
