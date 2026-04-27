import React from 'react';
import './Dashboard.css';

function Dashboard({ tasks, user, onNavigate }) {
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const completionRate = tasks.length ? ((completedTasks / tasks.length) * 100).toFixed(1) : 0;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="welcome">Welcome back, {user?.name}!</div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <div className="stat-value">{tasks.length}</div>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <div className="stat-value">{completedTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="stat-value">{pendingTasks}</div>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <div className="stat-value">{completionRate}%</div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <button onClick={() => onNavigate('chat')} className="ai-btn">🤖 Chat with AI</button>
        <button onClick={() => onNavigate('ai-insights')} className="ai-btn">🧠 AI Insights</button>
        <button onClick={() => onNavigate('document-parser')} className="ai-btn">📄 Parse Document</button>
        <button onClick={() => onNavigate('app')}>Manage Tasks</button>
        <button onClick={() => onNavigate('stats')}>View Statistics</button>
        <button onClick={() => onNavigate('categories')}>Categories</button>
      </div>
    </div>
  );
}

export default Dashboard;
