import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import Navbar from './components/common/Navbar';
import Landing from './Landing';
import About from './About';
import Stats from './Stats';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Help from './Help';
import Settings from './Settings';
import Categories from './Categories';
import Dashboard from './Dashboard';
import Search from './Search';
import Calendar from './Calendar';
import Notifications from './Notifications';
import AIAssistant from './AIAssistant';
import Chat from './Chat';
import AIInsights from './AIInsights';
import DocumentParser from './DocumentParser';
import FloatingChatbot from './FloatingChatbot';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [newTask, setNewTask] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'purple');
  
  const { isAuthenticated, user, login, register, updateProfile, logout } = useAuth();
  const { tasks, loading, error, addTask, toggleTask, deleteTask, fetchTasks } = useTasks(currentPage, isAuthenticated);

  const handleLogin = async (email, password) => {
    await login(email, password);
    setCurrentPage('app');
  };

  const handleRegister = async (name, email, password) => {
    await register(name, email, password);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleAddTask = async (e) => {
    e?.preventDefault();
    const taskTitle = typeof e === 'string' ? e : newTask;
    if (!taskTitle.trim()) return;
    setSubmitting(true);
    await addTask(taskTitle);
    setNewTask('');
    setSubmitting(false);
  };

  const renderPage = () => {
    const pageProps = { theme, isAuthenticated, user, tasks, onNavigate: setCurrentPage };

    const pages = {
      landing: <Landing {...pageProps} onGetStarted={() => setCurrentPage(isAuthenticated ? 'app' : 'login')} onAbout={() => setCurrentPage('about')} />,
      login: <Login {...pageProps} onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />,
      register: <Register {...pageProps} onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />,
      settings: <Settings onBack={() => setCurrentPage('app')} onThemeChange={handleThemeChange} />,
      help: <Help {...pageProps} onBack={() => setCurrentPage(isAuthenticated ? 'app' : 'landing')} />,
      profile: <Profile {...pageProps} onBack={() => setCurrentPage('app')} onUpdateProfile={updateProfile} />,
      about: <About {...pageProps} onBack={() => setCurrentPage('landing')} />,
      stats: <Stats {...pageProps} onBack={() => setCurrentPage('app')} />,
      categories: <Categories {...pageProps} onBack={() => setCurrentPage('app')} />,
      dashboard: <Dashboard {...pageProps} />,
      search: <Search tasks={tasks} onBack={() => setCurrentPage('app')} />,
      calendar: <Calendar tasks={tasks} onBack={() => setCurrentPage('app')} />,
      notifications: <Notifications tasks={tasks} onBack={() => setCurrentPage('app')} />,
      chat: <Chat onBack={() => setCurrentPage('app')} />,
      'ai-insights': <AIInsights tasks={tasks} onBack={() => setCurrentPage('app')} />,
      'document-parser': <DocumentParser onBack={() => setCurrentPage('app')} onTasksCreated={fetchTasks} />
    };

    return pages[currentPage];
  };

  if (currentPage !== 'app') {
    return (
      <>
        <Navbar isAuthenticated={isAuthenticated} onNavigate={setCurrentPage} onLogout={handleLogout} />
        {renderPage()}
      </>
    );
  }

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} onNavigate={setCurrentPage} onLogout={handleLogout} />
      <h1>Task Manager</h1>
      <AIAssistant onAddTask={handleAddTask} />
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add new task..."
          disabled={submitting}
          maxLength={200}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </form>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : tasks.length === 0 ? (
        <div className="empty">No tasks yet. Add one above!</div>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id, task.completed)}
              />
              <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      {isAuthenticated && <FloatingChatbot />}
    </div>
  );
}

export default App;
