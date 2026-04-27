import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './FloatingChatbot.css';

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setMessages(data.history.slice(-10));
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }
    setLoading(false);
  };

  const quickActions = [
    { text: 'Analyze my tasks', action: 'Analyze my current tasks and give me insights' },
    { text: 'Create a task', action: 'Help me create a new task' },
    { text: 'Productivity tips', action: 'Give me productivity tips' }
  ];

  return (
    <>
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="chatbot-icon">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="bot-avatar">🤖</span>
              <div>
                <h3>AI Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="welcome-msg">
                <h4>Hi there 👋</h4>
                <p>How can I help you today?</p>
                <div className="quick-actions">
                  {quickActions.map((action, idx) => (
                    <button key={idx} onClick={() => {
                      setInput(action.action);
                      sendMessage({ preventDefault: () => {} });
                    }}>
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>
                <div className="msg-content">{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="msg-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={sendMessage}>
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
      )}
    </>
  );
}

export default FloatingChatbot;
