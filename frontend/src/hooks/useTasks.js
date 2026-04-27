import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

export const useTasks = (currentPage, isAuthenticated) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && ['app', 'stats', 'categories'].includes(currentPage)) {
      fetchTasks();
    }
  }, [currentPage, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title) => {
    if (!title.trim() || title.length > 200) return;
    try {
      await taskAPI.createTask(title);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      await taskAPI.updateTask(id, !completed);
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return { tasks, loading, error, addTask, toggleTask, deleteTask, fetchTasks };
};
