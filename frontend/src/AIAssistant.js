import React, { useState } from 'react';
import axios from 'axios';
import './AIAssistant.css';

function AIAssistant({ onAddTask }) {
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [breakdown, setBreakdown] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/suggestions`, 
        { context }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('AI error:', error);
    }
    setLoading(false);
  };

  const getBreakdown = async () => {
    if (!taskInput) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/breakdown`, 
        { task: taskInput }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBreakdown(data.subtasks);
    } catch (error) {
      console.error('AI error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-assistant">
      <h2>🤖 AI Assistant</h2>
      
      <div className="ai-section">
        <h3>Get Task Suggestions</h3>
        <input 
          value={context} 
          onChange={(e) => setContext(e.target.value)}
          placeholder="e.g., work, personal, fitness"
        />
        <button onClick={getSuggestions} disabled={loading}>
          {loading ? 'Generating...' : 'Get Suggestions'}
        </button>
        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((s, i) => (
              <div key={i} className="suggestion-item">
                <span>{s}</span>
                <button onClick={() => onAddTask(s)}>Add</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ai-section">
        <h3>Break Down Task</h3>
        <input 
          value={taskInput} 
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter complex task"
        />
        <button onClick={getBreakdown} disabled={loading}>
          {loading ? 'Breaking down...' : 'Break Down'}
        </button>
        {breakdown.length > 0 && (
          <div className="suggestions">
            {breakdown.map((s, i) => (
              <div key={i} className="suggestion-item">
                <span>{s}</span>
                <button onClick={() => onAddTask(s)}>Add</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;
