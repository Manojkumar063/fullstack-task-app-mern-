import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIInsights.css';

function AIInsights({ tasks, onBack }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const analyzeTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/analyze`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  const handleVoiceToTask = async () => {
    if (!voiceInput.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/voice-to-task`, 
        { voiceText: voiceInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Task Created:\nTitle: ${data.task.title}\nPriority: ${data.task.priority}\nCategory: ${data.task.category}`);
      setVoiceInput('');
    } catch (error) {
      console.error('Voice error:', error);
    }
    setLoading(false);
  };

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/smart-search`, 
        { query: searchQuery },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>🧠 AI Insights</h1>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h2>📊 Task Analysis</h2>
          <button onClick={analyzeTasks} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze My Tasks'}
          </button>
          {analysis && (
            <div className="analysis-result">
              <pre>{analysis}</pre>
            </div>
          )}
        </div>

        <div className="insight-card">
          <h2>🎤 Voice to Task</h2>
          <textarea
            value={voiceInput}
            onChange={(e) => setVoiceInput(e.target.value)}
            placeholder="Say: 'Create a high priority work task to finish the report by Friday'"
            rows="3"
          />
          <button onClick={handleVoiceToTask} disabled={loading || !voiceInput.trim()}>
            {loading ? 'Processing...' : 'Convert to Task'}
          </button>
        </div>

        <div className="insight-card">
          <h2>🔍 Smart Search</h2>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks naturally: 'urgent work items'"
          />
          <button onClick={handleSmartSearch} disabled={loading || !searchQuery.trim()}>
            {loading ? 'Searching...' : 'Smart Search'}
          </button>
          {searchResults && (
            <div className="search-result">
              <p>{searchResults}</p>
            </div>
          )}
        </div>

        <div className="insight-card">
          <h2>✨ Quick Stats</h2>
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-label">Total Tasks:</span>
              <span className="stat-value">{tasks.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">{tasks.filter(t => t.completed).length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Pending:</span>
              <span className="stat-value">{tasks.filter(t => !t.completed).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;
