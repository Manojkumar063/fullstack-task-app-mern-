import React, { useState, useEffect } from 'react';
import './Settings.css';

function Settings({ onBack, onThemeChange }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'purple');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'false');
  const [autoDelete, setAutoDelete] = useState(localStorage.getItem('autoDelete') === 'true');
  const [saved, setSaved] = useState(false);

  const themes = [
    { name: 'Purple', value: 'purple', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Blue', value: 'blue', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Green', value: 'green', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Orange', value: 'orange', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
  ];

  const handleSave = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('notifications', notifications);
    localStorage.setItem('autoDelete', autoDelete);
    onThemeChange(theme); // Notify App.js about theme change
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setTheme('purple');
    setNotifications(true);
    setAutoDelete(false);
    localStorage.removeItem('theme');
    localStorage.removeItem('notifications');
    localStorage.removeItem('autoDelete');
  };

  return (
    <div className={`settings-container theme-${theme}`}>
      <button className="back-button" onClick={onBack}>← Back</button>
      <div className="settings-content">
        <h1>⚙️ Settings</h1>
        
        {saved && <div className="success">Settings saved successfully!</div>}

        <div className="settings-section">
          <h2>Theme</h2>
          <div className="theme-grid">
            {themes.map(t => (
              <div
                key={t.value}
                className={`theme-option ${theme === t.value ? 'active' : ''}`}
                onClick={() => setTheme(t.value)}
              >
                <div className="theme-preview" style={{ background: t.gradient }}></div>
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h2>Preferences</h2>
          <div className="preference-item">
            <div>
              <strong>Enable Notifications</strong>
              <p>Get notified about task updates</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <div>
              <strong>Auto-delete Completed Tasks</strong>
              <p>Automatically remove tasks after 7 days</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={autoDelete}
                onChange={(e) => setAutoDelete(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave} className="save-btn">Save Settings</button>
          <button onClick={handleReset} className="reset-btn">Reset to Default</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
