import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/ai/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(data.messages);
    } catch (error) {
      console.error('Load history error:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`${API_URL}/ai/chat`, 
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data.history);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Unable to get response' }]);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/ai/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>🤖 AI Chat Assistant</h1>
        <button onClick={clearHistory} className="clear-btn">Clear</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>Welcome! Ask me anything.</h2>
            <p>I can help with tasks, answer questions, or just chat!</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content typing">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
