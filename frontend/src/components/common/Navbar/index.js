import React from 'react';
import './styles.css';

function Navbar({ isAuthenticated, onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate(isAuthenticated ? 'app' : 'landing')}>
        Task Manager
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <button onClick={() => onNavigate('app')}>Tasks</button>
            <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
            <button onClick={() => onNavigate('chat')}>AI Chat</button>
            <button onClick={() => onNavigate('calendar')}>Calendar</button>
            <button onClick={() => onNavigate('stats')}>Stats</button>
            <button onClick={() => onNavigate('profile')}>Profile</button>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => onNavigate('about')}>About</button>
            <button onClick={() => onNavigate('login')}>Login</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
