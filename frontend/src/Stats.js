import React from 'react';
import './Stats.css';

function Stats({ tasks, onBack }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats">
      <button className="back-button" onClick={onBack}>← Back to Tasks</button>
      <div className="stats-content">
        <h1>📊 Task Statistics</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card rate">
            <div className="stat-number">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        {total > 0 && (
          <div className="progress-section">
            <h3>Progress</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="empty-stats">
            <p>No tasks yet. Start adding tasks to see statistics!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;
