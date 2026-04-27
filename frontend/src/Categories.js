import React, { useState } from 'react';
import './Categories.css';

function Categories({ theme, tasks, onBack }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = {
    all: { name: 'All Tasks', icon: '📋' },
    work: { name: 'Work', icon: '💼' },
    personal: { name: 'Personal', icon: '👤' },
    shopping: { name: 'Shopping', icon: '🛒' },
    health: { name: 'Health', icon: '💪' },
    other: { name: 'Other', icon: '📌' }
  };

  const categorizeTask = (task) => {
    const title = task.title.toLowerCase();
    if (title.includes('work') || title.includes('meeting') || title.includes('project')) return 'work';
    if (title.includes('buy') || title.includes('shop') || title.includes('purchase')) return 'shopping';
    if (title.includes('gym') || title.includes('exercise') || title.includes('health')) return 'health';
    if (title.includes('personal') || title.includes('family') || title.includes('friend')) return 'personal';
    return 'other';
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => categorizeTask(task) === selectedCategory);

  const getCategoryCount = (category) => {
    if (category === 'all') return tasks.length;
    return tasks.filter(task => categorizeTask(task) === category).length;
  };

  return (
    <div className={`categories-container theme-${theme}`}>
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1>📂 Task Categories</h1>
      
      <div className="category-grid">
        {Object.entries(categories).map(([key, { name, icon }]) => (
          <div
            key={key}
            className={`category-card ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
          >
            <div className="category-icon">{icon}</div>
            <div className="category-name">{name}</div>
            <div className="category-count">{getCategoryCount(key)} tasks</div>
          </div>
        ))}
      </div>

      <div className="tasks-section">
        <h2>{categories[selectedCategory].icon} {categories[selectedCategory].name}</h2>
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks in this category</p>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task._id} className={task.completed ? 'completed' : ''}>
                <span className="task-icon">{categories[categorizeTask(task)].icon}</span>
                <span className="task-title">{task.title}</span>
                {task.completed && <span className="check-mark">✓</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Categories;
