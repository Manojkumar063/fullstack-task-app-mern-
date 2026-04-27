import React, { useState } from 'react';
import './Search.css';

function Search({ tasks, onBack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.completed) ||
                         (filter === 'pending' && !task.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="search-page">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h1>Search Tasks</h1>
      
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="search-results">
        <p>{filteredTasks.length} task(s) found</p>
        {filteredTasks.length === 0 ? (
          <div className="no-results">No tasks match your search</div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => (
              <li key={task._id} className={task.completed ? 'completed' : ''}>
                <span>{task.title}</span>
                <span className="task-status">
                  {task.completed ? '✓ Completed' : '○ Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
