import React, { useState } from 'react';
import axios from 'axios';
import './DocumentParser.css';

function DocumentParser({ onBack, onTasksCreated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [parsedTasks, setParsedTasks] = useState([]);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg', 'image/jpg'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Invalid file type. Use PDF, TXT, or images.');
        setFile(null);
      }
    }
  };

  const parseDocument = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/upload/parse`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setParsedTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to parse document');
    }
    setLoading(false);
  };

  const createAllTasks = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('document', file);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/upload/parse-and-create`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(`✅ Created ${data.count} tasks from document!`);
      onTasksCreated?.();
      setParsedTasks([]);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tasks');
    }
    setLoading(false);
  };

  return (
    <div className="document-parser">
      <div className="parser-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>📄 Document to Tasks</h1>
      </div>

      <div className="parser-content">
        <div className="upload-section">
          <h2>Upload Document</h2>
          <p>Supported: PDF, TXT, PNG, JPG</p>
          
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.png,.jpg,.jpeg"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              {file ? file.name : 'Choose File'}
            </label>
          </div>

          {file && (
            <div className="action-buttons">
              <button onClick={parseDocument} disabled={loading}>
                {loading ? 'Parsing...' : '🔍 Preview Tasks'}
              </button>
              <button onClick={createAllTasks} disabled={loading} className="create-btn">
                {loading ? 'Creating...' : '✅ Create All Tasks'}
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        {parsedTasks.length > 0 && (
          <div className="preview-section">
            <h2>Preview ({parsedTasks.length} tasks found)</h2>
            <div className="tasks-preview">
              {parsedTasks.map((task, idx) => (
                <div key={idx} className="task-preview-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`priority ${task.priority?.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && <p>{task.description}</p>}
                  {task.category && <span className="category">{task.category}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="examples-section">
          <h3>💡 Examples</h3>
          <ul>
            <li>📄 Meeting notes → Action items</li>
            <li>📋 Project plans → Task breakdown</li>
            <li>📧 Email screenshots → To-do list</li>
            <li>📝 Handwritten notes → Digital tasks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DocumentParser;
